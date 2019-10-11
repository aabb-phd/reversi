"use strict";

alert(document.documentElement.clientHeight);
window.onload = function() {
	let chessTable = document.getElementById("chesstable");
	let context = chessTable.getContext("2d");
	chessTable.setAttribute("width", "400px");
	chessTable.setAttribute("height", "400px");

	let newGameButton = document.getElementById("new-game");
	let skipTurnButton = document.getElementById("skip-turn");
	let prevTurnButton = document.getElementById("prev-turn");
	let vsAiLabel = document.getElementById("vsai-label");
	let vsPlayerLabel = document.getElementById("vsplayer-label");
	vsAiLabel.classList.add("underlined");

		
	let A = [];//матрица значений
	//-1 - фиктивная клетка (за границей доски)
	//0 - пустая клетка
	//1 - зеленые фишки - игрок1
	//2 - синик фишки - игрок2
	for (let i = 0; i < 10; i++) A[i] = [];
	let turn = 0;//текущий ход
	let prevTurnsArr = [];//массив состояний поля для каждого хода, чтобы можно было отменить ход
	let sequenceOfMoves = [];//массив последовательностей ходов игроков (для корректного показа текущего хода при откате)
	let playersTurn = 1;//для показа цвета хода текущего игрока
	let switchturn = false;//условие, при котором можно передавать ход (если поле изменилось)
	let gameOver = false;//если игра оконцена, нельзя скипнуть ход
	let gameVsAi = true;//режим игры (против игрока или против ИИ)
	let buttonsEnabled = true;//во время хода ИИ кнопки не работают
	let turnSkipped = false;//если скипнули ход и ИИ не смог сделать ход - не сохраняем поле
	let count1 = 0;//очков у 1-ого игрока
	let count2 = 0;//очков у 2-ого игрока

	drawGrid();
	startNewGame();

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
			if (!count1 || !count2 || count1 + count2 === 64) checkWinner();
			whosTurn();
		}		
	}

	//отрисовка начального поля
	function initTable() {
		for (let i = 0; i < 10; i++) {
			A[i][0] = -1;
			A[i][9] = -1;
			A[0][i] = -1;
			A[9][i] = -1;
		}
		for (let i = 1; i <= 8; i++) {
			for (let j = 1; j <= 8; j++) {
				A[i][j] = 0;
			}
		}
		A[4][4] = 1;
		A[5][5] = 1;
		A[4][5] = 2;
		A[5][4] = 2;
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

	//отрисовка сетки
	function drawGrid() {
		context.lineWidth = 1;
		context.strokeStyle = "#000";
		for (let i = 50; i < 400; i+=50) {
			context.moveTo(i, 0);
			context.lineTo(i, 400);
			context.moveTo(0, i);
			context.lineTo(400, i);
		}
		context.stroke();
	}

	//отрисовка круга
	function drawCircle(x, y, color) {
		context.strokeStyle = "#fff";
		context.beginPath();
		context.arc(25 + 50*(x-1), 25 + 50*(y-1), 19, 0, 2*Math.PI, false);
		context.fillStyle = color;
		context.fill();
		context.stroke();
	}

	//перерисовка поля
	function drawTable() {
		for (let i = 1; i <= 8; i++) {
			for (let j = 1; j <= 8; j++) {
				if (A[j][i] === 1) drawCircle(i, j, '#2ba24a');
				else if (A[j][i] === 2) drawCircle(i, j, '#7376dc');
				else drawCircle(i, j, '#fff');
			}
		}
	}

	//проверяем клетки по направлениям для 1 игрока
	function checkCellsForGreen(i, j, x, y, flag, B) {
		if (A[j][i] === 2) {
			B[j][i] = 1;
			return true;
		}
		else if (A[j][i] === 1 && flag) {
			B[y][x] = 1;
			for (let i = 0; i < A.length; i++) A[i] = B[i].slice(0);
			for (let i = 0; i < A.length; i++) B[i] = A[i].slice(0);
			drawTable();
			switchturn = true;
			return false;
		}
		else {
			for (let i = 0; i < A.length; i++) B[i] = A[i].slice(0);
			return false;
		}
	}

	//проверяем клетки по направлениям для 2 игрока
	function checkCellsForBlue(i, j, x, y, flag, B) {
		if (A[j][i] === 1) {
			B[j][i] = 2;
			return true;
		}
		else if (A[j][i] === 2 && flag) {
			B[y][x] = 2;
			for (let i = 0; i < A.length; i++) A[i] = B[i].slice(0);
			for (let i = 0; i < A.length; i++) B[i] = A[i].slice(0);
			drawTable();
			switchturn = true;
			return false;
		}
		else {
			for (let i = 0; i < A.length; i++) B[i] = A[i].slice(0);
			return false;
		}
	}

	//проверяем клетку, если корректна - перерисовываем поле
	function checkTurn(x, y) {
		let B = [];
		for (let i = 0; i < A.length; i++) B[i] = A[i].slice(0);
		let i = x;
		let j = y;
		let flag = false;
		switchturn = false;
		while(i < 9) {
			i++;
			if (playersTurn === 1) flag = checkCellsForGreen(i, j, x, y, flag, B);
			else if (playersTurn === 2 && !gameVsAi) flag = checkCellsForBlue(i, j, x, y, flag, B);
			if (!flag) { i = x; j = y; break;}
		}
		while(i > 0) {
			i--;
			if (playersTurn === 1) flag = checkCellsForGreen(i, j, x, y, flag, B);
			else if (playersTurn === 2 && !gameVsAi) flag = checkCellsForBlue(i, j, x, y, flag, B);
			if (!flag) { i = x; j = y; break;}
		}
		while(j < 9) {
			j++;
			if (playersTurn === 1) flag = checkCellsForGreen(i, j, x, y, flag, B);
			else if (playersTurn === 2 && !gameVsAi) flag = checkCellsForBlue(i, j, x, y, flag, B);
			if (!flag) { i = x; j = y; break;}
		}
		while(j > 0) {
			j--;
			if (playersTurn === 1) flag = checkCellsForGreen(i, j, x, y, flag, B);
			else if (playersTurn === 2 && !gameVsAi) flag = checkCellsForBlue(i, j, x, y, flag, B);
			if (!flag) { i = x; j = y; break;}
		}
		while(i < 9 || j < 9) {
			i++;
			j++;
			if (playersTurn === 1) flag = checkCellsForGreen(i, j, x, y, flag, B);
			else if (playersTurn === 2 && !gameVsAi) flag = checkCellsForBlue(i, j, x, y, flag, B);
			if (!flag) { i = x; j = y; break;}
		}
		while(i > 0 || j > 0) {
			i--;
			j--;
			if (playersTurn === 1) flag = checkCellsForGreen(i, j, x, y, flag, B);
			else if (playersTurn === 2 && !gameVsAi) flag = checkCellsForBlue(i, j, x, y, flag, B);
			if (!flag) { i = x; j = y; break;}
		}
		while(i > 0 || j < 9) {
			i--;
			j++;
			if (playersTurn === 1) flag = checkCellsForGreen(i, j, x, y, flag, B);
			else if (playersTurn === 2 && !gameVsAi) flag = checkCellsForBlue(i, j, x, y, flag, B);
			if (!flag) { i = x; j = y; break;}
		}
		while(i < 9 || j > 0) {
			i++;
			j--;
			if (playersTurn === 1) flag = checkCellsForGreen(i, j, x, y, flag, B);
			else if (playersTurn === 2 && !gameVsAi) flag = checkCellsForBlue(i, j, x, y, flag, B);
			if (!flag) { i = x; j = y; break;}
		}
		if (switchturn) {
			if (!gameVsAi) saveTurn();
			if (gameVsAi) {
				buttonsEnabled = false;
				playersTurn = 2;
				setTimeout(checkAiTurn, 500);
				return;
			}
			if (playersTurn === 1) playersTurn = 2;
			else if (playersTurn === 2) playersTurn = 1;
		}		
	}

	//расчитываем наилучший вариант для хода ИИ
	function checkAiTurn() {
		let B = [];
		for (let i = 0; i < A.length; i++) B[i] = A[i].slice(0);
		let Bmax = [];
		for (let i = 0; i < A.length; i++) Bmax[i] = A[i].slice(0);
		let maxCount = [0];
		let i = 0;
		let j = 0;
		let flag = false;
		switchturn = false;

		for (let x = 1; x <= 8; x++) {
			for (let y = 1; y <= 8; y++) {
				if (A[y][x] > 0) continue;
				i = x;
				j = y;
				while(i < 9) {
					i++;
					flag = checkCellsForAI(i, j, x, y, flag, B, Bmax, maxCount);
					if (!flag) { i = x; j = y; break;}
				}
				while(i > 0) {
					i--;
					flag = checkCellsForAI(i, j, x, y, flag, B, Bmax, maxCount);
					if (!flag) { i = x; j = y; break;}
				}
				while(j < 9) {
					j++;
					flag = checkCellsForAI(i, j, x, y, flag, B, Bmax, maxCount);
					if (!flag) { i = x; j = y; break;}
				}
				while(j > 0) {
					j--;
					flag = checkCellsForAI(i, j, x, y, flag, B, Bmax, maxCount);
					if (!flag) { i = x; j = y; break;}
				}
				while(i < 9 || j < 9) {
					i++;
					j++;
					flag = checkCellsForAI(i, j, x, y, flag, B, Bmax, maxCount);
					if (!flag) { i = x; j = y; break;}
				}
				while(i > 0 || j > 0) {
					i--;
					j--;
					flag = checkCellsForAI(i, j, x, y, flag, B, Bmax, maxCount);
					if (!flag) { i = x; j = y; break;}
				}
				while(i > 0 || j < 9) {
					i--;
					j++;
					flag = checkCellsForAI(i, j, x, y, flag, B, Bmax, maxCount);
					if (!flag) { i = x; j = y; break;}
				}
				while(i < 9 || j > 0) {
					i++;
					j--;
					flag = checkCellsForAI(i, j, x, y, flag, B, Bmax, maxCount);
					if (!flag) { i = x; j = y; break;}
				}
			}
		}
		for (let i = 0; i < A.length; i++) A[i] = Bmax[i].slice(0);
		for (let i = 0; i < A.length; i++) Bmax[i] = A[i].slice(0);
		if (!(!maxCount[0] && turnSkipped)) saveTurn();
		maxCount = [0];
		drawTable();
		switchturn = true;
		playersTurn = 1;
		checkScores();
		if (!count1 || !count2 || count1 + count2 === 64) checkWinner();
		whosTurn();
		buttonsEnabled = true;
		turnSkipped = false;
	}

	//проверяем клетки по направлениям для ИИ
	function checkCellsForAI(i, j, x, y, flag, B, Bmax, maxCount) {
		if (A[j][i] === 1) {
			B[j][i] = 2;
			return true;
		}
		else if (A[j][i] === 2 && flag) {
			B[y][x] = 2;
			if (maxCount[0] < checkPossibleScores(B)) {
				maxCount[0] = checkPossibleScores(B);
				for (let i = 0; i < A.length; i++) Bmax[i] = B[i].slice(0);
			}
			for (let i = 0; i < A.length; i++) B[i] = A[i].slice(0);
			return false;
		}
		else {
			for (let i = 0; i < A.length; i++) B[i] = A[i].slice(0);
			return false;
		}
	}

	//расчитываем возможные очки для ИИ
	function checkPossibleScores(arr) {
		let AIcount = 0;
		for (let i = 1; i <= 8; i++) {
			for (let j = 1; j <= 8; j++) {
				if (arr[i][j] === 2) AIcount++;
				else continue;
			}
		}
		return AIcount;
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
		if (!count2 || (count1 + count2 === 64 && count1 > count2)) {
			span.textContent = "Выиграл:";
			circle.style.backgroundColor = "#2ba24a";
		}
		else if (!count1 || (count1 + count2 === 64 && count2 > count1)) {
			span.textContent = "Выиграл:";
			circle.style.backgroundColor = "#7376dc";
		}
		else if (count1 === 32 && count2 === 32) {
			span.textContent = "Ничья";
			circle.style.backgroundColor = "#fff";
		}
		gameOver = true;
		skipTurnButton.classList.add('disabled');
	}

	//кешируем текущий ход
	function saveTurn() {
		sequenceOfMoves[turn] = playersTurn;
		turn++;
		let prevTurn = [];
		for (let i = 0; i < A.length; i++) prevTurn[i] = A[i].slice(0);
		prevTurnsArr.push(prevTurn);
	}
}

