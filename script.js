"use strict";

let playerOne;
let playerTwo;
let currentPlayer;
let winner;

// -- DOM Elements --
let gameBoardElement = document.getElementById("gameboard");
let newGameButton = [...document.getElementsByClassName("new-game-btn")];
let newRoundButton = [...document.getElementsByClassName("new-round-btn")];
let humanHumanButton = document.getElementById("human-human");
let humanAiButton = document.getElementById("human-ai");
let playerOneLabel = document.getElementById("player-one");
let playerTwoLabel = document.getElementById("player-two");
let frontContainer = document.getElementById("front-container");
let mainContainer = document.getElementById("main-container");

// -- GAMEBOARD OBJECT (module) --
const Gameboard = (function () {
    let gameBoard = ["", "", "", "", "", "", "", "", ""];

    //Renders the current gameBoard value to the DOM
    const renderGameBoard = () => {
        gameBoardElement.innerHTML = "";
        let index = 0;
        gameBoard.forEach((slotValue) => {
            let slotElement = document.createElement("div");
            slotElement.classList.add("game-slot");
            slotElement.dataset.id = index++;
            slotElement.innerText = slotValue;
            gameBoardElement.appendChild(slotElement);
        });
    };

    //Resets the gameBoard array to empty values, invokes render.
    const resetsGameBoard = () => {
        gameBoard = ["", "", "", "", "", "", "", "", ""];
        renderGameBoard();
    };

    //Check if slot is empty and assign the playerMark in the index
    //passed as parameter, invokes render.
    const addMarkToGameBoard = (playerMark, elemIndex) => {
        if (gameBoard[elemIndex] === "") {
            gameBoard[elemIndex] = playerMark;
            Game.swapCurrentPlayer();
            renderGameBoard();
        }
    };

    //Check if there are three-in-a-row or gameBoard is full.
    const isGameOver = () => {
        let slots = [
            //Rows
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            //columns
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            //Diagonals
            [0, 4, 8],
            [2, 4, 6],
        ];
        let isOver = false;
        //Checks for three equal symbols in every row, column and diagonal.
        //Return the winner.
        slots.forEach((row) => {
            if (
                gameBoard[row[0]] == gameBoard[row[1]] &&
                gameBoard[row[0]] == gameBoard[row[2]] &&
                gameBoard[row[0]] !== ""
            ) {
                winner = gameBoard[row[0]];
                isOver = true;
            }
        });
        //Tie check
        if (!gameBoard.includes("")) {
            winner = "tie";
            isOver = true;
        }
        //Result of the check
        if (isOver) return true;
        else return false;
    };

    return { resetsGameBoard, addMarkToGameBoard, isGameOver };
})();

// -- GAME OBJECT (module) --
const Game = (function () {
    //Invoke reset gameBoard to start/restart game.
    const startGame = () => {
        //Exit if no selected mode
        if (playerTwo == undefined) {
            document.getElementById("start-alert").style.opacity = "1";
            return;
        }
        Gameboard.resetsGameBoard();
        playerOne = Player("X", "human");
        currentPlayer = playerOne;
        frontContainer.classList.add("hidden");
        mainContainer.classList.remove("hidden");
        playerOneLabel.classList.add("current-player");
        playerTwoLabel.classList.remove("current-player");
        playerOneLabel.innerHTML = `<i class="far fa-user"></i>
            <div id="player-one-mark" class="player-mark"></div>`;
        document.getElementById("player-one-mark").innerText = playerOne.getMark();
        document.getElementById("player-two-mark").innerText = playerTwo.getMark();
        gameBoardElement.addEventListener("click", currentPlayer.addMark);
    };

    //Swap between players turn when invoked.
    const swapCurrentPlayer = () => {
        if (currentPlayer == playerOne) {
            currentPlayer = playerTwo;
            playerTwoLabel.classList.add("current-player");
            playerOneLabel.classList.remove("current-player");
        } else {
            currentPlayer = playerOne;
            playerOneLabel.classList.add("current-player");
            playerTwoLabel.classList.remove("current-player");
        }
    };

    return { startGame, swapCurrentPlayer };
})();

// -- PLAYER OBJECT (factory) --
const Player = (markPlayer, typePlayer) => {
    let mark = markPlayer;
    let type = typePlayer;

    //Getters
    const getMark = () => mark;
    const getType = () => type;

    //Invoke addMark function and passes the id of clicked elem
    //and playerMark as parameter.
    const addMark = (e) => {
        //Exit if user doesn't click slot
        if (e.target.id === "gameboard") return;
        //Exit if the user clicks on the AI's turn
        if (currentPlayer.getType() == "AI") return;

        //Adds the mark to the gameboard in selected slot.
        let index = e.target.dataset.id;
        Gameboard.addMarkToGameBoard(currentPlayer.getMark(), index);

        //AI's turn
        if (currentPlayer.getType() == "AI" && !Gameboard.isGameOver()) {
            addRandomMark();
        }

        //Game is over exit.
        if (Gameboard.isGameOver()) {
            gameBoardElement.removeEventListener("click", addMark);
            if (winner === "tie") {
                document.getElementById("text-result").innerText = "The result is:";
            } else {
                document.getElementById("text-result").innerText = "The winner is:";
            }
            document.getElementById("result").innerText = winner;
            $("#resultModal").modal("show");
        }
    };

    //Selects a random empty slot and adds the mark to the gameboard with a 500ms delay
    const addRandomMark = () => {
        let indexRandom;
        do {
            indexRandom = Math.floor(Math.random() * 9);
        } while (gameBoardElement.children.item(indexRandom).innerText !== "");
        Gameboard.addMarkToGameBoard(currentPlayer.getMark(), indexRandom);
    };
    return { addMark, getMark, getType };
};

//Events
newGameButton.forEach((btn) => {
    btn.addEventListener("click", () => {
        $("#resultModal").modal("hide");
        humanHumanButton.classList.remove("gametype-box-actived");
        humanAiButton.classList.remove("gametype-box-actived");
        frontContainer.classList.remove("hidden");
        mainContainer.classList.add("hidden");
        playerTwo = undefined;
    });
});
newRoundButton.forEach((btn) => {
    btn.addEventListener("click", () => {
        $("#resultModal").modal("hide");
        Game.startGame();
    });
});
humanHumanButton.addEventListener("click", () => {
    humanHumanButton.classList.add("gametype-box-actived");
    humanAiButton.classList.remove("gametype-box-actived");
    document.getElementById("start-alert").style.opacity = "0";
    playerTwoLabel.innerHTML = `<i class="far fa-user"></i>
        <div id="player-two-mark" class="player-mark"></div>`;
    playerTwo = Player("O", "human");
});
humanAiButton.addEventListener("click", () => {
    humanAiButton.classList.add("gametype-box-actived");
    humanHumanButton.classList.remove("gametype-box-actived");
    document.getElementById("start-alert").style.opacity = "0";
    playerTwoLabel.innerHTML = `<i class="fas fa-robot"></i>
        <div id="player-two-mark" class="player-mark"></div>`;
    playerTwo = Player("O", "AI");
});
