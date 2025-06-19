var express = require("express");
var app = express();
var path = require("path");
var http = require("http").createServer(app);
var io = require("socket.io")(http); // load socket.io

app.use(express.static(path.join(__dirname, "public")));

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Handle socket connections
io.on("connection", function(socket) {
  console.log("A user connected");

  socket.on("chat message", function(msg) {
    console.log("Message: " + msg);
    io.emit("chat message", msg); // Send to all clients
  });

  socket.on("disconnect", function() {
    console.log("A user disconnected");
  });
});

var PORT = 3000;
http.listen(PORT, function() {
  console.log("Server running at http://localhost:" + PORT);
});
