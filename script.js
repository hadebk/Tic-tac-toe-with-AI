var origBoard;
const huPlayer = 'O';
const aiPlayer = 'X';
const winCombos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]

const cells = document.querySelectorAll('.cell');
startGame();

function startGame() {  // reset all cells, hide the box, remove listener 
    document.querySelector(".endgame").style.display = "none";
	origBoard = Array.from(Array(9).keys()); //array from 0-8 move on all cells in matrix
	for (var i = 0; i < cells.length; i++) { //remove all x and o from the shape
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color');
		cells[i].addEventListener('click', turnClick, false);
	}
}

function turnClick(square) { // add x/o to cell
	if (typeof origBoard[square.target.id] == 'number') {//after fill all cells the click will be char(x/o)not num
		turn(square.target.id, huPlayer)//use turn func to select human player not ai player
		if (!checkTie()) turn(bestSpot(), aiPlayer);
	}
}

function turn(squareId, player) { // select what will put in cells x/o
	origBoard[squareId] = player;
	document.getElementById(squareId).innerText = player;
	let gameWon = checkWin(origBoard, player)
	if (gameWon) gameOver(gameWon)
}

function checkWin(board, player) { // check the winner
	let plays = board.reduce((a, e, i) =>  /*to find every element that human plaer was played--reduce method will move over all cells(a:store the value from boardArray--e:the value of cell--i: index)*/
		(e === player) ? a.concat(i) : a, []);
	let gameWon = null;
	for (let [index, win] of winCombos.entries()) {//move on all cases that will reduce win
		if (win.every(elem => plays.indexOf(elem) > -1)) {/*to move on all of winCombo and compare with every element that human plaer was played*/
			gameWon = {index: index, player: player};
			break;
		}
	}
	return gameWon;
}

function gameOver(gameWon) { // where the game overchange the color of cells and finish the game
	for (let index of winCombos[gameWon.index]) {
		document.getElementById(index).style.backgroundColor =
			gameWon.player == huPlayer ? "blue" : "red";
	}
	for (var i = 0; i < cells.length; i++) {
		cells[i].removeEventListener('click', turnClick, false);
	}
	declareWinner(gameWon.player == huPlayer ? "You win!" : "Game Over!");
}

function declareWinner(who) { // show message
	document.querySelector(".endgame").style.display = "block";
	document.querySelector(".endgame .text").innerText = who;
}

function emptySquares() { //find all empty cells in matrix
	return origBoard.filter(s => typeof s == 'number');// filter all square have X/O
}

function bestSpot() { // select wherw aiplayer  will play
	return minimax(origBoard, aiPlayer).index;// find all empty square and just get best empty square to aiplayer play in it
}

function checkTie() { // check if the game is ended
	if (emptySquares().length == 0) {
		for (var i = 0; i < cells.length; i++) {
			cells[i].style.backgroundColor = "darkcyan";
			cells[i].removeEventListener('click', turnClick, false);
		}
		declareWinner("Tie Game!")
		return true;
	}
	return false;
}

function minimax(newBoard, player) {
	var availSpots = emptySquares();

	if (checkWin(newBoard, huPlayer)) {// check the status of game if it end or no 
		return {score: -10};//mean humanplayer lose
	} else if (checkWin(newBoard, aiPlayer)) {
		return {score: 10};//mean aiplayer win
	} else if (availSpots.length === 0) {
		return {score: 0};//mean tie game
	}
    
	var moves = [];
	for (var i = 0; i < availSpots.length; i++) {//move on all empty cells
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;// make ai play

		if (player == aiPlayer) {
			var result = minimax(newBoard, huPlayer);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, aiPlayer);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	var bestMove;
	if(player === aiPlayer) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}






