//эвристическая функция
function heuristicFunction(arr) {
	let weight = 0;

	return minTurnsHeuristic(arr) + newCheckersHeuristic(arr);
}

//едим как можно меньше фишек, но как можно больше стабильных
function newCheckersHeuristic(arr) {
	let unstableCheckers1 = 0, unstableCheckers2 = 0;
	let goodCheckers = 0, badCheckers = 0;
	for (let i = 1; i <=8; i++) {
		for (let j = 1; j <= 8; j++) {

			if (arr[i][j] === 2) {	
				if (i === 1 || i === 8) {
					if (2 < j < 7) {
						if (arr[i][j-1] === 1 && arr[i][j+1] === 2) badCheckers++;
						if (arr[i][j-1] === 1 && arr[i][j+1] === 0) badCheckers++;
						if (arr[i][j+1] === 1 && arr[i][j-1] === 2) badCheckers++;
						if (arr[i][j+1] === 1 && arr[i][j-1] === 0) badCheckers++;
						if (arr[i][j+1] === 0 && arr[i][j+2] === 2) badCheckers++;
						if (arr[i][j-1] === 0 && arr[i][j-2] === 2) badCheckers++;
						if (arr[i][j-1] === 1 && arr[i][j+1] === 1) goodCheckers++;
					}				
				} 
				else if (j === 1 || j === 8) {
					if (2 < i < 7) {
						if (arr[i-1][j] === 1 && arr[i+1][j] === 2) badCheckers++;
						if (arr[i-1][j] === 1 && arr[i+1][j] === 0) badCheckers++;
						if (arr[i+1][j] === 1 && arr[i-1][j] === 2) badCheckers++;
						if (arr[i+1][j] === 1 && arr[i-1][j] === 0) badCheckers++;
						if (arr[i+1][j] === 0 && arr[i+2][j] === 2) badCheckers++;
						if (arr[i-1][j] === 0 && arr[i-2][j] === 2) badCheckers++;
						if (arr[i-1][j] === 1 && arr[i+1][j] === 1) goodCheckers++;
					}	
				}
				else if (!arr[j+1][i] || !arr[j-1][i] || !arr[j][i+1] || !arr[j][i-1] || !arr[j-1][i+1] || 
						 !arr[j+1][i-1] || !arr[j+1][i+1] || !arr[j-1][i-1]) unstableCheckers2++;
			} 	

			else if (arr[i][j] === 1) {
				if (!arr[j+1][i] || !arr[j-1][i] || !arr[j][i+1] || !arr[j][i-1] || !arr[j-1][i+1] || 
					!arr[j+1][i-1] || !arr[j+1][i+1] || !arr[j-1][i-1]) unstableCheckers1++;
			} 
		}
	}

	if (arr[1][1] === 2) {
//		if (!arr[1][2] && arr[1][3] === 2) badCheckers += 50;
//		if (!arr[2][1] && arr[3][1] === 2) badCheckers += 50;
	}
	if (arr[8][8] === 2) {
//		if (!arr[8][7] && arr[8][6] === 2) badCheckers += 50;
//		if (!arr[7][8] && arr[6][8] === 2) badCheckers += 50;
	}
	if (arr[1][8] === 2) {
//		if (!arr[1][7] && arr[1][6] === 2) badCheckers += 50;
//		if (!arr[2][8] && arr[3][8] === 2) badCheckers += 50;
	}
	if (arr[8][1] === 2) {
//		if (!arr[7][1] && arr[6][1] === 2) badCheckers += 50;
//		if (!arr[8][2] && arr[8][3] === 2) badCheckers += 50;
	}

	if (arr[1][1] === 1) {
		if (arr[1][2] === 2 && arr[1][3] === 1) goodCheckers += 50;
		if (arr[2][1] === 2 && arr[3][1] === 1) goodCheckers += 50;
		if (arr[1][2] && arr[2][1]) goodCheckers += 200;
	}
	if (arr[8][8] === 1) {
		if (arr[8][7] === 2 && arr[8][6] === 1) goodCheckers += 50;
		if (arr[7][8] === 2 && arr[6][8] === 1) goodCheckers += 50;
		if (arr[7][8] && arr[8][7]) goodCheckers += 200;
	}
	if (arr[1][8] === 1) {
		if (arr[1][7] === 2 && arr[1][6] === 1) goodCheckers += 50;
		if (arr[2][8] === 2 && arr[3][8] === 1) goodCheckers += 50;
		if (arr[1][7] && arr[2][8]) goodCheckers += 200;
	}
	if (arr[8][1] === 1) {
		if (arr[7][1] === 2 && arr[6][1] === 1) goodCheckers += 50;
		if (arr[8][2] === 2 && arr[8][3] === 1) goodCheckers += 50;
		if (arr[7][1] && arr[8][2]) goodCheckers += 200;
	}

	return 2*(unstableCheckers1 - unstableCheckers2) + 20*goodCheckers - 20*badCheckers;
}

//принцип минимума
function minTurnsHeuristic(arr) {
	checkTurnsCount(arr, 1);
	checkTurnsCount(arr, 2);
	return turnCount2 - turnCount1;
}

