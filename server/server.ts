import { createServer } from "http";
import { Server, Socket } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
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
