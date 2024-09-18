import Shoot from './shoot.js';

export default class CoreCannon {
    constructor(canvasId, x, lives) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.posX = x;
        this.posY = 550;
        this.sizeX = 30;
        this.sizeY = 30;
        this.lives = lives;
        this.weapon = null;
        this.img = new Image();
        this.img.src = './img/CANNON.jpg';
        this.img.onload = function () {
            this.ctx.drawImage(this.img, this.posX, this.posY, this.sizeX, this.sizeY);
        }

        window.addEventListener('keydown', (event) =>{
            switch(event.key){
                case 'ArrowLeft':
                    if(this.posX - 80 >= 0)
                        this.posX -= 20;
                    break;
                
                case 'ArrowRight':
                    if(this.posX + 20 <= this.canvas.width - 60)
                        this.posX += 10;
                    break; 

                case 'ArrowUp':
                    if(this.weapon === null){
                        this.weapon = new Shoot(canvasId, this.posX + 15, this.posY - 15, 1);
                    }
                    break;
                        
                    
            }
        })
    }

    draw() {
        this.ctx.drawImage(this.img, this.posX, this.posY, this.sizeX, this.sizeY);

        if(this.weapon != null){
            this.weapon.draw();
            this.weapon.move();
            if(this.weapon.destructable())
                this.weapon = null;
        }
    }

    isColliding(target) {
        if (this.weapon === null)
            return false;
        return this.weapon.posX < target.posX + target.sizeX &&
            this.weapon.posX + 5 > target.posX &&
            this.weapon.posY < target.posY + target.sizeY &&
            this.weapon.posY + 10 > target.sizeY;
    }

}