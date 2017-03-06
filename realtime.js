

module.exports = function(server, sessionMiddlewares)
{
	var io = require("socket.io")(server);	
	var redis = require("redis");
	var client = redis.createClient();

	client.subscribe("images");

	io.use(function(socket,next){
		sessionMiddlewares(socket.request,socket.request.res,next)
	});
	client.on("message",function(channel, message){
		if (channel=="images") {
			io.emit("new image", message)
			
		}
	});
	io.sockets.on("connection",function(socket){
		
	})
}