"use strict";
exports.__esModule = true;
var http_1 = require("http");
var socket_io_1 = require("socket.io");
var httpServer = (0, http_1.createServer)();
var io = new socket_io_1.Server(httpServer, {
    // ...
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
// io.on("connection", (socket: Socket) => {
//   // ...
//   socket.send(JSON.stringify({
// 	  type: "hello from server",
// 	  content: [1, "2"]
//   }))
//   socket.emit('test', {data: 'hello world' });
// });
io.listen(3000);
// import { Server } from "socket.io";
// const io = new Server(3000, { /* options */ });
// io.on("connection", (socket) => {
//   // ...
//   socket.emit("test", { data: 'hello world' });
// });
