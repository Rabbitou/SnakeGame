const BG_COLOR:string = '#231f20';
const SNAKE_COLOR:string = '#c2c2c2';
const FOOD_COLOR:string = '#e66916'
const gameScreen: HTMLElement = document.getElementById('gameScreen');
// const socket = io('http://localhost:3000');

// socket.on('init', handleInit);

let canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D;

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
	player: Player,
	food: Pos,
	gridsize: number,
};

const gState: GameState = {
	player: {
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
	},
	food: {
		x: 7,
		y: 7,
	},
	gridsize: 20,
};

function init() {
	canvas = document.getElementById('canvas') as HTMLCanvasElement;
	ctx = canvas?.getContext('2d');
	canvas.width = canvas.height = 600;

	ctx.fillStyle = BG_COLOR;
	ctx.fillRect(0,0, canvas.width, canvas.height);
	document.addEventListener('keydown', keydown);
}

function keydown(e) {
	console.log(e.keyCode);
	
}

init();

function paintGame(state: GameState) {
	ctx.fillStyle = BG_COLOR;
	ctx.fillRect(0,0, canvas.width, canvas.height);

	const food = state.food;
	const gridsize = state.gridsize;
	const size = canvas.width / gridsize;

	ctx.fillStyle = FOOD_COLOR ?? '#e66916';
	ctx.fillRect(food.x * size, food.y * size, size, size);

	paintPlayer(state.player, size, SNAKE_COLOR);
}

function paintPlayer(playerState: Player, size, color) {
	const snake = playerState.snake;

	ctx.fillStyle = color;
	for (let cell of snake) {
		ctx.fillRect(cell.x * size, cell.y * size, size, size);
	}
}
paintGame(gState);

function handleInit(msg) {
	console.log(msg);
}