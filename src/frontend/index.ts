import { io } from "socket.io-client"
import { isNumericLiteral } from "typescript";

const BG_COLOR:string = '#231f20';
const SNAKE_COLOR:string = '#c2c2c2';
const FOOD_COLOR:string = '#e66916'
const socket = io('http://10.13.6.10:3000');

socket.on('init', handleInit);
socket.on('gameState', handleGameState);
socket.on('gameOver', handleGameOver);
socket.on('gameCode', handleGameCode);
socket.on('unknownGame', handleUnknownGame);
socket.on('tooManyPlayers', handleTooManyPlayers);

const gameScreen = document.getElementById('gameScreen') as HTMLElement;
const initialScreen = document.getElementById('initialScreen') as HTMLElement;
const newGameBtn = document.getElementById('newGameBtn');
const joinGameBtn = document.getElementById('joinGameBtn');
const gameCodeInput = document.getElementById('gameCodeInput') as HTMLInputElement;
const gameCodeDisplay = document.getElementById('gameCodeDisplay') as HTMLElement;

newGameBtn?.addEventListener('click', newGame);
joinGameBtn?.addEventListener('click', joinGame);

function newGame() {
	console.log("fefef");
	socket.emit('newGame');
	init();
}

function joinGame() {
	if (Number(gameCodeInput?.value) !== NaN) {
		const code: number = Number(gameCodeInput?.value);
		socket.emit('joinGame', code);
		init();
	}
}

let canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D;
let playerNumber: number;
let gameActive = false;

type Pos = {
	x:number,
	y: number,
}

type Player = {
	pos: Pos,
	vel: Pos,
	snake: Pos[],
}

type GameState = {
	players: Player[],
	food: Pos,
	gridsize: number,
};

export const defGameState: GameState = {
	players: [{
		pos: {
			x: 3,
			y: 10,
		},
		vel: {
			x: 1,
			y: 0,
		},
		snake: [
			{x: 1, y: 10},
			{x: 2, y: 10},
			{x: 3, y: 10},
		],
	}, {
		pos: {
			x: 17,
			y: 10,
		},
		vel: {
			x: -1,
			y: 0,
		},
		snake: [
			{x: 19, y: 10},
			{x: 18, y: 10},
			{x: 17, y: 10},
		],
	}],
	food: {
		x: 7,
		y: 7,
	},
	gridsize: 40,
};

function init() {
	initialScreen.style.display = "none";
	gameScreen.style.display = "block";
	canvas = document.getElementById('canvas') as HTMLCanvasElement;
	ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
	canvas.width = canvas.height = 600;

	ctx.fillStyle = BG_COLOR;
	ctx.fillRect(0,0, canvas.width, canvas.height);
	document.addEventListener('keydown', keydown);
	gameActive = true;
}

function keydown(e:KeyboardEvent) {
	socket.emit('keydown', e.keyCode);
	
}

function paintGame(state: GameState) {
	ctx.fillStyle = BG_COLOR;
	ctx.fillRect(0,0, canvas.width, canvas.height);

	const food = state.food;
	const gridsize = state.gridsize;
	const size = canvas.width / gridsize;

	ctx.fillStyle = FOOD_COLOR ?? '#e66916';
	ctx.fillRect(food.x * size, food.y * size, size, size);

	paintPlayer(state.players[0], size, SNAKE_COLOR);
	paintPlayer(state.players[1], size, 'red');
}

function paintPlayer(playerState: Player, size: number, color: string) {
	const snake = playerState.snake;

	ctx.fillStyle = color;
	for (let cell of snake) {
		ctx.fillRect(cell.x * size, cell.y * size, size, size);
	}
}

function handleInit(num: number) {
	playerNumber = num;
}

function handleGameState(gameStateString: string) {
	if (!gameActive) {
		return;
	}
	const gameState: GameState = JSON.parse(gameStateString);
	requestAnimationFrame(() => paintGame(gameState));
}

function handleGameOver(data: string) {
	if (!gameActive) {
		return ;
	}
	const winn:any = JSON.parse(data);
	if (winn.winner === playerNumber) {
		alert('You win !')
	} else {
		alert("You lose !");
	}
	gameActive = false;
}

function handleGameCode(gameCode: string) {
	gameCodeDisplay.innerText = gameCode;
}

function handleUnknownGame() {
	reset();
	alert("Unknown game code");
}

function handleTooManyPlayers() {
	reset();
	alert("This game is already in progress");
}

function reset() {
	playerNumber = 0;
	gameCodeInput.value = "";
	gameCodeDisplay.innerText = "";
	initialScreen.style.display = "block";
	gameScreen.style.display = "none";
}