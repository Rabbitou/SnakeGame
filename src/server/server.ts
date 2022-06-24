import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { gameLoop, getUpdatedVelocity, initGame, GameState } from './game';
import { FRAME_RATE,GRID_SIZE } from './constants';
// import { GameState, defGameState } from '../frontend/index';
import { makeid } from './utils';

const defGameState: GameState = {
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

const httpServer = createServer();
const io = new Server(httpServer, {
	// ...
	cors: {
		origin: "*",
		methods: ["GET", "POST"]
	}
});

const gState: GameState[] = [];
const clientRooms: Map<string, number> = new Map();

io.on("connection", (socket: Socket) => {
	socket.on('keydown', handleKeydown);
	socket.on('newGame', handleNewGame);
	socket.on('joinGame', handleJoinGame);

	let num:number;
	function handleJoinGame(gameCode: number) {
		const room:Set<string> | undefined = io.sockets.adapter.rooms.get('' + gameCode);
		let allUsers;
		console.log(room?.size);
		if (!room) {
			// allUsers = room.sockets;
			socket.emit('unknownGame');
			return ;
		}
		let numClients:number = room.size;
		// if (allUsers) {
		// 	numClients = Object.keys(allUsers).length;
		// }
		if (numClients === 0) {
			socket.emit('unknownGame');
			return;
		} else if (numClients > 1) {
			socket.emit('tooManyPlayers');
			return;
		}
		clientRooms.set(socket.id, gameCode);

		socket.join('' + gameCode);
		num = 2;
		socket.emit('init', 2);

		startGameInterval(gameCode);
	}

	function handleNewGame() {
		// let roomName: number = makeid(5);
		let roomName: number = 2;
		clientRooms.set(socket.id, roomName);
		socket.emit('gameCode', roomName);

		gState[roomName] = initGame();

		socket.join('' + roomName);
		num = 1;
		socket.emit('init', 1);
	}

	function handleKeydown(keyCode: string) {
		let k:number;
		const roomName:number = clientRooms.get(socket.id)!;
		// const roomName = clientRooms[socket.id];
		try {
			k = parseInt(keyCode);
		} catch(e) {
			console.error(e);
			return;
		}
		const vel = getUpdatedVelocity(k, gState[roomName].players[num - 1].vel);
		if (vel) {
			gState[roomName].players[num - 1].vel = vel;
		}
	}
});

function startGameInterval(roomName: number) {
	const intervalId = setInterval(() => {
		const winner: number = gameLoop(gState[roomName]);
		if (!winner) {
			emitGameState('' + roomName, gState[roomName]);
		}
		else {
			emitGameOver('' + roomName, winner);
			gState[roomName] = defGameState;
			clearInterval(intervalId);
		}
	}, 1000 / FRAME_RATE);
}

function emitGameState(roomName: string, state: GameState) {
	io.sockets.in(roomName).emit('gameState', JSON.stringify(state));
}

function emitGameOver(roomName:string, winner: number) {
	io.sockets.in(roomName).emit('gameOver', JSON.stringify({ winner }));
}

io.listen(3000);
