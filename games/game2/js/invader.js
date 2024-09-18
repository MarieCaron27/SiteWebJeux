import Shoot from './shoot.js';

export default class Invader{
    constructor(canvasId, x, y, live){
        this.canvasId = canvasId;
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.posX = x;
        this.posY = y;
        this.sizeX = 30;
        this.sizeY = 30;
        this.live = live;
        this.weapon = null;

        this.img = new Image();
        this.img.src = './img/INVADER.jpg';
        this.img.onload = function () {
            this.ctx.drawImage(img, this.posX, this.posY, this.sizeX, this.sizeY);
        }
    }

    draw(){
        if(this.live >0){ 
            this.ctx.drawImage(this.img, this.posX, this.posY, this.sizeX, this.sizeY);
        }
        if (this.weapon != null) {
            this.weapon.draw();
            this.weapon.move();
            if (this.weapon.destructable())
                this.weapon = null;
        }
    }

    move(type){
        if(type === 1)
            this.posX += 10; 
        else if(type === 2)
            this.posX -= 10;
        else if(type === 3)
            this.posY += 20;

    }

    fire(){
        if(this.weapon === null && this.live >0)        
            this.weapon = new Shoot(this.canvasId, this.posX + 15, this.posY + 15, 0);

    }


    isColliding(target){
        
        if(this.weapon === null)
            return false;
        return (this.weapon.posX < (target.posX + target.sizeX)) && 
            ((this.weapon.posX + 5) > target.posX) &&
            (this.weapon.posY < (target.posY + target.sizeY)) &&
            ((this.weapon.posY + 10) > target.posY);
    }

}