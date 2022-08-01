const socketIO = require("socket.io");

exports.sio = (server) => {
  return socketIO(server, {
    transport: ["polling"],
    cors: {
      origin: "*",
    },
  });
};

exports.connection = (io) => {
  io.on("connection", (socket) => {
    console.log("user connected");
    socket.on("message", (msg) => {
      console.log(`message from ${socket.id}: ${msg}`);
      socket.broadcast.emit("receive_message", msg);
    });
    socket.on("disconnect", () => {
      console.log(`socket ${socket.id} disconnected`);
    });
  });
};
