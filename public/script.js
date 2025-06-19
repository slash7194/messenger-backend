var socket = io();

var form = document.getElementById("chat-form");
var input = document.getElementById("m");
var messages = document.getElementById("messages");

form.addEventListener("submit", function(e) {
  e.preventDefault(); // stop form from submitting
  if (input.value) {
    socket.emit("chat message", input.value);
    input.value = "";
  }
});

socket.on("chat message", function(msg) {
  var item = document.createElement("li");
  item.textContent = msg;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});
