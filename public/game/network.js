$(function() {
	window.Socket = false;
	window.Network = new Network();
	window.Game = new GameEngine();
});

var Network = function() {
	window.Socket = io.connect();
	// Data = ID
	Socket.on('onConnect', function(data) {
		Game.Network.onConnect(data);
		console.log("[Socket:Connected] ID:", data);
	});

	// Data = Status of failed, or boolean true of passed
	Socket.on('onLogin', function(data) {
		if(typeof data == "string") {
			console.log("Login Failed:", data);
		} else {
			Game.Network.onLogin(data);
		}
	});

	Socket.on('onPlayers', function(data) {
		if(typeof data == 'object') {
			window.Game.NetVar.Players = data.Players;
		} 
	});

	this.Send = {
		parent: this,
		
	};
}

Network.prototype = {
	sendLogin: function() {
		var _Username = $("#LoginUsername").val();
		var _Password = $("#LoginPassword").val();
		console.log("[Socket:sendLogin] Username:",_Username,"Password:",_Password)
		Socket.emit("onLogin", { Username:_Username, Password:_Password })
	},
	sendMovement: function(dir) {
		if(dir <= 3 && dir >= -1) { 
			Socket.emit("onMovement", dir);
		}
	}
}

