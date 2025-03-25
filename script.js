const marcilio = document.getElementById("marcilio");
const gameArea = document.getElementById("gameArea");
const scoreDisplay = document.getElementById("score");
const levelDisplay = document.getElementById("level");
const livesDisplay = document.getElementById("lives");

const soundLoseLife = new Audio("ui.ogg");
const soundGainPoint = new Audio("eca.ogg");

let score = 0;
let lives = 3;
let level = 1;
let fallSpeed = 5; // Velocidade inicial das peças caindo
let marcilioPosition = gameArea.clientWidth / 2 - 50;
const moveAmount = 15;
const fallingObjects = ["xavasca.png", "cool.png"];
let gameStarted = false;
let fallingIntervals = [];

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" && marcilioPosition > 0) {
        marcilioPosition -= moveAmount;
    } else if (event.key === "ArrowRight" && marcilioPosition < gameArea.clientWidth - marcilio.clientWidth) {
        marcilioPosition += moveAmount;
    } else if (event.key === "Enter" && !gameStarted) {
        startGame();
    }
    marcilio.style.left = marcilioPosition + "px";
});

// Toque no "marcilio" para iniciar o jogo
marcilio.addEventListener("touchstart", () => {
    if (!gameStarted) {
        startGame();
    }
});

// Movimentação com arrastar
let isDragging = false;

marcilio.addEventListener("touchstart", () => {
    isDragging = true;
});

document.addEventListener("touchmove", (event) => {
    if (isDragging) {
        const touch = event.touches[0];
        const touchX = touch.clientX - gameArea.offsetLeft;
        if (touchX >= 0 && touchX <= gameArea.clientWidth - marcilio.clientWidth) {
            marcilioPosition = touchX;
            marcilio.style.left = marcilioPosition + "px";
        }
    }
});

document.addEventListener("touchend", () => {
    isDragging = false;
});

function startGame() {
    gameStarted = true;
    score = 0;
    lives = 3;
    level = 1;
    fallSpeed = 5;
    updateDisplay();
    setInterval(spawnFallingObject, 1000);
}

function updateDisplay() {
    scoreDisplay.innerText = `Score: ${score}`;
    levelDisplay.innerText = `Level: ${level}`;
    livesDisplay.innerText = `Lives: ${lives}`;
}

function spawnFallingObject() {
    const object = document.createElement("img");
    const randomIndex = Math.floor(Math.random() * fallingObjects.length);
    object.src = fallingObjects[randomIndex];
    object.classList.add("falling");
    object.style.left = Math.random() * (gameArea.clientWidth - 50) + "px";
    object.style.top = "0px";
    gameArea.appendChild(object);

    let fallInterval = setInterval(() => {
        let objectPosition = parseFloat(object.style.top) || 0;
        objectPosition += fallSpeed;

        object.style.top = objectPosition + "px";

        if (checkCollision(object, marcilio)) {
            if (object.src.includes("xavasca.png")) {
                lives--;
                soundLoseLife.play();
            } else if (object.src.includes("cool.png")) {
                score += 100;
                soundGainPoint.play();
                checkLevelUp();
            }
            updateDisplay();
            clearInterval(fallInterval);
            object.remove();
            if (lives <= 0) endGame();
        } else if (objectPosition > gameArea.clientHeight) {
            clearInterval(fallInterval);
            object.remove();
        }
    }, 50);

    fallingIntervals.push(fallInterval);
}

function checkCollision(object, marcilio) {
    const objectRect = object.getBoundingClientRect();
    const marcilioRect = marcilio.getBoundingClientRect();
    return !(
        objectRect.top > marcilioRect.bottom ||
        objectRect.bottom < marcilioRect.top ||
        objectRect.right < marcilioRect.left ||
        objectRect.left > marcilioRect.right
    );
}

function checkLevelUp() {
    if (score >= level * 300) {
        level++;
        fallSpeed += 2;
        levelDisplay.innerText = `Level: ${level}`;
    }
}

function endGame() {
    window.alert(`Você perdeu! Sua pontuação foi: ${score}, no nível: ${level}`);
    resetGame();
}

function resetGame() {
    gameStarted = false;
    score = 0;
    lives = 3;
    level = 1;
    fallSpeed = 5;
    updateDisplay();
    const fallingObjects = document.querySelectorAll(".falling");
    fallingObjects.forEach((object) => object.remove());
    fallingIntervals.forEach(interval => clearInterval(interval));
    fallingIntervals = [];
}


function checkLevelUp() {
    if (score >= level * 500) {
        level++;
        if (level === 6) {
            endWinningGame(); // Chama a função de fim de jogo para nível 6
        } else {
            fallSpeed += 2; // Aumenta a velocidade das peças caindo
            levelDisplay.innerText = `Level: ${level}`; // Atualiza o nível na tela
        }
    }
}

// Função para encerrar o jogo no nível 6
function endWinningGame() {
    gameStarted = false; // Para o jogo
    window.alert("Parabéns, você é um papa rosquinha!"); // Mensagem final
    resetGame(); // Reinicia o jogo para o estado inicial
}
