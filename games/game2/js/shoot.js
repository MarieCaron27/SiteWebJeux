export default class Shoot{
    constructor(canvasID, x, y, side){
        this.canvas = document.getElementById(canvasID);
        this.ctx = this.canvas.getContext('2d');
        this.posX = x;
        this.posY = y;
        this.side = side;
    }

    draw(){
        if(this.side === 1)
            this.ctx.fillStyle = 'blue';
    
        else if(this.side === 0)
            this.ctx.fillStyle = 'red';

        this.ctx.fillRect(this.posX, this.posY, 5, 10);

    }

    move(){
        if(this.side === 1)
            this.posY -= 10;

        else if(this.side === 0)
            this.posY += 10;     
    }
    destructable(){
        if(this.posY < 0 && this.side === 1)
            return true;
        else if(this.posY > this.canvas.height && this.side === 0)
            return true;
        return false;
    }
}