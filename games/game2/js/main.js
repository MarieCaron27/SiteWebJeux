import Invader from './invader.js';
import Shield from './shield.js';
import CoreCannon from'./coreCannon.js';

const canvasBckg = document.getElementById('myCanvasBackground');
const ctxBckg = canvasBckg.getContext('2d');

const afficheGameOver = document.getElementById('gameOver');
const scoreDisplay = document.getElementById('scoreDisplay');
document.getElementById('restartButton').addEventListener('click', () =>{
    window.location.reload();
});

document.getElementById('quitButton').addEventListener('click',  ()=> {
    window.history.back();
});



var deplacementInvader = 0;
var typeDeplacementInvader = 1;

const img = new Image();
img.src = './img/back.jpg';
img.onload = function () {
    ctxBckg.drawImage(img, 0, 0, canvasBckg.width, canvasBckg.height);   
}
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

const Core = new CoreCannon('myCanvas', 350, 3);
const ArrayShield = Array(4);
ArrayShield[0] = new Shield('myCanvas', 100, 500, 3);
ArrayShield[1] = new Shield('myCanvas', 250, 500, 3);
ArrayShield[2] = new Shield('myCanvas', 400, 500, 3);
ArrayShield[3] = new Shield('myCanvas', 550, 500, 3);


const ArrayInvader = Array(18).fill(null).map(
    (_, index) => {
        const x = 100 + (index % 6) * 100;
        const y = 100 + Math.floor(index / 6) * 50;
        return new Invader('myCanvas', x, y, 2);
    }
);


var gameOver = false;
var gameSucced = false;
var score = 0;
var deplacement = 0;

function resizeBckg(){
    if (window.innerWidth - 20>750)
        canvasBckg.width = window.innerWidth- 20;
    if (window.innerHeight -20>600)
    canvasBckg.height = window.innerHeight-20;
        


    ctxBckg.drawImage(img, 0, 0, canvasBckg.width, canvasBckg.height);
}

function animate() {
    ctx.clearRect(0,0, canvas.width, canvas.height);
    resizeBckg();
    gameSucced = true;

    for(let invader of ArrayInvader){
        if(invader.isColliding(Core)){
            Core.lives--;
            invader.weapon = null;
        }     
        for(let shield of ArrayShield){
            if (shield.lives > 0 && invader.isColliding(shield)){
                shield.lives--;
                invader.weapon = null;
            }

        }
        if(invader.live > 0 && Core.isColliding(invader)){
            invader.live--;
            if(invader.live <= 0)
                score++;
            Core.weapon = null;
        }
    }
    if(deplacementInvader === 60){
        if (typeDeplacementInvader >= 4 || typeDeplacementInvader <= -4){

            for (let invader of ArrayInvader)
                invader.move(3);
            if(typeDeplacementInvader>0){
                typeDeplacementInvader = -1;
            }
            else
                typeDeplacementInvader = 1;
        }
        else if (typeDeplacementInvader > 0){
            for (let invader of ArrayInvader)
                invader.move(1);
            typeDeplacementInvader++;
        }
        else if (typeDeplacementInvader < 0){ 
            for (let invader of ArrayInvader)
                invader.move(2);
            typeDeplacementInvader--;
        }
        deplacementInvader = 0;
    }
    deplacementInvader++;
    if(Math.random() * 30 <= 1){
        ArrayInvader[Math.floor(Math.random()*18)].fire();
    }

    Core.draw();
    
    for(let shield of ArrayShield)
        shield.draw();
    
    
    for(let invader of ArrayInvader){
        if(invader.live>0)
            gameSucced = false;
        invader.draw();
        if(invader.posY >= 450)
            gameOver = true;
    }
    
    ctx.font = '20px Arial';
    ctx.fillStyle = 'green';
    ctx.fillText('Lives: ' + Core.lives, canvas.width - 200, canvas.height-40);
    ctx.font = '20px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText('Score: ' + score, canvas.width - 200, 30);
    
    
    if(Core.lives <= 0)
        gameOver = true;
    
    if(gameSucced){
        score += Core.lives * 4;
        score += Math.floor(15 - (deplacement/3121)*15);
        for(let shield of ArrayShield)
            if(shield.lives > 0)
                score += 2;
    }
    
    deplacement++;
    if (!gameOver && !gameSucced) {
        requestAnimationFrame(animate);
    }
    else{
        saveScore();
        displayGameOver();
    }

}

function displayGameOver(){
    scoreDisplay.textContent = `Score: ${score}`;
    afficheGameOver.style.display = 'flex';

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

animate();
