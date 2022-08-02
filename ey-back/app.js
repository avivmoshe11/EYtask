require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const app = express();
const http = require("http").Server(app);

const { Server } = require("socket.io");

mongoose
  .connect(process.env.LOGIN_ATLAS)
  .then(() => {
    console.log("connected to mongodb");
  })
  .catch((err) => {
    console.log(`could not connect to mongo db ${err}`);
  });

app.use(require("morgan")("dev"));
app.use(cors());
app.use(express.json());

app.use("/api/users", usersRouter);
app.use("/api/auth", authRouter);

http.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}...`));

const io = new Server(http, {
  cors: {
    origin: process.env.FRONT_ADDR,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    if (socket.rooms.size > 1) {
      let i = 0;
      let room;
      for (const roomKey of socket.rooms.keys()) {
        if (i == 1) {
          room = roomKey;
        }
        i++;
      }
      console.log("leave this ", room);
      socket.leave(room);
      socket.rooms.delete(room);
    }
    socket.join(data);
    console.log("joined room", data);
  });

  socket.on("leave_room", (data) => {
    socket.leave(data);
    console.log("left room", data);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data.input);
    console.log(data);
  });
});
