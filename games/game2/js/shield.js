export default class Shield {
    constructor(canvasID, x, y, lives){
        this.canvas = document.getElementById(canvasID);
        this.ctx = this.canvas.getContext('2d');
        this.posX = x;
        this.posY = y;
        this.sizeX = 70;
        this.sizeY = 20;
        this.lives = lives;
        this.img = new Image();
        this.img.src = './img/shield.jpg';
        this.img.onload = function () {
            this.ctx.drawImage(this.img, this.posX, this.posY, this.sizeX, this.sizeY);
        }
    }
    
    draw(){
        if(this.lives > 0){
            this.ctx.drawImage(this.img, this.posX, this.posY, this.sizeX, this.sizeY);
        }
    }


}