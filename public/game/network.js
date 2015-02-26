$(function() {
	window.Socket = false;
	window.Network = new Network();
	window.Game = new GameEngine();

	$('#chatBox').bind("enterKey",function(e){
		Socket.emit('onMessage', $('#chatBox').val());
		$('#chatBox').val("");
	});
	$('#chatBox').keyup(function(e){
	    if(e.keyCode == 13)
	    {
	        $(this).trigger("enterKey");
	    }
	});
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
		// IF onLogin is called ilegaly, it would not get sent data
		// Client side check is OK
		if(data == true) {
			console.log("[Socket:sendLogin] Passed:", data);
			Game.Network.onLogin(data);
		} else {
			console.log("[Socket:sendLogin] Failed:", data);
		}
	});

	Socket.on('onPlayers', function(data) {
		if(typeof data == 'object') {
			window.Game.NetVar.Players = data.Players;
		} 
	});

	Socket.on('onMessage', function(data) {
		$( "#chatLog" ).append( "<p><xmp>" + data.Sender + ": " + data.Message + "</xmp></p>" );
	});

	Socket.on('popup', function(data) {
		alert("Server: " + data);
	});
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
	},
	sendReset: function() {
		Socket.emit("onMovement", -1);
	},
}

