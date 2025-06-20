const mongoose = require("mongoose");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

// MongoDB connection
mongoose.connect("mongodb+srv://messengeruser:e0wxFvpzVg0SYCFo@messenger-database.arbgo56.mongodb.net/messengerDB")
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Define schema + model
const messageSchema = new mongoose.Schema({
  username: String,
  message: String,
  timestamp: { type: Date, default: Date.now }
});
const Message = mongoose.model("Message", messageSchema);

// Express + server
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Socket.io
io.on("connection", (socket) => {
  console.log("🌐 New client connected");

  Message.find().then(docs => {
    docs.forEach(doc => {
      socket.emit("chat message", {
        username: doc.username,
        message: doc.message,
        timestamp: doc.timestamp
      });
    });
  });

  socket.on("chat message", (data) => {
    const newMsg = new Message(data);
    newMsg.save()
      .then(savedMsg => {
        io.emit("chat message", {
          username: savedMsg.username,
          message: savedMsg.message,
          timestamp: savedMsg.timestamp
        });
      })
      .catch(err => console.error("❌ Failed to save message:", err));
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
