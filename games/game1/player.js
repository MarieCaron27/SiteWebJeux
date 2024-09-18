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


import { obstacles } from './obstacle.js';


export const carre = 
{
    x: canvasElement.width*20/100  - coteCarre,
    y: canvasElement.height*100/100  - coteCarre,
    jump: 0, // 0 = carre au sol et 1 = carre en jump
    shield: 0,
    color: "rgb(255, 255, 255)"
};

export function updateCarre() {
    
    if (upORdown == 1) 
    {
        if (carre.y + coteCarre > jumpMax) // Carre up
        {
            carre.y -= gravity;
        } 
        else 
        {
            upORdown = -1; // Passer en descente lorsque le carré atteint la hauteur maximale
        }
    } 
    
    if (upORdown == -1) 
    {
        if (carre.y + coteCarre < ySol) // Carre down
        {
            carre.y += gravity;

            if(carre.y + coteCarre > ySol) // si gravity ne fait pas tomber carre.y + coteCarre == ySol
            {
                carre.y = ySol - coteCarre;
            }
        }  

        if (carre.y + coteCarre == ySol) // Carré sur ySol
        {
            upORdown = 0; 
            carre.jump = 0;
        }
    }

    if (upORdown == 0) 
    {
        if (carre.y + coteCarre < ySol) // Carre down
        {
            carre.y += gravity;

            if(carre.y + coteCarre > ySol) // si gravity ne fait pas tomber carre.y + coteCarre == ySol
            {
                carre.y = ySol - coteCarre;
            }
        }  

        if (carre.y + coteCarre == ySol) // Carré sur ySol
        {
            upORdown = 0; 
            carre.jump = 0;
        }
    }
    
}

export function updateYSol() {
    ySol = canvasElement.height*100/100;

    for (let i = 0; i < obstacles.length; i++) 
    {
        if (carre.x < obstacles[i].x + coteObstacleMur1 &&
            carre.x + coteCarre > obstacles[i].x && 
            (
                obstacles[i].type == 1
                || obstacles[i].type == 2 
                || obstacles[i].type == 3
            )
        ) {
            ySol = obstacles[i].y;
            i = obstacles.length;
        }
    }

    //console.log(ySol);
}




export function keyboardControls(){
    window.addEventListener('keydown', (evt) => {
    
        switch (evt.key) {
            case ' ':
                if(carre.jump == 0)
                {
                    carre.jump = 1;
                    upORdown = 1;
                    jumpMax=ySol-up;
                }
                break;

            case 'ArrowUp':
                if(carre.jump == 0)
                {
                    carre.jump = 1;
                    upORdown = 1;
                    jumpMax=ySol-up;
                }
                break;

            case 'ArrowDown':
                upORdown = -1;
                carre.y = ySol - coteCarre;
                break;

            case 'Shift': // Activer shield
                shieldAble();
                break;

            case 'Control': // Désactiver shield + charger shield
                shieldDisable();
                break;
        }
    });
}

export function drawCarre() {
    ctx.fillStyle = carre.color;
    ctx.fillRect(carre.x, carre.y, coteCarre, coteCarre);
}

function shieldAble() {
    let shieldInterval;

    if (shieldLevel > 0 && carre.shield == 0) 
    {
        carre.color = "rgb(0, 255, 0)";
        carre.shield = 1;

        shieldInterval = setInterval(() => {
            
            shieldLevel --;
           
            if(shieldLevel <= 0 && carre.shield == 1) // Plus assez de shield
            {
                carre.color = "rgb(255, 255, 255)";
                carre.shield = 0;
                clearInterval(shieldInterval);
            }

            if(carre.shield == 0) // Shield désactivé
            {
                carre.color = "rgb(255, 255, 255)";
                carre.shield = 0;
                clearInterval(shieldInterval);
            }

        }, 50);
    }
}

function shieldDisable() {
    carre.color = "rgb(255, 255, 255)";
    carre.shield = 0;
    rechargeShield();
}

function rechargeShield() {
    if (carre.shield == 0) 
    {
        if (shieldLevel < maxShield) 
        {
            shieldLevel += 10/100;
        }
    }
}

export function drawShieldBar() {
    ctx.fillStyle = shieldBarBackgroundColor;
    ctx.fillRect(10, 10, shieldBarWidth, shieldBarHeight);

    // Calculer la largeur de remplissage en fonction du niveau du shield
    const fillWidth = (shieldLevel / 100) * shieldBarWidth;

    // Dessiner la barre de shield remplie
    ctx.fillStyle = shieldBarColor;
    ctx.fillRect(10, 10, fillWidth, shieldBarHeight);
}