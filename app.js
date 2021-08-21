// Canvas
const out = document.querySelector('#out');
const canvas = document.createElement('canvas');
canvas.style.cursor = 'none';
canvas.width = 800;
canvas.height = 800;
out.appendChild(canvas);
const ctx = canvas.getContext('2d');

// Images
let earthImg = new Image();
earthImg.src = 'img/earth.jpg';
let asterImg = new Image();
asterImg.src = 'img/aster.png';
let fireImg = new Image();
fireImg.src = 'img/fire.png';
let shipImg = new Image();
shipImg.src = 'img/ship.png';
let heartImg = new Image();
heartImg.src = 'img/heart.png';
let auraImg = new Image();
auraImg.src = 'img/aura.png';
let auraImg2 = new Image();
auraImg2.src = 'img/aura2.png';
let explImg = new Image();
explImg.src = 'img/explosions.png';

let shieldRed = new Image();
shieldRed.src = 'img/shield-red.png';
let shieldYellow = new Image();
shieldYellow.src = 'img/shield-yellow.png';
let shieldGreen = new Image();
shieldGreen.src = 'img/shield-green.png';

function reset() {
    isPlayng = true;
    score = 0;
    aster = [];
    expl = [];
    fire = [];
    ship = {
        x: 350,
        y: 600
    };
    aura = {
        x: ship.x,
        y: ship.y,
        animX: 0,
        animY: 0
    };
    aura2 = {
        x: ship.x,
        y: ship.y,
        animX: 0,
        animY: 0
    };
    hearts = [40, 80, 120, 160];
    timer = 0;
    collisionCount = 0;
}

// Global vars
const startButton = document.querySelector('.btn--start');

let statusElement = document.querySelector('#status');
let isPlayng = true;
let score = 0;
let aster = [];
let expl = [];
let fire = [];
let ship = {
    x: 350,
    y: 600
};
let aura = {
    x: ship.x,
    y: ship.y,
    animX: 0,
    animY: 0
};
let aura2 = {
    x: ship.x,
    y: ship.y,
    animX: 0,
    animY: 0
};
let hearts = [40, 80, 120, 160];
let timer = 0;
let collisionCount = 0;

let record = window.localStorage.getItem('record') ? window.localStorage.getItem('record') : 0;

document.querySelector('#record').textContent = record;

// Events
canvas.addEventListener('mousemove', event => {
    event.preventDefault();
    ship.x = event.offsetX - 50;
    ship.y = event.offsetY - 50;
});

canvas.addEventListener('click', event => {
    fire.push({
        x: ship.x + 34,
        y: ship.y,
        velocity: 5
    });
});

canvas.addEventListener('contextmenu', event => {
    event.preventDefault();
});

document.addEventListener('keydown', event => {
    if(event.keyCode === 13) {
        reset();
        startGame();
    }
});

startButton.onclick = startGame;

function startGame() {
    document.querySelector('canvas').style.width = '800px';
    document.querySelector('.right_side').style.display = 'block';
    document.querySelector('.start_control').style.display = 'none';
    game();
}

// Main Pattern
function game() {
    update();
    render();

    if(!isPlayng) {
        cancelAnimationFrame(game);
        gameOverScreen();
        return;
    }

    requestAnimationFrame(game);
}

function update() {
    timer++;

    // Aura
    aura.x = ship.x;
    aura.y = ship.y;
    aura.animX += 0.8;
    if(aura.animX >= 8) {
        aura.animY += 1;
        aura.animX = 0;
        if(aura.animY >= 4) {
            aura.animX = 0;
            aura.animY = 0;
        } 
    }

    // Aura 2
    aura2.x = ship.x;
    aura2.y = ship.y;
    aura2.animX += 0.4;
    if(aura2.animX >= 5) {
        aura2.animY += 1;
        aura2.animX = 0;
        if(aura2.animY >= 3) {
            aura2.animX = 0;
            aura2.animY = 0;
        } 
    } 

    // Aster Create
    if (timer % 40 == 0) {
        aster.push({
            x: Math.floor(Math.random() * (canvas.width - 50)),
            y: -50,
            vectorX: (Math.random() * 4) - 2,
            velocity: getRandomIntInclusive(1, 5),
            rotate: 0,
            rotationSpeed: (Math.random() * 0.2) - 0.1
        });
    }

    // Fire
    fire.forEach((item, index) => {
        item.y -= item.velocity;

        if (item.y <= -32) {
            fire.splice(index, 1);
        }
    });

    //expl
    for (let i = 0; i < expl.length; i++) {
        expl[i].animX += 0.4;
        if(expl[i].animX >= 8) {
            expl[i].animY += 1;
            expl[i].animX = 0;
        }
        if(expl[i].animY >= 6) {
            expl.splice(i, 1);
        }
    }

    // Aster
    for (let i = 0; i < aster.length; i++) {
        aster[i].y += aster[i].velocity;
        aster[i].x += aster[i].vectorX;
        aster[i].rotate += aster[i].rotationSpeed;

        if (aster[i].y >= 850) {
            aster.splice(i, 1);
            hearts.pop();
            if (hearts.length === 0) {
                isPlayng = false;
            }
        }
        if (aster[i].x >= (canvas.width) - 50 || aster[i].x <= 0) {
            aster[i].vectorX = -aster[i].vectorX;
        }

        for (let s = 0; s < fire.length; s++) {
            if (
                ((fire[s].x + 32 > aster[i].x && fire[s].x < aster[i].x + 50) ||
                (fire[s].x < aster[i].x + 50 && fire[s].x + 32 > aster[i].x)) &&
                ((fire[s].y < aster[i].y+50 && fire[s].y+32 > aster[i].y) || (fire[s].y+32 > aster[i].y && fire[s].y < aster[i].y+50))
            ) {
                score++;
                if(record < score) {
                    window.localStorage.setItem('record', score);
                    document.querySelector('#record').textContent = score;
                }
                if(score%100 == 0) {
                    if(hearts.length < 12) {
                        hearts.push(hearts[hearts.length-1]+40);
                    }
                }
                expl.push({
                    x: aster[i].x+25,
                    y: aster[i].y+25,
                    animX: 0,
                    animY: 0
                });
                fire.splice(s, 1);
                aster.splice(i, 1);
                break;
            }
        }
    }

    for (let i = 0; i < aster.length; i++) {
        if (
            ((ship.x + 50 > aster[i].x && ship.x < aster[i].x + 50) ||
            (ship.x < aster[i].x + 50 && ship + 50 > aster[i].x)) &&
            ((ship.y < aster[i].y+50 && ship.x+50 > aster[i].y) || (ship.y+50 > aster[i].y && ship.y < aster[i].y+50))
        ) {
            collisionCount++;
            if(collisionCount == 3) {
                isPlayng = false;
                return;
            }
    
            expl.push({
                x: aster[i].x+25,
                y: aster[i].y+25,
                animX: 0,
                animY: 0
            });
    
            aster.splice(i, 1);
            break;
        }
    }
}

 // Render
function render() {
    ctx.clearRect(0,0,canvas.width, canvas.height);
    ctx.drawImage(earthImg, 0, 0, 800, 800);
    ctx.drawImage(shipImg, ship.x, ship.y, 100, 100);

    for (let i = 0; i < aster.length; i++) {
        ctx.save();

        ctx.translate(aster[i].x + 25, aster[i].y + 25);
        ctx.rotate(aster[i].rotate);
        ctx.drawImage(asterImg, -25, -25, 50, 50);

        ctx.restore();
    }

    for (let i = 0; i < fire.length; i++) {
        ctx.drawImage(fireImg, fire[i].x, fire[i].y, 32, 32);
    }

    for (let i = 0; i < expl.length; i++) {
        ctx.drawImage(explImg, 256*Math.floor(expl[i].animX), 256* expl[i].animY, 256, 256, expl[i].x-50, expl[i].y-50, 100, 100);
    }

    ctx.textAlign = 'start';
    ctx.fillStyle = 'white';
    ctx.textBaseline = 'top';
    ctx.font = '14px "Press Start 2P"';
    ctx.fillText(`Score: ${score}`, 10, 10);

    // Draw Hearts
    for (let i = 0; i < hearts.length; i++) {
        ctx.drawImage(heartImg, hearts[i], canvas.height - 40);
    }

    if (hearts.length == 12) {
        ctx.fillStyle = 'red';
        ctx.fillText('max', hearts[hearts.length-1] + 40, canvas.height - 40);
    }
    
    // draw side-bar info
    switch(collisionCount) {
        case 0:
            ctx.drawImage(auraImg, 128 * Math.floor(aura.animX), 128 * aura.animY, 128, 128, aura.x-105, aura.y-150, 300, 300);
            ctx.drawImage(shieldGreen, canvas.width - 70, canvas.height - 70, 50, 58);
            statusElement.textContent = 'Щит активен';
            statusElement.style.color = 'green';
            break;
        case 1:
            ctx.drawImage(shieldYellow, canvas.width - 70, canvas.height - 70, 50, 58);
            statusElement.textContent = 'Генератор щита повреждён!';
            statusElement.style.color = 'yellow';
            break;
        case 2:
            ctx.drawImage(auraImg2, 256 * Math.floor(aura2.animX), 256 * aura2.animY, 256, 256, ship.x, ship.y, 100, 100);
            ctx.drawImage(shieldRed, canvas.width - 70, canvas.height - 70, 50, 58);
            statusElement.innerHTML = 'Критические повреждения<br><br>Капитан ранен!';
            statusElement.style.color = 'red';
            break;
    }
}

// Screens
function gameOverScreen() {
    ctx.fillStyle = 'rgba(0,0,0,0.75)';
    ctx.fillRect(0,0,canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '18px "Press Start 2P"';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Game Over', canvas.width/2, canvas.height/2-36);
    ctx.fillText(`Score: ${score}`, canvas.width/2, canvas.height/2);
    ctx.fillText('Press ENTER to Restart', canvas.width/2, canvas.height/2+36);

    if(collisionCount === 3) {
        statusElement.innerHTML = 'Корабль разрушен';
    } else {
        statusElement.innerHTML = 'Миссия провалена';
        statusElement.style.color = 'red';
    }
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
}