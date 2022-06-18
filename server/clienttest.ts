import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

socket.on("test", () => {
	console.log("hello");
})
// // send a message to the server
// socket.emit("hello from client");

// // receive a message from the server
// socket.on("hello from server", (...args) => {
//   // ...
// });