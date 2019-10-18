//инициализация начального поля
function initTable() {
	A = [
	[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
	[-1,  0,  0,  0,  0,  0,  0,  0,  0, -1],
	[-1,  0,  0,  0,  0,  0,  0,  0,  0, -1],
	[-1,  0,  0,  0,  0,  0,  0,  0,  0, -1],
	[-1,  0,  0,  0,  1,  2,  0,  0,  0, -1],
	[-1,  0,  0,  0,  2,  1,  0,  0,  0, -1],
	[-1,  0,  0,  0,  0,  0,  0,  0,  0, -1],
	[-1,  0,  0,  0,  0,  0,  0,  0,  0, -1],
	[-1,  0,  0,  0,  0,  0,  0,  0,  0, -1],
	[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
	]

	W = [
	[999, 999, 999, 999, 999, 999, 999, 999, 999, 999],
	[999, 100, -10,   7,   8,   8,   7, -10, 100, 999],
	[999, -10, -50,  -2,   0,   0,  -2, -50, -10, 999],
	[999,   7,  -2,   2,   2,   2,   2,  -2,   7, 999],
	[999,   8,   0,   2,  -1,  -1,   2,   0,   8, 999],
	[999,   8,   0,   2,  -1,  -1,   2,   0,   8, 999],
	[999,   7,  -2,   2,   2,   2,   2,  -2,   7, 999],
	[999, -10, -50,  -2,   0,   0,  -2, -50, -10, 999],
	[999, 100, -10,   7,   8,   8,   7, -10, 100, 999],
	[999, 999, 999, 999, 999, 999, 999, 999, 999, 999],
	]

	drawTable();
}

//начать новую игру
function startNewGame() {
	playersTurn = 1;
	switchturn = false;
	gameOver = false;
	count1 = 0;
	count2 = 0;

	let winner = document.getElementById("winner");
	let circle = winner.getElementsByTagName("div")[0];
	if (!gameOver) {
		winner.style.visibility = "hidden";
		circle.style.backgroundColor = "#fff";
		skipTurnButton.classList.remove('disabled');
	}

	initTable();
	checkScores();
	whosTurn();

	turn = 0;
	let prevTurn = [];
	for (let i = 0; i < A.length; i++) prevTurn[i] = A[i].slice(0);
	prevTurnsArr = [];
	prevTurnsArr.push(prevTurn);
	sequenceOfMoves = [];
	sequenceOfMoves[turn] = 1;
}

//расчитываем очки и выводим на экран
function checkScores() {
	count1 = 0;
	count2 = 0;
	for (let i = 1; i <= 8; i++) {
		for (let j = 1; j <= 8; j++) {
			if (A[i][j] === 1) count1++;
			else if (A[i][j] === 2) count2++;
			else continue;
		}
	}
	if (!count1 || !count2 || count1 + count2 === 64) gameOver = true;
	let player1Scores = document.getElementById("count1");
	let player2Scores = document.getElementById("count2");
	player1Scores.innerHTML = count1;
	player2Scores.innerHTML = count2;
}

//показываем, чей сейчас ход
function whosTurn() {
	let playersColor = document.getElementsByClassName("current-player-color")[0];
	if (gameOver) playersColor.style.backgroundColor = "#fff";
	else if (playersTurn === 1) playersColor.style.backgroundColor = "#2ba24a";
	else playersColor.style.backgroundColor = "#7376dc";
}

//проверям, есть ли уже победитель
function checkWinner() {
	let winner = document.getElementById("winner");
	let span = winner.getElementsByTagName("span")[0];
	let circle = winner.getElementsByTagName("div")[0];
	winner.style.visibility = "visible";
	if (count1 > count2) {
		span.textContent = "Выиграл:";
		circle.style.backgroundColor = "#2ba24a";
	}
	else if (count2 > count1) {
		span.textContent = "Выиграл:";
		circle.style.backgroundColor = "#7376dc";
	}
	else if (count1 === count2) {
		span.textContent = "Ничья";
		circle.style.backgroundColor = "#fff";
	}
	skipTurnButton.classList.add('disabled');
}

//запоминаем текущий ход
function saveTurn() {
	sequenceOfMoves[turn] = playersTurn;
	turn++;
	let prevTurn = [];
	for (let i = 0; i < A.length; i++) prevTurn[i] = A[i].slice(0);
	prevTurnsArr.push(prevTurn);
}

//считаем кол-во доступных ходов
function checkTurnsCount(arr, player) {
	if (player === 1) turnCount1 = 0;
	else if (player === 2) turnCount2 = 0;
	let i = 0;
	let j = 0;
	let flag = false;
	let isValid = [false];
	for (let x = 1; x <= 8; x++) {
		for (let y = 1; y <= 8; y++) {
			if (arr[y][x]) continue;
			i = x;
			j = y;
			isValid[0] = false;
			for (let stepI = -1; stepI <= 1; stepI++) {
				for (let stepJ = -1; stepJ <= 1; stepJ++) {
					if (!stepI && !stepJ) continue;
					for (let k = 0; k < 8; k++) {
						i += stepI;
						j += stepJ;
						flag = isValidTurn(i, j, arr, flag, player, isValid);
						if (!flag) { i = x; j = y; break;}
					}
					if (isValid[0]) break;
				}
				if (isValid[0]) break;
			}
		}
	}
}

//проверяем, корректно ли направление
function isValidTurn(i, j, arr, flag, player, isValid) {
	if (arr[j][i] === 3 - player) {
		return true;
	}
	else if (arr[j][i] === player && flag) {
		if (player == 1) turnCount1++;
		else if (player == 2) turnCount2++;
		isValid[0] = true;
		return false;
	}
	else {
		return false;
	}
}

