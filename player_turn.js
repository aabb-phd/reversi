//проверяем, корректно ли направление для игрока
function isValidForPlayer(i, j, x, y, flag, B, playersTurn) {
	if (A[j][i] === 3 - playersTurn) { //3 - playersTurn = клетка оппонента (если мы 1 - то оппонент 2)
		B[j][i] = playersTurn;
		return true;
	}
	else if (A[j][i] === playersTurn && flag) {
		B[y][x] = playersTurn;
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

	for (let stepI = -1; stepI <= 1; stepI++) {
		for (let stepJ = -1; stepJ <= 1; stepJ++) {
			if (!stepI && !stepJ) continue;
			for (let k = 0; k < 8; k++) {
				i += stepI;
				j += stepJ;
				if (playersTurn === 1 || (playersTurn === 2 && !gameVsAi)) flag = isValidForPlayer(i, j, x, y, flag, B, playersTurn);
				if (!flag) { i = x; j = y; break;}
			}
		}
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
