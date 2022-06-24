import { GRID_SIZE } from './constants'
// import { GameState, Player, Pos } from '../frontend/index'

export type Pos = {
	x:number,
	y: number,
}

export type Player = {
	pos: Pos,
	vel: Pos,
	snake: Pos[],
}

export type GameState = {
	players: Player[],
	food: Pos,
	gridsize: number,
};

function createGameState(): GameState {
	return {
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
		gridsize: GRID_SIZE,
	};
}

function initGame() {
	const state: GameState = createGameState();
	randomFood(state);
	return state;
}

function gameLoop(state: GameState): number {
	if (!state) {
		return -1;
	}

	const playerOne: Player = state.players[0];
	const playerTwo: Player = state.players[1];
	playerOne.pos.x += playerOne.vel.x;
	playerOne.pos.y += playerOne.vel.y;
	playerTwo.pos.x += playerTwo.vel.x;
	playerTwo.pos.y += playerTwo.vel.y;
	if (playerOne.pos.x < 0 || playerOne.pos.x >= GRID_SIZE || playerOne.pos.y < 0 || playerOne.pos.y >= GRID_SIZE) {
		console.log(playerOne);
		return 2;
	}
	if (playerTwo.pos.x < 0 || playerTwo.pos.x >= GRID_SIZE || playerTwo.pos.y < 0 || playerTwo.pos.y >= GRID_SIZE) {
		console.log(playerTwo);
		return 1;
	}
	if (state.food.x === playerOne.pos.x && state.food.y === playerOne.pos.y) {
		playerOne.snake.push({ ...playerOne.pos});
		playerOne.pos.x += playerOne.vel.x;
		playerOne.pos.y += playerOne.vel.y;
		randomFood(state);
	}

	if (state.food.x === playerTwo.pos.x && state.food.y === playerTwo.pos.y) {
		playerTwo.snake.push({ ...playerTwo.pos});
		playerTwo.pos.x += playerTwo.vel.x;
		playerTwo.pos.y += playerTwo.vel.y;
		randomFood(state);
	}

	if (playerOne.vel.x || playerOne.vel.y) {
		for (let cell of playerOne.snake) {
			if (cell.x === playerOne.pos.x && cell.y === playerOne.pos.y) {
				return 2;
			}
		}
		for (let cell of playerTwo.snake) {
			if (cell.x === playerOne.pos.x && cell.y === playerOne.pos.y) {
				return 2;
			}
		}
		playerOne.snake.push({...playerOne.pos});
		playerOne.snake.shift();
	}
	if (playerTwo.vel.x || playerTwo.vel.y) {
		for (let cell of playerTwo.snake) {
			if (cell.x === playerTwo.pos.x && cell.y === playerTwo.pos.y) {
				return 1;
			}
		}
		for (let cell of playerOne.snake) {
			if (cell.x === playerTwo.pos.x && cell.y === playerTwo.pos.y) {
				return 1;
			}
		}
		playerTwo.snake.push({...playerTwo.pos});
		playerTwo.snake.shift();
	}
	return 0;
}

function randomFood(state: GameState): any {
	const food: Pos = {
		x: Math.floor(Math.random() * GRID_SIZE),
		y: Math.floor(Math.random() * GRID_SIZE),
	}
	for(let cell of state.players[0].snake) {
		if (cell.x === food.x && cell.y == food.y) {
			return randomFood(state);
		}
	}
	for(let cell of state.players[1].snake) {
		if (cell.x === food.x && cell.y == food.y) {
			return randomFood(state);
		}
	}
	state.food = food;
}

function getUpdatedVelocity(keyCode: number, vel:Pos) {
	switch (keyCode) {
		case 37: { // left
			if (vel.x === 1)
				return vel;
			return { x: -1, y: 0};
		}
		case 38: { // up
			if (vel.y === 1)
				return vel;
			return { x: 0, y: -1};
		}
		case 39: { // right
			if (vel.x === -1)
				return vel;
			return { x: 1, y: 0};
		}
		case 40: { //down
			if (vel.y === -1)
				return vel;
			return { x: 0, y: 1};
		}
	}
}

export { initGame, gameLoop, getUpdatedVelocity};