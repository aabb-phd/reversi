let newGameButton = document.getElementById("new-game");
let skipTurnButton = document.getElementById("skip-turn");
let prevTurnButton = document.getElementById("prev-turn");
let vsAiLabel = document.getElementById("vsai-label");
let vsPlayerLabel = document.getElementById("vsplayer-label");
vsAiLabel.classList.add("underlined");


//доска
chessTable.onclick = function(e) {
	if (gameOver) return;
	let x, y;
	if (e.pageX != undefined && e.pageY != undefined) {
		x = e.pageX;
		y = e.pageY;
	}
	else {
		x = e.clientX + document.body.scrollLeft +
		document.documentElement.scrollLeft;
		y = e.clientY + document.body.scrollTop +
		document.documentElement.scrollTop;
	}
	x -= chessTable.offsetLeft;
	y -= chessTable.offsetTop;

	x = Math.floor(x/50) + 1;
	y = Math.floor(y/50) + 1;

	if (!A[y][x]) {
		checkTurn(x, y);
		checkScores();
		if (gameOver) checkWinner();
		whosTurn();
	}		
}

//новая игра
newGameButton.onclick = function() {
	gameVsAi = document.getElementById("vsai").checked;
	if (gameVsAi) {
		vsAiLabel.classList.add("underlined");
		vsPlayerLabel.classList.remove("underlined");
	}
	else {
		vsAiLabel.classList.remove("underlined");
		vsPlayerLabel.classList.add("underlined");
	}
	startNewGame();
}

//передать ход
skipTurnButton.onclick = function() {
	if (gameOver || !buttonsEnabled) return;
	if (gameVsAi) {
		buttonsEnabled = false;
		turnSkipped = true;
		let playersColor = document.getElementsByClassName("current-player-color")[0];
		playersColor.style.backgroundColor = "#7376dc";
		setTimeout(checkAiTurn, 500);
		return;
	}
	else if (playersTurn === 1) playersTurn = 2;
	else playersTurn = 1;
	sequenceOfMoves[turn] = playersTurn;
	whosTurn();
}

//пред. ход
prevTurnButton.onclick = function() {
	if (!buttonsEnabled) return;
	if (gameOver) {
		gameOver = false;
		let winner = document.getElementById("winner");
		let circle = winner.getElementsByTagName("div")[0];
		winner.style.visibility = "hidden";
		circle.style.backgroundColor = "#fff";
		skipTurnButton.classList.remove('disabled');
	}
	if (turn) {
		prevTurnsArr.pop();
		turn--;
		if (!gameVsAi) playersTurn = sequenceOfMoves[turn];
		else playersTurn = 1;
		for (let i = 0; i < A.length; i++) A[i] = prevTurnsArr[turn][i].slice(0);
		drawTable();
		checkScores();
		whosTurn();
	}
}
