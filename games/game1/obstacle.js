const canvasElement = document.getElementById('my-canvas'); // récup l'élément d'id "my-canvas" de mon .html
const ctx = canvasElement.getContext('2d'); // contexte de rendu 2d dans mon canvas (dessins sur axe X et Y possible)


const coteCarre = canvasElement.height*8/100;
var ySol = canvasElement.height*100/100;
var jumpMax;
const coteObstacleTriangle = canvasElement.height*6/100;
const coteObstacleMur1 = canvasElement.height*8/100;
const coteObstacleMur2 = coteObstacleMur1*2;
const coteObstacleMur3 = coteObstacleMur1*3;
const up = coteCarre*1.7;
var upORdown = 0;
const gravity = 60/100;
const speed = canvasElement.width*2/1000;
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


import { carre } from './player.js';
import { endGame } from './game.js';


export const obstacles = [];

export function generateObstacles()
{
    if(gameEnd == 0)
    {
        let randomDelay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
        let randomObstacle = Math.floor(Math.random() * (randomSpawnObstacleMax - randomSpawnObstacleMin + 1)) + randomSpawnObstacleMin;

        const space = {
            space0: coteObstacleTriangle,
            space1: coteObstacleMur1,
        };

        const obstacleTriangle = {
            type: 0,
            xS1: canvasElement.width*100/100, // sommet bas gauche du triangle
            yS1: canvasElement.height*100/100, // sommet bas gauche du triangle
            xS2: canvasElement.width*100/100 + coteObstacleTriangle, // sommet bas droit du triangle
            yS2: canvasElement.height*100/100, // sommet bas droit du triangle
            xS3: canvasElement.width*100/100 + 0.5*coteObstacleTriangle, // sommet haut du triangle
            yS3: canvasElement.height*100/100 - coteObstacleTriangle, // sommet haut du triangle
            color: "rgb(255, 0, 255)"
        };

        const obstacleMur1 = {
            type: 1,
            x: canvasElement.width*100/100,
            y: canvasElement.height*100/100 - coteObstacleMur1,
            color: "rgb(255, 255, 0)"
        };

        const obstacleMur2 = {
            type: 2,
            x: canvasElement.width*100/100,
            y: canvasElement.height*100/100 - coteObstacleMur2,
            color: "rgb(255, 0, 0)"
        };

        const obstacleMur3 = {
            type: 3,
            x: canvasElement.width*100/100,
            y: canvasElement.height*100/100 - coteObstacleMur3,
            color: "rgb(0, 0, 255)"
        };

        switch(randomObstacle)
        {        
            case 0: // triangle simple
                obstacles.push(obstacleTriangle);

                break;

            case 1: // mur simple + série de 3 triangles
            {
                obstacles.push(obstacleMur1);

                for (let i = 1; i < 4; i++) 
                {
                    let newObstacleTriangle = { ...obstacleTriangle }; 
                    newObstacleTriangle.xS1 += i * space.space1;
                    newObstacleTriangle.xS2 += i * space.space1; 
                    newObstacleTriangle.xS3 += i * space.space1;  
                    obstacles.push(newObstacleTriangle); 
                }

                break;
            }
                
            case 2: // escalier 2 niveaux
            {
                obstacles.push(obstacleMur1);

                let newObstacleMur2 = { ...obstacleMur2 }; 
                newObstacleMur2.x += 3*space.space1;
                obstacles.push(newObstacleMur2);
                
                break;
            }
    
            case 3: // escalier 3 niveaux
            {
                obstacles.push(obstacleMur1);

                let newObstacleMur2 = { ...obstacleMur2 }; 
                newObstacleMur2.x += 3*space.space1;
                obstacles.push(newObstacleMur2);

                let newObstacleMur3 = { ...obstacleMur3 }; 
                newObstacleMur3.x += 6*space.space1;
                obstacles.push(newObstacleMur3);
                
                break;
            }

            case 4:
                
                break;
        }

        setTimeout(generateObstacles, randomDelay);
        //console.log(randomObstacle,randomDelay);
    }
}

export function updateObstacles() {
    //console.log(obstacles);

    for (let i = 0; i < obstacles.length; i++) 
    {
        switch(obstacles[i].type)
        {
            case 0:
                //console.log("triangle");
                obstacles[i].xS1 -= speed;
                obstacles[i].xS2 -= speed;
                obstacles[i].xS3 -= speed;

                if(obstacles[i].xS2 < 0) // Obstacle hors zone (gauche)
                {
                    //console.log("Supp triangle");
                    obstacles.splice(i, 1);
                }
                break;

            case 1:
                //console.log("mur");
                obstacles[i].x -= speed;

                if(obstacles[i].x + coteObstacleMur1 < 0) // Obstacle hors zone (gauche)
                { 
                    //console.log("Supp mur");
                    obstacles.splice(i, 1);
                }
                break;

            case 2:
                //console.log("mur 2");
                obstacles[i].x -= speed;

                if(obstacles[i].x + coteObstacleMur1 < 0) // Obstacle hors zone (gauche)
                { 
                    //console.log("Supp mur 2");
                    obstacles.splice(i, 1);
                }
                break;

            case 3:
                //console.log("mur 3");
                obstacles[i].x -= speed;

                if(obstacles[i].x + coteObstacleMur1 < 0) // Obstacle hors zone (gauche)
                { 
                    //console.log("Supp mur 3");
                    obstacles.splice(i, 1);
                }
                break;
        }
    }
}

export function checkCollision() {
    for (let i = 0; i < obstacles.length; i++) 
    {
        switch(obstacles[i].type)
        {
            case 0:
                if(carre.shield == 0)
                {
                    if (
                        (carre.x + coteCarre >= obstacles[i].xS1 && carre.x <= obstacles[i].xS2 && carre.y + coteCarre >= obstacles[i].yS1) ||
                        (carre.x + coteCarre >= obstacles[i].xS2 && carre.x <= obstacles[i].xS3 && carre.y + coteCarre >= obstacles[i].yS2) ||
                        (carre.x >= obstacles[i].xS1 && carre.x + coteCarre <= obstacles[i].xS3 && carre.y + coteCarre >= obstacles[i].yS3)
                    ) {
                        //console.log('Collision avec Triangle détectée !');
                        endGame();
                    }
                }
                
                break;

            case 1: 
                if(carre.shield == 0)
                {
                    if (
                        carre.x < obstacles[i].x + coteObstacleMur1 &&
                        carre.x + coteCarre > obstacles[i].x &&
                        carre.y < obstacles[i].y + coteObstacleMur1 &&
                        carre.y + coteCarre > obstacles[i].y
                    ) {
                        //console.log('Collision avec obstacleMur1 détectée !');
                        endGame();
                    }
                }
                
                break;

            case 2: 
                if(carre.shield == 0)
                {
                    if (
                        carre.x < obstacles[i].x + coteObstacleMur1 &&
                        carre.x + coteCarre > obstacles[i].x &&
                        carre.y < obstacles[i].y + coteObstacleMur2 &&
                        carre.y + coteCarre > obstacles[i].y
                    ) {
                        //console.log('Collision avec obstacleMur2 détectée !');
                        endGame();
                    }
                }
                
                break;

            case 3: 
                if(carre.shield == 0)
                {
                    if (
                        carre.x < obstacles[i].x + coteObstacleMur1 &&
                        carre.x + coteCarre > obstacles[i].x &&
                        carre.y < obstacles[i].y + coteObstacleMur3 &&
                        carre.y + coteCarre > obstacles[i].y
                    ) {
                        //console.log('Collision avec obstacleMur3 détectée !');
                        endGame();
                    }
                }
                
                break;
        }
    }
}

export function drawObstacles() {
    for (let i = 0; i < obstacles.length; i++) 
    {
        switch(obstacles[i].type)
        {
            case 0:
                //console.log("triangle");
                ctx.fillStyle = obstacles[i].color;
                ctx.beginPath();
                ctx.moveTo(obstacles[i].xS1, obstacles[i].yS1);
                ctx.lineTo(obstacles[i].xS2, obstacles[i].yS2);
                ctx.lineTo(obstacles[i].xS3, obstacles[i].yS3);
                ctx.closePath();
                ctx.fill();
                break;
            
            case 1:
                //console.log("mur");
                ctx.fillStyle = obstacles[i].color;
                ctx.beginPath();
                ctx.fillRect(obstacles[i].x, obstacles[i].y, coteObstacleMur1, coteObstacleMur1);
                ctx.closePath();
                ctx.fill();
                break;

            case 2:
                //console.log("mur 2");
                ctx.fillStyle = obstacles[i].color;
                ctx.beginPath();
                ctx.fillRect(obstacles[i].x, obstacles[i].y, coteObstacleMur1, coteObstacleMur2);
                ctx.closePath();
                ctx.fill();

                /*ctx.fillStyle = obstacles[i].color;
                ctx.fillRect(obstacles[i].x, obstacles[i].y, coteObstacleMur1, coteObstacleMur2);
                // Dessiner le point rouge à l'emplacement spécifique (par exemple, le coin supérieur gauche de l'obstacle)
                const pointSize = 1; // Taille du point rouge
                const pointX = obstacles[i].x; // Coordonnée X du point (coin supérieur gauche de l'obstacle)
                const pointY = obstacles[i].y; // Coordonnée Y du point (coin supérieur gauche de l'obstacle)
                ctx.fillStyle = 'red';
                ctx.fillRect(pointX, pointY, pointSize, pointSize); // Dessiner un petit rectangle rouge (point)*/

                break;
            
            case 3:
                //console.log("mur 3");
                ctx.fillStyle = obstacles[i].color;
                ctx.beginPath();
                ctx.fillRect(obstacles[i].x, obstacles[i].y, coteObstacleMur1, coteObstacleMur3);
                ctx.closePath();
                ctx.fill();
                break;
        }
    }
}