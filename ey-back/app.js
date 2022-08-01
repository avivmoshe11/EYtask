const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const app = express();
const http = require("http").Server(app);
const socketUtils = require("./utils/socketUtils");

const { Server } = require("socket.io");

mongoose
  .connect("mongodb+srv://avivadmin:avivadmin123@tasksdatabase.tmr7v.mongodb.net/EYTask")
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

const port = 3900;
http.listen(port, () => console.log(`Listening on port ${port}...`));

const io = new Server(http, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log("joined room");
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data.input);
    console.log(data);
  });
});
