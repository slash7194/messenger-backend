const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", function(socket) {
  console.log("A user connected");

  socket.on("chat message", function(data) {
    io.emit("chat message", data);
  });

  socket.on("disconnect", function() {
    console.log("A user disconnected");
  });
});

server.listen(3000, function() {
  console.log("Server is running");
});
