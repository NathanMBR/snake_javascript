'use strict';

// Criando as bases
const body = document.getElementById("body");
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
const startButton = document.createElement("button");

// Configurações do Canvas
const tilesSize = 20;
const proportion = 10;
const canvasSize = tilesSize * proportion;
canvas.width = canvasSize;
canvas.height = canvasSize;

// Código do Jogo
const game = {
    player: {
        position: [[parseInt(tilesSize / 2, 10), parseInt(tilesSize / 2, 10)], [parseInt(tilesSize / 2, 10) - 1, parseInt(tilesSize / 2, 10)], [parseInt(tilesSize / 2, 10) - 2, parseInt(tilesSize / 2, 10)]],
        currentDirection: "ArrowRight",
        nextDirection: null,
        tilesPerSecond: 4,
        scoreValue: 0,
        acceptedMoves: {
            ArrowUp: (chooser) => {
                if (game.player.currentDirection !== "ArrowDown") { 
                    if (chooser === "setDirection") {
                        game.player.nextDirection = "ArrowUp";
                    }
                    if (chooser === "move") {
                        game.player.currentDirection = "ArrowUp";
                        if (game.player.position[0][1] > 0) {
                            game.player.position[0][1]--;
                        } else {
                            game.events.gameOver();
                        }
                    }
                }
            },
            ArrowDown: (chooser) => {
                if (game.player.currentDirection !== "ArrowUp") {
                    if (chooser === "setDirection") {
                        game.player.nextDirection = "ArrowDown";
                    }
                    if (chooser === "move") {
                        game.player.currentDirection = "ArrowDown";
                        if (game.player.position[0][1] < tilesSize - 1) {
                            game.player.position[0][1]++;
                        } else {
                            game.events.gameOver();
                        }
                    }
                }
            },
            ArrowLeft: (chooser) => {
                if (game.player.currentDirection !== "ArrowRight") {
                    if (chooser === "setDirection") {
                        game.player.nextDirection = "ArrowLeft";
                    }
                    if (chooser === "move") {
                        game.player.currentDirection = "ArrowLeft"
                        if (game.player.position[0][0] > 0) {
                            game.player.position[0][0]--;
                        } else {
                            game.events.gameOver();
                        }
                    }
                }
            },
            ArrowRight: (chooser) => {
                if (game.player.currentDirection !== "ArrowLeft") {
                    if (chooser === "setDirection") {
                        game.player.nextDirection = "ArrowRight";
                    }
                    if (chooser === "move") {
                        game.player.currentDirection = "ArrowRight"
                        if (game.player.position[0][0] < tilesSize - 1) {
                            game.player.position[0][0]++;
                        } else {
                            game.events.gameOver();
                        }
                    }
                }
            }
        },
        moveTail: () => {
            if (game.player.nextDirection !== null) {
                for (let snakeTile = game.player.position.length - 1; snakeTile > 0; snakeTile--) {
                    game.player.position[snakeTile][0] = game.player.position[snakeTile - 1][0];
                    game.player.position[snakeTile][1] = game.player.position[snakeTile - 1][1];
                }
            }
        },
        growTail: () => {
            let snakeTile = game.player.position;
            let snakeLength = snakeTile.length - 1;
            // Os lets são apenas para deixar mais legível
            snakeTile.push([2 * snakeTile[snakeLength][0] - snakeTile[snakeLength - 1][0], 2 * snakeTile[snakeLength][1] - snakeTile[snakeLength - 1][1]]);
        }
    },
    fruits: {
        position: [null, null],
        getNewFruit: () => {
            let fruitX = Math.floor(Math.random() * tilesSize);
            let fruitY = Math.floor(Math.random() * tilesSize);
            let getFruitAgain = false;
            for (let snakeTile of game.player.position) {
                if (snakeTile[0] === fruitX && snakeTile[1] === fruitY) {
                    getFruitAgain = true;
                }
            }
            if (getFruitAgain) {
                game.fruits.getNewFruit();
            } else {
                game.fruits.position[0] = fruitX;
                game.fruits.position[1] = fruitY;
            }
        }
    },
    events: {
        testCollision: () => {
            for (let snakeTile = 4; snakeTile < game.player.position.length; snakeTile++) {
                if (game.player.position[0][0] === game.player.position[snakeTile][0] && game.player.position[0][1] === game.player.position[snakeTile][1]) {
                    game.events.gameOver();
                }
            }
        },
        fruitEaten: () => {
            if (game.player.position[0][0] === game.fruits.position[0] && game.player.position[0][1] === game.fruits.position[1]) {
                game.player.scoreValue++;
                score.innerHTML = `Fruits Eaten: ${game.player.scoreValue}`;
                game.player.growTail();
                game.fruits.getNewFruit();
            }
        },
        gameOver: () => {
            game.configs.isGameStarted = false;
            let gameOver = document.createElement("h2");
            gameOver.innerHTML = "Game Over";
            gameOver.setAttribute("id", "gameOver");
            let restartButton = document.createElement("button");
            restartButton.innerHTML = "Restart";
            restartButton.setAttribute("id", "restartButton");
            restartButton.onclick = () => {
                game.player.position = [];
                game.player.currentDirection = "ArrowRight";
                game.player.nextDirection = "ArrowRight";
                game.player.position = [[initialPosition[0][0], initialPosition[0][1]], [initialPosition[1][0], initialPosition[1][1]], [initialPosition[2][0], initialPosition[2][1]]];
                body.removeChild(document.getElementById("gameOver"));
                game.player.scoreValue = 0;
                score.innerHTML = `Fruits Eaten: ${game.player.scoreValue}`;
                game.fruits.getNewFruit();
                game.configs.isGameStarted = true;
                game.renders.loop();
                body.removeChild(document.getElementById("restartButton"));
            }
            body.removeChild(score);
            body.appendChild(gameOver);
            body.appendChild(score);
            body.appendChild(restartButton);
        },
        doMove: () => {
            if (game.configs.timer + game.configs.timerFrequency <= new Date().getTime()) {
                game.configs.timer = new Date().getTime();
                game.player.moveTail();
                if (game.player.acceptedMoves[game.player.nextDirection]) {
                    game.player.acceptedMoves[game.player.nextDirection]("move");
                }
            }
        }
    },
    renders: {
        clear: () => {
            ctx.clearRect(0, 0, canvasSize, canvasSize);
        },
        background: () => {
            for (let i = 0; i < tilesSize; i++) {
                for (let j = 0; j < tilesSize; j++) {
                    if ((i + j) % 2 === 0) {
                        ctx.fillStyle = "#9DBCD4";
                        ctx.fillRect(i * proportion, j * proportion, proportion, proportion);
                    } else {
                        ctx.fillStyle = "#6D5ACF";
                        ctx.fillRect(i * proportion, j * proportion, proportion, proportion);
                    }
                }
            }
        },
        snake: () => {
            ctx.fillStyle = "rgb(0, 255, 0)";
            for (let snakeTile of game.player.position) {
                ctx.fillRect(snakeTile[0] * proportion, snakeTile[1] * proportion, proportion, proportion);
            }
            ctx.fillStyle = "rgb(0, 200, 0)";
            ctx.fillRect(game.player.position[0][0] * proportion, game.player.position[0][1] * proportion, proportion, proportion);
            ctx.fillRect(game.player.position[game.player.position.length - 1][0] * proportion, game.player.position[game.player.position.length - 1][1] * proportion, proportion, proportion);
        },
        fruit: () => {
            ctx.fillStyle = "rgb(255, 0, 0)";
            ctx.fillRect(game.fruits.position[0] * proportion, game.fruits.position[1] * proportion, proportion, proportion);
        },
        loop: () => {
            if (game.configs.isGameStarted) {
                game.events.doMove();
                game.events.testCollision();
                game.events.fruitEaten();
                game.renders.clear();
                game.renders.background();
                game.renders.fruit();
                game.renders.snake();
                requestAnimationFrame(game.renders.loop); 
            }
        }
    },
    configs: {
        isGameStarted: false,
        timer: new Date().getTime(),
        timerFrequency: null, // É necessário inserir o valor após a inicialização de "game". (Ver abaixo)
        initialPosition: null
    },
    start: () => {
        body.appendChild(canvas);
        body.appendChild(score);
        game.configs.isGameStarted = true;
        game.fruits.getNewFruit();
        game.renders.loop();
    }
};

// Configurações pós-inicialização do game
window.addEventListener("keydown", () => {
    if (game.player.acceptedMoves[event.key] && game.configs.isGameStarted) {
        game.player.acceptedMoves[event.key]("setDirection");
    }
});
startButton.innerHTML = "Start Game";
startButton.onclick = () => {
    body.removeChild(startButton);
    game.start();
};
body.onload = body.appendChild(startButton);
game.configs.timerFrequency = parseInt(1000 / game.player.tilesPerSecond, 10);
const score = document.createElement("p");
score.innerHTML = `Fruits Eaten: ${game.player.scoreValue}`;
const initialPosition = [[game.player.position[0][0], game.player.position[0][1]], [game.player.position[1][0], game.player.position[1][1]], [game.player.position[2][0], game.player.position[2][1]]];