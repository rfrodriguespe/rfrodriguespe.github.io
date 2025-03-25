const marcilio = document.getElementById("marcilio");
const gameArea = document.getElementById("gameArea");
const scoreDisplay = document.getElementById("score");
const livesDisplay = document.getElementById("lives");

const soundLoseLife = new Audio("ui.ogg"); // Som ao perder vida
const soundGainPoint = new Audio("eca.ogg"); // Som ao ganhar ponto

let score = 0;
let lives = 3;
let marcilioPosition = gameArea.clientWidth / 2 - 50; // Posição inicial
const moveAmount = 15; // Quantidade que Marcilio se move
const fallingObjects = ["xavasca.png", "cool.png"]; // Imagens que vão cair
let gameStarted = false;
let fallingIntervals = []; // Array para armazenar os intervalos dos objetos em queda

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

// Habilita toque no "marcilio" para iniciar o jogo
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
    gameStarted = true; // Atualiza o estado do jogo
    score = 0;
    lives = 3;
    updateDisplay(); // Reinicia os valores de pontuação e vida
    setInterval(spawnFallingObject, 1000); // Gera objetos caindo
}


function updateDisplay() {
    scoreDisplay.innerText = `Score: ${score}`;
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
        objectPosition += 5;

        object.style.top = objectPosition + "px";

        if (checkCollision(object, marcilio)) {
            if (object.src.includes("xavasca.png")) {
                lives--;
                soundLoseLife.play();
            } else if (object.src.includes("cool.png")) {
                score += 100;
                soundGainPoint.play();
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

function endGame() {
    window.alert("Você perdeu!");
    resetGame();
}

function resetGame() {
    gameStarted = false;
    score = 0;
    lives = 3;
    updateDisplay();
    const fallingObjects = document.querySelectorAll(".falling");
    fallingObjects.forEach((object) => object.remove());
    fallingIntervals.forEach(interval => clearInterval(interval));
    fallingIntervals = [];
}

// Adiciona toque no "marcilio" para iniciar o jogo em dispositivos móveis
marcilio.addEventListener("touchstart", () => {
    if (!gameStarted) {
        startGame(); // Inicia o jogo
    }
});

