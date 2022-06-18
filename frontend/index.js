const BG_COLOR = '#231f20';
const SNAKE_COLOR = '#c2c2c2';
const FOOD_COLOR = '#e66916';
const gameScreen = document.getElementById('gameScreen');
const socket = io('http://localhost:3000');
socket.on('init', handleInit);
let canvas, ctx;
const gState = {
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
            { x: 1, y: 10 },
            { x: 2, y: 10 },
            { x: 3, y: 10 },
        ],
    },
    food: {
        x: 7,
        y: 7,
    },
    gridsize: 20,
};
function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas === null || canvas === void 0 ? void 0 : canvas.getContext('2d');
    canvas.width = canvas.height = 600;
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    document.addEventListener('keydown', keydown);
}
function keydown(e) {
    console.log(e.keyCode);
}
init();
function paintGame(state) {
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const food = state.food;
    const gridsize = state.gridsize;
    const size = canvas.width / gridsize;
    ctx.fillStyle = FOOD_COLOR !== null && FOOD_COLOR !== void 0 ? FOOD_COLOR : '#e66916';
    ctx.fillRect(food.x * size, food.y * size, size, size);
    paintPlayer(state.player, size, SNAKE_COLOR);
}
function paintPlayer(playerState, size, color) {
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
