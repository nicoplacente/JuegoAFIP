const canvas = document.getElementById('gameCanvas');
const startButton = document.getElementById('startButton');
const ctx = canvas.getContext('2d');
const backgroundMusic = document.getElementById('backgroundMusic');
const soundFail = new Audio();
soundFail.src = 'Roblox.mp3';
const modal = document.querySelector('.modal');
const nivelActual = document.querySelector('.nivelActual');
nivelActual.style.display = 'none';


const opciones = document.querySelectorAll('.opcion');

const buttons = document.querySelectorAll('.button');





let lastActiveButton = localStorage.getItem('activeButton');
if (lastActiveButton) {
    buttons.forEach(button => {
        if (button.textContent === lastActiveButton) {
            button.classList.add('activeSong');
            button.classList.remove('button');
        } else {
            button.classList.add('button');
            button.classList.remove('activeSong');
        }
    });
}

buttons.forEach(button => {
    button.addEventListener('click', () => {
        buttons.forEach(btn => {
            btn.classList.remove('activeSong');
            btn.classList.add('button');
        });

        button.classList.add('activeSong');
        button.classList.remove('button');


        localStorage.setItem('activeButton', button.textContent);
    });
});

opciones.forEach(e => {

    e.addEventListener('click', () => {
        const opcionSeleccionada = e.querySelector('option').value;
        
        let cancionSeleccionada = opcionSeleccionada;

        
        backgroundMusic.src = cancionSeleccionada;
        backgroundMusic.pause();

        localStorage.setItem('song' , cancionSeleccionada);
    });
});

if(localStorage.getItem('song')){
    backgroundMusic.src = localStorage.getItem('song');
    backgroundMusic.pause();
}

cancionSeleccionada = localStorage.getItem('song');
backgroundMusic.src = localStorage.getItem('song');
backgroundMusic.pause();

const player = {
    x: 50,
    y: canvas.height / 2,
    width: 20,
    height: 20,
    speedY: 0,
    gravity: 0.2,
    jumpPower: -5
};

const obstacles = [
    { x: 300, y: canvas.height - 20, width: 20, height: 20 },
    { x: 400, y: canvas.height - 50, width: 20, height: 20 },
    { x: 450, y: canvas.height - 10, width: 20, height: 20 },
    { x: 800, y: canvas.height - 20, width: 20, height: 20 },
    { x: 577, y: canvas.height - 100, width: 20, height: 20 },
    { x: 600, y: canvas.height - 10, width: 20, height: 20 },
    { x: 720, y: canvas.height - 20, width: 20, height: 20 },
    { x: 577, y: canvas.height - 9, width: 20, height: 20 },
    { x: 900, y: canvas.height - 20, width: 20, height: 20 },
    { x: 1200, y: canvas.height - 9, width: 20, height: 20 },
    { x: 1377, y: canvas.height - 25, width: 20, height: 20 },
    { x: 1533, y: canvas.height - 33, width: 20, height: 20 },
    { x: 1700, y: canvas.height - 100, width: 20, height: 20 },
    { x: 1700, y: canvas.height - 9, width: 20, height: 20 },
    { x: 1779, y: canvas.height - 12, width: 20, height: 20 },
    { x: 1950, y: canvas.height - 20, width: 20, height: 20 }
];

let isJumping = false;
let isGameOver = true;
let level = 1; 

let item = document.createElement('p');
item.innerHTML = `Nivel: ${level}`;
nivelActual.appendChild(item);

function drawPlayer() {
    const playerImg = new Image();
    playerImg.src = 'https://images.vexels.com/media/users/3/269679/isolated/preview/bf91b6dacf1cb44689c33bbf2b4e3743-dollar-bill-finances-icon.png';

        const imgElement = document.createElement('img');
        imgElement.src = playerImg.src;

        imgElement.classList.add('playerImg'); 

        ctx.drawImage(imgElement, player.x, player.y, player.width, player.height);
    };


    function drawObstacles() {
        obstacles.forEach(obstacle => {
            const obstacleImg = new Image();
            obstacleImg.src = 'data:image/png;base64,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';
    
            ctx.drawImage(obstacleImg, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        });
    }

function collisionDetection(player, obstacle) {
    return (
        player.x < obstacle.x + obstacle.width &&
        player.x + player.width > obstacle.x &&
        player.y < obstacle.y + obstacle.height &&
        player.y + player.height > obstacle.y
    );
}

const modalH4 = document.querySelector('.h4');

function checkCollisions() {

    for (let i = 0; i < obstacles.length; i++) {

        if (collisionDetection(player, obstacles[i])) {
            soundFail.play();
            backgroundMusic.pause();
            modalH4.innerHTML = `<b>Que lastima, te alcanzo el AFIP, quedaste pobre :v</b><br><br> <b>Has llegado hasta el nivel ${level} </b>`;
            modal.style.display = 'block';
            obstacles.length = 0;
            score = 0;
            isGameOver = true;
            startButton.style.display = 'block';
            setTimeout(() => {location.reload()} , 2000);
            imgElement.style.display = 'none';
        }
    }
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPlayer();
    drawObstacles();
    checkCollisions();

    player.speedY += player.gravity;
    player.y += player.speedY;

    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
        player.speedY = 0;
        isJumping = false;
    }

    player.x += 2;

    if (player.x >= canvas.width) {

        item.innerHTML = `Nivel: ${level + 1}`;

        level++;
        player.x = 50;
    }

    requestAnimationFrame(update);
}

canvas.addEventListener('click', () => {
    if (!isJumping && !isGameOver) {
        player.speedY = player.jumpPower;
        isJumping = true;
    }
});

startButton.addEventListener('click', () => {
    startButton.style.display = 'none';
    isGameOver = false;
    player.y = canvas.height / 2;
    score = 0;
    level = 1;
    update();
    backgroundMusic.play();
    modal.style.display = 'none';
    nivelActual.style.display = 'block';

});


    addEventListener('keydown' , e => {
        if(e.key === 'Enter'){
            startButton.style.display = 'none';
            isGameOver = false;
            player.y = canvas.height / 2;
            score = 0;
            level = 1; 
            update();
            backgroundMusic.play();
            modal.style.display = 'none';
            nivelActual.style.display = 'block';
        }
    })

document.addEventListener('keydown', (e) => {
    if (e.key === ' ' && !isJumping && !isGameOver) {
        player.speedY = player.jumpPower;
        isJumping = true;
    }
});
