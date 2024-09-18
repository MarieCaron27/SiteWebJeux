const canvasElement = document.getElementById('my-canvas'); // récup l'élément d'id "my-canvas" de mon .html
const ctx = canvasElement.getContext('2d'); // contexte de rendu 2d dans mon canvas (dessins sur axe X et Y possible)


const coteCarre = canvasElement.height * 8 / 100;
var ySol = canvasElement.height * 100 / 100;
var jumpMax;
const coteObstacleTriangle = canvasElement.height * 6 / 100;
const coteObstacleMur1 = canvasElement.height * 8 / 100;
const coteObstacleMur2 = coteObstacleMur1 * 2;
const coteObstacleMur3 = coteObstacleMur1 * 3;
const up = coteCarre * 1.7;
var upORdown = 0;
const gravity = 60 / 100;
const speed = canvasElement.width * 2 / 1000;
const minDelay = 2000; // 2 seconde en millisecondes
const maxDelay = 5000; // 5 secondes en millisecondes
const randomSpawnObstacleMin = 0;
const randomSpawnObstacleMax = 3;
const maxShield = 100;
var shieldLevel = 0;
const shieldBarWidth = 100; // Largeur de la barre de shield
const shieldBarHeight = 5; // Hauteur de la barre de shield
const shieldBarBackgroundColor = "rgb(255, 255, 255)"; // Couleur de fond de la barre de shield
const shieldBarColor = "rgb(0, 255, 0)"; // Couleur de remplissage de la barre de shield
let gameEnd = 0;
const endMessage = "Fin du jeu!";
let score = 0;


import { carre, updateCarre, keyboardControls, updateYSol, drawCarre, drawShieldBar } from './player.js';
import { obstacles, generateObstacles, updateObstacles, checkCollision, drawObstacles } from './obstacle.js';


function updateScore() {
    if (gameEnd == 0) {
        score++;
        document.getElementById('currentScore').textContent = score;
    }
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

function getBestScore() {
    const gameId = window.location.pathname.match(/game(\d+)/)[1]; 

    // Fetching the best score from your backend
    fetch(`/scores/best?gameId=${gameId}`)
        .then(response => response.json())
        .then(data => {
            // Assuming your API returns a JSON with a field 'bestScore' that holds the best score value
            const highScore = data.bestScore;
            document.getElementById('bestScore').textContent = highScore;  // Update the DOM element with the fetched score
        })
        .catch(error => console.error('Failed to fetch best score:', error));
}


function clearCanvas() {
    ctx.clearRect(0, 0, canvasElement.width, canvasElement.height); // Supprime tous les élément dessinés dans mon canvas
}


export function endGame() {
    gameEnd = 1;
    saveScore();
    document.getElementById('gameOverModal').style.display = 'flex';
}


getBestScore();
drawCarre();
generateObstacles();
setInterval(updateScore, 1000);


function animate() {
    if (gameEnd == 0) {
        clearCanvas();

        updateCarre();
        updateObstacles();
        updateYSol();

        checkCollision();

        drawCarre();
        drawObstacles();
        drawShieldBar();

        requestAnimationFrame(animate);
    }
}

requestAnimationFrame(animate);


keyboardControls();


document.getElementById('restartButton').addEventListener('click', restartGame);
function restartGame() {
    // Recharge la page pour relancer le jeu
    window.location.reload();
}

document.getElementById('quitButton').addEventListener('click', function () {
    window.history.back();
});
