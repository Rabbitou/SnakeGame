import io from 'socket.io-client';
const socket = io("http://localhost:3000");
socket.on("test", handleInit);
function handleInit(msg) {
    console.log(msg);
}
// socket.on("test", () => {
// 	console.log("hello");
// })