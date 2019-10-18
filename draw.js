"use strict";


let chessTable = document.getElementById("chesstable");
let context = chessTable.getContext("2d");
chessTable.setAttribute("width", "400px");
chessTable.setAttribute("height", "400px");


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
