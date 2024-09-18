import { Sprite, Player, Bullet } from './sprite.js';
import { canvaHeight, canvaWidth, columns, leftOrRight, possibleXCoords, possibleYCoords, roomElementSize, roomHeight, roomWidth, rows, upOrDown } from './utils.js';

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const healthBar = document.getElementById('health-bar');
const scoreElement = document.getElementById('score');
const roundElement = document.getElementById('round');

let score = 0
let round = 0

const gridArray = [ ["wall-regular", "wall-north", "canon-north", "wall-north", "canon-north", "wall-north", "canon-north", "wall-north", "canon-north", "wall-north", "canon-north", "wall-north", "canon-north", "wall-north", "wall-regular"],
                    ["canon-west", "floor-even", "floor-odd", "floor-even", "floor-odd", "floor-even", "floor-odd", "floor-even", "floor-odd", "floor-even", "floor-odd", "floor-even", "floor-odd", "floor-even", "wall-regular"],
                    ["wall-regular", "floor-odd", "floor-even", "floor-odd", "floor-even", "floor-odd", "floor-even", "floor-odd", "floor-even", "floor-odd", "floor-even", "floor-odd", "floor-even", "floor-odd", "canon-east"],
                    ["canon-west", "floor-even", "floor-odd", "floor-even", "floor-odd", "floor-even", "floor-odd", "floor-even", "floor-odd", "floor-even", "floor-odd", "floor-even", "floor-odd", "floor-even", "wall-regular"],
                    ["wall-regular", "floor-odd", "floor-even", "floor-odd", "floor-even", "floor-odd", "floor-even", "floor-odd", "floor-even", "floor-odd", "floor-even", "floor-odd", "floor-even", "floor-odd", "canon-east"],
                    ["canon-west", "floor-even", "floor-odd", "floor-even", "floor-odd", "floor-even", "floor-odd", "floor-even", "floor-odd", "floor-even", "floor-odd", "floor-even", "floor-odd", "floor-even", "wall-regular"],
                    ["wall-regular", "floor-odd", "floor-even", "floor-odd", "floor-even", "floor-odd", "floor-even", "floor-odd", "floor-even", "floor-odd", "floor-even", "floor-odd", "floor-even", "floor-odd", "canon-east"],
                    ["canon-west", "floor-even", "floor-odd", "floor-even", "floor-odd", "floor-even", "floor-odd", "floor-even", "floor-odd", "floor-even", "floor-odd", "floor-even", "floor-odd", "floor-even", "wall-regular"],
                    ["wall-regular", "floor-odd", "floor-even", "floor-odd", "floor-even", "floor-odd", "floor-even", "floor-odd", "floor-even", "floor-odd", "floor-even", "floor-odd", "floor-even", "floor-odd", "canon-east"],
                    ["canon-west", "floor-even", "floor-odd", "floor-even", "floor-odd", "floor-even", "floor-odd", "floor-even", "floor-odd", "floor-even", "floor-odd", "floor-even", "floor-odd", "floor-even", "wall-regular"],
                    ["wall-regular", "floor-odd", "floor-even", "floor-odd", "floor-even", "floor-odd", "floor-even", "floor-odd", "floor-even", "floor-odd", "floor-even", "floor-odd", "floor-even", "floor-odd", "canon-east"],
                    ["wall-regular", "wall-regular", "canon-south", "wall-regular", "canon-south", "wall-regular", "canon-south", "wall-regular", "canon-south", "wall-regular", "canon-south", "wall-regular", "canon-south", "wall-regular", "wall-regular"]
                ]

const player = new Player("myCanvas", "shroom", roomWidth / 2, roomHeight / 2, 36, 37, 1.5, 10, 100, 6);
const fruit = new Sprite("myCanvas", "fruit", 200, 200, 16, 16, 2, 1)
const tiles = new Array()
const walls = new Array()
const bullets = new Array()

for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++){
        const newRoomElement = new Sprite("myCanvas", gridArray[i][j], j * roomElementSize, i * roomElementSize, 32, 32, 2, 1)
        
        if(i === 0 || j === 0 || i === rows - 1 || j === columns - 1)
            walls.push(newRoomElement);
        else
            tiles.push(newRoomElement);
    }
}

function getRandomElement(arr){
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateBullets(){
    const isXCoord = Math.random() < 0.5;
    let x, y
    
    if(isXCoord){
        x = getRandomElement(possibleXCoords);
        y = getRandomElement(upOrDown);
    } 
    
    else{
        y = getRandomElement(possibleYCoords);
        x = getRandomElement(leftOrRight);
    }

    bullets.push(new Bullet("myCanvas", "bullet", x, y, 32, 32, 1.5, 3, 4))

    setTimeout(generateBullets, 2000)
}

function clearBullet(){
    for(let bullet of bullets){
        if(bullet.x <= 0 || bullet.x + bullet.scaledWidth >= canvaWidth || bullet.y <= 0 || bullet.y + bullet.scaledHeight >= canvaHeight){
            bullets.splice(bullets.indexOf(bullet), 1);
        }
    }
}

function generateRandomNumber(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function resetRound(){
    bullets = []
    player.x = roomWidth / 2
    player.y = roomHeight / 2
    
    fruit.x = generateRandomNumber(roomElementSize, roomWidth - fruit.scaledWidth)
    fruit.y = generateRandomNumber(roomElementSize, roomHeight - fruit.scaledWidth)
}

function saveScore() {
    const path = window.location.pathname;
    const gameId = path.match(/game(\d+)/);

    fetch('/scores/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ score: score, gameId: gameId[1] }),
    })
        .then(response => response.json())
        .then(data => console.log('Success:', data))
        .catch((error) => console.error('Error:', error));
}

generateBullets()

let now, then

function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for(let tile of tiles)
        tile.update()

    fruit.update()

    if(player.isColliding(fruit)){
        score += 1
        scoreElement.textContent = score
        fruit.x = generateRandomNumber(roomElementSize, roomWidth - fruit.scaledWidth)
        fruit.y = generateRandomNumber(roomElementSize, roomHeight - fruit.scaledWidth)
    }

    for(let bullet of bullets){
        bullet.update()
        if(player.isColliding(bullet) && !player.isHit){
            console.log("collision")
            then = Date.now()
            player.isHit = true
            player.health -= 100
            healthBar.style.width = player.health + '%';
        }
    }

    if(player.isHit){
        now = Date.now()
        if(now - then >= 2000){
            console.log("Done")
            player.isHit = false
        }
    }
    
    for(let wall of walls){
        wall.update()
    }

    clearBullet()

    player.update()

    if(player.health <= 0){
        saveScore();
        document.getElementById('gameOverModal').style.display = 'flex';
    }

    requestAnimationFrame(animate);
}

animate()