var socket = io();
console.log("hola mudno")
socket.on("new image", function(data) {
	data = JSON.parse(data);

	console.log("hola")
})