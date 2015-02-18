$(function() {
	window.Socket = io.connect();
	window.Core = new Core();
	
	Socket.on('connected', function(data) {
		Core.onConnect(data);
		console.log("[Socket:Connected] ID:", data);
	});
	
	Socket.on('login', function(data) {
		Core.onLogin(data);
	});

	Socket.on('alert', function(data){
		alert(data.Message);
	});

	Socket.on('message', function(data){
		Core.onMessage(data);
	});

	Socket.on('update', function(worldState) {
		Core.onUpdate(worldState);
	});
});