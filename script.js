// -- DOM Elements --
let gameBoardElement = document.getElementById("gameboard");
let resetButton = document.getElementById("reset-btn");

// -- Gameboard Object (module) --
const Gameboard = (function () {
    let gameBoard = ["X", "O", "X", "O", "X", "X", "X", "O", "O"];

    //Renders the current gameBoard value to the DOM
    const renderGameBoard = () => {
        gameBoardElement.innerHTML = "";
        let index = 0;
        gameBoard.forEach((slotValue) => {
            let slotElement = document.createElement("div");
            slotElement.setAttribute("id", "slot-" + index++);
            slotElement.classList.add("game-slot");
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
        }
        renderGameBoard();
    };

    return { resetsGameBoard, addMarkToGameBoard };
})();

/* -- Game Object (module) --
    todo:
    - Game is over?
    - display winner
    - select player */
const Game = (function () {
    //Invoke reset gameBoard to start/restart game.
    const startGame = () => {
        Gameboard.resetsGameBoard();
    };

    return { startGame };
})();

// -- Player Object (factory) --
const Player = (mark) => {
    let playerMark = mark;

    //Invoke addMark function and passes the id of clicked elem
    //and playerMark as parameter.
    const addMark = (e) => {
        let index = e.target.id.split("-")[1];
        Gameboard.addMarkToGameBoard(playerMark, index);
    };

    gameBoardElement.addEventListener("click", addMark);
};

//Events
resetButton.addEventListener("click", Game.startGame);

//Temporary Initialization
Gameboard.resetsGameBoard();
let playerOne = Player("X");
