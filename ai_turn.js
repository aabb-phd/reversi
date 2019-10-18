//расчитываем наилучший вариант для хода ИИ
function checkAiTurn() {
	let B = [];
	for (let i = 0; i < A.length; i++) B[i] = A[i].slice(0);
	let C = [];
	for (let i = 0; i < A.length; i++) C[i] = A[i].slice(0);
	let Bmax = [];
	for (let i = 0; i < A.length; i++) Bmax[i] = A[i].slice(0);
	let maxCount = [-9000000];
	let isValid = [false];
	let i = 0;
	let j = 0;
	let flag = false;
	switchturn = false;

	for (let x = 1; x <= 8; x++) {
		for (let y = 1; y <= 8; y++) {
			if (A[y][x]) continue;
			i = x;
			j = y;
			for (let stepI = -1; stepI <= 1; stepI++) {
				for (let stepJ = -1; stepJ <= 1; stepJ++) {
					if (!stepI && !stepJ) continue;
					for (let k = 0; k < 8; k++) {
						i += stepI;
						j += stepJ;
						flag = isValidForAI(i, j, x, y, flag, B, C, isValid);
						if (!flag) { i = x; j = y; break;}
					}
				}
			}
			if (isValid[0] && maxCount[0] < heuristicFunction(C) + W[y][x]) {
				maxCount[0] = heuristicFunction(C) + W[y][x];
				for (let i = 0; i < A.length; i++) Bmax[i] = C[i].slice(0);
			}
			isValid[0] = false;
			for (let i = 0; i < A.length; i++) C[i] = A[i].slice(0);
			for (let i = 0; i < A.length; i++) B[i] = A[i].slice(0);
		}
	}
	for (let i = 0; i < A.length; i++) A[i] = Bmax[i].slice(0);
	for (let i = 0; i < A.length; i++) Bmax[i] = A[i].slice(0);
	if (!(maxCount[0] === -9000000 && turnSkipped)) saveTurn();
	maxCount = [-9000000];
	drawTable();
	switchturn = true;
	playersTurn = 1;
	checkScores();
	checkTurnsCount(A, 1);
	checkTurnsCount(A, 2);

	console.log(turnCount1, turnCount2);
	console.log(minTurnsHeuristic(A));
	console.log(newCheckersHeuristic(A));

	if (!turnCount1 && !turnCount2) gameOver = true;
	if (gameOver) checkWinner();
	whosTurn();
	buttonsEnabled = true;
	turnSkipped = false;
}

//проверяем, корректно ли направление для ИИ
function isValidForAI(i, j, x, y, flag, B, C, isValid) {
	if (C[j][i] === 1) {
		B[j][i] = 2;
		return true;
	}
	else if (C[j][i] === 2 && flag) {
		isValid[0] = true;
		B[y][x] = 2;
		for (let i = 0; i < A.length; i++) C[i] = B[i].slice(0);
		for (let i = 0; i < A.length; i++) B[i] = C[i].slice(0);
		return false;
	}
	else {
		for (let i = 0; i < A.length; i++) B[i] = C[i].slice(0);
		return false;
	}
}
