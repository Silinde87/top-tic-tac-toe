"use strict";

let playerOne;
let playerTwo;
let currentPlayer;
let winner;

// -- DOM Elements --
let gameBoardElement = document.getElementById("gameboard");
let resetButton = document.getElementById("reset-btn");
let playerOneLabel = document.getElementById("player-one");
let playerTwoLabel = document.getElementById("player-two");

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
        //Row checks
        if (gameBoard[0] == gameBoard[1] && gameBoard[0] == gameBoard[2] && gameBoard[0] !== "") {
            winner = gameBoard[0];
            return true;
        }
        if (gameBoard[3] == gameBoard[4] && gameBoard[3] == gameBoard[5] && gameBoard[3] !== "") {
            winner = gameBoard[3];
            return true;
        }
        if (gameBoard[6] == gameBoard[7] && gameBoard[6] == gameBoard[8] && gameBoard[6] !== "") {
            winner = gameBoard[6];
            return true;
        }
        //Columns checks
        if (gameBoard[0] == gameBoard[3] && gameBoard[0] == gameBoard[6] && gameBoard[0] !== "") {
            winner = gameBoard[0];
            return true;
        }
        if (gameBoard[1] == gameBoard[4] && gameBoard[1] == gameBoard[7] && gameBoard[1] !== "") {
            winner = gameBoard[1];
            return true;
        }
        if (gameBoard[2] == gameBoard[5] && gameBoard[2] == gameBoard[8] && gameBoard[2] !== "") {
            winner = gameBoard[2];
            return true;
        }
        //Diagonals checks
        if (gameBoard[0] == gameBoard[4] && gameBoard[0] == gameBoard[8] && gameBoard[0] !== "") {
            winner = gameBoard[0];
            return true;
        }
        if (gameBoard[2] == gameBoard[4] && gameBoard[2] == gameBoard[6] && gameBoard[2] !== "") {
            winner = gameBoard[2];
            return true;
        }
        //Tie
        if (!gameBoard.includes("")) {
            winner = "tie";
            return true;
        }
        return false;
    };

    return { resetsGameBoard, addMarkToGameBoard, isGameOver };
})();

// -- GAME OBJECT (module) --
const Game = (function () {
    //Invoke reset gameBoard to start/restart game.
    const startGame = () => {
        Gameboard.resetsGameBoard();
        playerOne = Player("X", "human");
        playerTwo = Player("O", "AI");        
        currentPlayer = playerOne;
        playerOneLabel.classList.add("current-player");
        playerTwoLabel.classList.remove("current-player");
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
        //e.stopImmediatePropagation();        
        //Exit if user doesn't click slot
        if (e.target.id === "gameboard") return;
        //Exit if the user clicks on the AI's turn
        if (currentPlayer.getType() == "AI") return;

        //Adds the mark to the gameboard in selected slot.
        let index = e.target.dataset.id;
        Gameboard.addMarkToGameBoard(currentPlayer.getMark(), index);

        //AI's turn
        if (currentPlayer.getType() == "AI"){
            if (!Gameboard.isGameOver()) addRandomMark();
        }
        
        //Game is over exit.
        if (Gameboard.isGameOver()) {
            gameBoardElement.removeEventListener("click", addMark);
            console.log("winner: " + winner);
        }
    };

    //Selects a random empty slot and adds the mark to the gameboard with a 500ms delay
    const addRandomMark = () => {
        let indexRandom;
        do {
            indexRandom = Math.floor(Math.random() * 9);
        } while(gameBoardElement.children.item(indexRandom).innerText !== "");
        setTimeout(Gameboard.addMarkToGameBoard, 500, currentPlayer.getMark(), indexRandom);            
    }
    return { addMark, getMark, getType };
};

//Temporary Initialization
Game.startGame();

//Events
resetButton.addEventListener("click", Game.startGame);
