const socket = io();

const form = document.getElementById("chat-form");
const input = document.getElementById("m");
const usernameInput = document.getElementById("username");
const messages = document.getElementById("messages");

form.addEventListener("submit", function(e) {
  e.preventDefault(); // prevent page reload
  
  const username = usernameInput.value.trim();
  const message = input.value.trim();

  if (username && message) {
    socket.emit("chat message", { username: username, message: message });
    input.value = ""; // clear message input
  }
});

socket.on("chat message", function(data) {
  const item = document.createElement("li");
  item.textContent = data.username + ": " + data.message;
  messages.appendChild(item);
});
