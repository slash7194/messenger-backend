const mongoose = require("mongoose");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

// MongoDB connection
mongoose.connect("mongodb+srv://messengeruser:MySecurePassword123@messenger-database.arbgo56.mongodb.net/messenger?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// Message schema
const messageSchema = new mongoose.Schema({
  username: String,
  message: String,
  timestamp: { type: Date, default: Date.now }
});
const Message = mongoose.model("Message", messageSchema);

// Express app setup
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Socket.io handling
io.on("connection", (socket) => {
  // Send old messages
  Message.find().then((docs) => {
    docs.forEach((doc) => {
      socket.emit("chat message", { username: doc.username, message: doc.message, timestamp: doc.timestamp });
    });
  });

  // Receive new messages
  socket.on("chat message", (data) => {
    const newMsg = new Message(data);
    newMsg.save()
      .then(() => {
        io.emit("chat message", data);
      })
      .catch((err) => {
        console.error("❌ Failed to save message:", err);
      });
  });
});

// Use dynamic port for deployment, default 3000 for local
const PORT = process.env.PORT || 3000;
server.listen(PORT, function() {
  console.log(`Server is running on port ${PORT}`);
});

