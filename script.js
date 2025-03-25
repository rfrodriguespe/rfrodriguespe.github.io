const startButton = document.getElementById("startButton");
const playerNameInput = document.getElementById("playerName");
let playerName = "";

const marcilio = document.getElementById("marcilio");
const gameArea = document.getElementById("gameArea");
const scoreDisplay = document.getElementById("score");
const livesDisplay = document.getElementById("lives");

// Adiciona os arquivos de som
const soundLoseLife = new Audio("ui.ogg"); // Som ao perder vida
const soundGainPoint = new Audio("eca.ogg"); // Som ao ganhar ponto

let score = 0;
let lives = 3;
let marcilioPosition = 175; // Posição inicial do Marcilio
const moveAmount = 15; // Quantidade que Marcilio se move
const fallingObjects = ["xavasca.png", "cool.png"]; // Imagens que vão cair
let gameStarted = false; // Controle de estado do jogo

startButton.addEventListener("click", () => {
    playerName = playerNameInput.value.trim();
    if (playerName === "") {
        alert("Por favor, insira seu nome antes de começar!");
        return;
    }
    document.getElementById("startScreen").style.display = "none";
    document.getElementById("gameArea").style.display = "block";
    startGame();
});

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" && marcilioPosition > 0) {
        marcilioPosition -= moveAmount;
    } else if (event.key === "ArrowRight" && marcilioPosition < gameArea.clientWidth - marcilio.clientWidth) {
        marcilioPosition += moveAmount;
    }
    marcilio.style.left = marcilioPosition + "px";
});

function startGame() {
    gameStarted = true;
    setInterval(spawnFallingObject, 1000); // Gera um novo objeto a cada segundo
}

// Ajuste na lógica de colisão
let fallingIntervals = []; // Array para armazenar os intervalos dos objetos em queda

function spawnFallingObject() {
    const object = document.createElement("img");
    const randomIndex = Math.floor(Math.random() * fallingObjects.length);
    object.src = fallingObjects[randomIndex];
    object.classList.add("falling");
    object.style.left = Math.random() * (gameArea.clientWidth - 50) + "px"; // Posição aleatória
    object.style.top = "0px"; // Inicia no topo
    gameArea.appendChild(object);

    let fallInterval = setInterval(() => {
        let objectPosition = parseInt(object.style.top) || 0;
        objectPosition += 5; // Velocidade de queda

        if (checkCollision(object, marcilio)) {
            if (object.src.includes("xavasca.png")) {
                lives--; // Diminui a vida
                soundLoseLife.play(); // Toca som de perda de vida
                livesDisplay.innerText = "Lives: " + lives;
                shakeMarcilio(); // Pausa queda e executa tremor
                if (lives <= 0) endGame(); // Finaliza o jogo se as vidas chegarem a zero
            } else if (object.src.includes("cool.png")) {
                score += 100; // Adiciona pontos
                soundGainPoint.play(); // Toca som ao ganhar pontos
                scoreDisplay.innerText = "Score: " + score;
                shakeMarcilio(); // Pausa queda e executa tremor
            }
            clearInterval(fallInterval);
            object.remove();
        }

        if (objectPosition > gameArea.clientHeight) {
            clearInterval(fallInterval);
            object.remove();
        }

        object.style.top = objectPosition + "px";
    }, 50); // Atualiza a posição a cada 50ms

    fallingIntervals.push(fallInterval); // Armazena o identificador do intervalo
}

// Função para pausar todos os intervalos
function pauseFallingObjects() {
    fallingIntervals.forEach(interval => clearInterval(interval)); // Pausa todos os intervalos
}

// Função para retomar todos os intervalos
function resumeFallingObjects() {
    fallingIntervals.forEach((_, index) => {
        fallingIntervals[index] = setInterval(() => {
            const objects = document.querySelectorAll(".falling");
            objects.forEach(object => {
                let objectPosition = parseInt(object.style.top) || 0;
                objectPosition += 5;

                object.style.top = objectPosition + "px";

                if (objectPosition > gameArea.clientHeight) {
                    object.remove();
                    clearInterval(fallingIntervals[index]);
                }
            });
        }, 50);
    });
}

// Função para verificar colisões
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

function shakeMarcilio() {
    // Cria o elemento de áudio
    const audio = new Audio("ui.mp3");
    audio.play(); // Toca o som

    // Aplica o efeito de tremor
    marcilio.classList.add("shake");
    setTimeout(() => {
        marcilio.classList.remove("shake");
    }, 500); // Dura 500ms
}

function saveScore() {
    const data = { name: playerName, score: score };
    fetch("saveScore.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    })
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.error("Erro ao salvar pontuação:", error));
}

function endGame() {
    saveScore();
    document.getElementById("finalScore").innerText = score;
    document.getElementById("endGamePopup").style.display = "flex";

    document.getElementById("yesButton").onclick = () => document.location.reload();
    document.getElementById("noButton").onclick = () => window.close();
}
