import { canvaHeight, canvaWidth, leftOrRight, roomElementSize, roomHeight, roomWidth, upOrDown } from "./utils.js"

export class Sprite{
    constructor(canvasId, name, x, y, width, height, scale, framesMax){
        this.canvas = document.getElementById(canvasId)
        this.ctx = this.canvas.getContext('2d')
        this.name = name
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.image = new Image()
        this.image.src = "images/" + this.name + ".png"
        this.scale = scale
        this.framesMax = framesMax
        this.currentFrame = 0
        this.currentLoopIndex = 0
        this.scaledWidth = scale * width;
        this.scaledHeight = scale * height;
    }

    draw(){
        this.ctx.drawImage(this.image,
            this.currentLoopIndex * this.width, 0, this.width, this.height,
            this.x, this.y, this.scaledWidth, this.scaledHeight);
    }

    animateFrames(){
        this.currentFrame++;
        if(this.currentFrame % 5 === 0){
            if(this.currentLoopIndex < this.framesMax){
                this.currentLoopIndex++
            }
            
            if(this.currentLoopIndex >= this.framesMax){
                this.currentLoopIndex = 0
            }
        }
    }

    isColliding(otherSprite, threshold = 500) {
        // Calculate the overlap in the x and y dimensions
        // Math.min(this.x + this.scaledWidth, otherSprite.x + otherSprite.scaledWidth) gives the rightmost edge of the overlapping region.
        // Math.max(this.x, otherSprite.x) gives the leftmost edge of the overlapping region.
        // Subtracting these two values gives the width of the overlapping region.
        // Math.max(0, ...) ensures that we don't get a negative value if there is no overlap.
        const overlapX = Math.max(0, Math.min(this.x + this.scaledWidth, otherSprite.x + otherSprite.scaledWidth) - Math.max(this.x, otherSprite.x));
        const overlapY = Math.max(0, Math.min(this.y + this.scaledHeight, otherSprite.y + otherSprite.scaledHeight) - Math.max(this.y, otherSprite.y));
    
        // Calculate the area of the overlapping region
        // Multiply the width and height of the overlapping region to get the area.
        const overlapArea = overlapX * overlapY;
    
        // Return true if the overlapping area is at least the threshold
        // Return true if the overlapping area is greater than or equal to the threshold, otherwise false.
        return overlapArea >= threshold;
    }    

    update(){
        this.draw()
        if(this.framesMax > 1)
            this.animateFrames()
    }
}


export class Player extends Sprite{
    constructor(canvasId, name, x, y, width, height, scale, velocity, health, framesMax){
        super(canvasId, name, x, y, width, height, scale, framesMax)
        this.velocity = velocity
        this.health = health
        this.isHit = false
        this.keys = {
            left:{
                pressed: false
            },
            right:{
                pressed: false
            },
            up:{
                pressed: false
            },
            down:{
                pressed: false
            }
        }

        window.addEventListener('keydown', (event) => {
            switch (event.key){
                case 'ArrowLeft':
                    this.keys.left.pressed = true
                    break
                case 'ArrowRight':
                    this.keys.right.pressed = true
                    break
                case 'ArrowUp':
                    this.keys.up.pressed = true
                    break
                case 'ArrowDown':
                    this.keys.down.pressed = true
                    break
            }
        })
        
        window.addEventListener('keyup', (event) => {
            switch (event.key){
                case 'ArrowLeft':
                    this.keys.left.pressed = false
                    break
                case 'ArrowRight':
                    this.keys.right.pressed = false
                    break
                case 'ArrowUp':
                    this.keys.up.pressed = false
                    break
                case 'ArrowDown':
                    this.keys.down.pressed = false
                    break
            }
        })
    }

    update(){
        this.draw()
        this.animateFrames()

        if(this.keys.left.pressed)
            this.x -= this.velocity
        if(this.keys.right.pressed)
            this.x += this.velocity
        if(this.keys.up.pressed)
            this.y -= this.velocity
        if(this.keys.down.pressed)
            this.y += this.velocity

        if(this.x <= roomElementSize)
            this.x = roomElementSize
        if(this.x >= canvaWidth - this.scaledWidth - roomElementSize)
            this.x = canvaWidth - this.scaledWidth - roomElementSize
        if(this.y <= roomElementSize)
            this.y = roomElementSize
        if(this.y >= canvaHeight - this.scaledHeight - roomElementSize)
            this.y = canvaHeight - this.scaledHeight - roomElementSize
    }
}

export class Bullet extends Sprite{
    constructor(canvasId, name, x, y, width, height, scale, velocity, framesMax){
        super(canvasId, name, x, y, width, height, scale, framesMax)
        this.velocity = velocity

        if(y === upOrDown[0])
            this.direction = "down"
        else if(y === upOrDown[1])
            this.direction = "up"
        else if(x === leftOrRight[0])
            this.direction = "right"
        else if(x === leftOrRight[1])
            this.direction = "left"
    }

    update(){
        this.draw()
        this.animateFrames()

        if(this.direction === "down")
            this.y += this.velocity
        else if(this.direction === "up")
            this.y -= this.velocity
        else if(this.direction === "right")
            this.x += this.velocity
        else
            this.x -= this.velocity
    }
}