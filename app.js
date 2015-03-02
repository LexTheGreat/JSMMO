var GlobalObject = require("./nodemmo/global");
var Player = require('./nodemmo/objects/player');
var ServerCore = require("./server");
var ConsoleLib = require("./consolelib");

var Global = new GlobalObject();
var GameServer = new ServerCore();
var NConsole = new ConsoleLib();


NConsole.writeLine("===================");
NConsole.writeLine("Working Server.....");
Global.setupServer("public", 3232);
NConsole.writeLine("-------------------");


// Prototype Funcs
if (typeof Array.prototype.contains != 'function') {
	Array.prototype.contains = function(obj) {
	    var i = this.length;
	    while (i--) {
	        if (this[i] === obj) {
	            return true;
	        }
	    }
	    return false;
	};
}

if (typeof String.prototype.endsWith != 'function') {
  String.prototype.endsWith = function (str){
    return this.slice(-str.length) == str;
  };
}

if (typeof String.prototype.startsWith != 'function') {
  String.prototype.startsWith = function (str){
    return this.slice(0, str.length) == str;
  };
}

if (typeof String.prototype.hasWhiteSpace != 'function') {
	String.prototype.hasWhiteSpace = function () {
		return this.indexOf(' ') >= 0;
	}
}

var ClientSocket = {};
Global.Server.sockets.on('connection', function(socket) {
	NConsole.writeLine("[" + socket.id + ":connection] Socket Connected!");
	ClientSocket[socket.id] = socket;
	GameServer.Network.onConnect(socket.id);
	socket.emit('onConnect', socket.id);

	socket.on('onLogin', function(data) {
		if(typeof data.Username != 'string' || typeof data.Password != "string") {
			//NConsole.writeLine("Login Test: False | Not String");
			socket.emit('onLogin', "Incorect Data. Kicked! (Stop Trying to Cheat!)");
			NConsole.writeLine("[" + socket.id + ":AntiPacket]: Socket sent incorect Data! (" + data + ")");
			NConsole.writeLine("[" + socket.id + ":onLogin]: Kicked for Incorect login data.");
			GameServer.Network.kickPlayer(socket);
			return;
		}
		if((data.Username.length < 6 || data.Username.length > 12) || (data.Password.length < 6 || data.Password.length > 12 || data.Username.hasWhiteSpace() || data.Password.hasWhiteSpace())) { 
			//NConsole.writeLine("Login Test: False | Username or Password To long");
			NConsole.writeLine("[" + socket.id + ":onLogin]: Username or Password length incorect.");
			socket.emit('onLogin', "Username or Password length incorect. | > 6 | < 12 | No Spaces!");
			return;
		}

		if(!GameServer.pFunc.isPlaying(GameServer.pFunc.getPlayerID(data.Username))) {
			GameServer.Network.onLogin(socket, data.Username, data.Password);
		}
	});
	socket.on('onMovement', function(data) {
		if(typeof data != 'number') {
			socket.emit('popup', "Incorect Data. Kicked! (Stop Trying to Cheat!)");
			NConsole.writeLine("[" + socket.id + ":AntiPacket]: Socket sent incorect Data! (" + data + ")");
			GameServer.Network.kickPlayer(socket);
			return;
		}
		if(data > 3 && data < -1) { 
			socket.emit('popup', "Incorect Data. Kicked! (Stop Trying to Cheat!)");
			NConsole.writeLine("[" + socket.id + ":AntiPacket]: Socket sent incorect Data! (" + data + ")");
			GameServer.Network.kickPlayer(socket);
			return;
		}		
		GameServer.Network.onMovement(socket, data);
	});
	socket.on('onMessage', function(data) {
		if(typeof data != 'string') {
			NConsole.writeLine("[" + socket.id + ":AntiPacket]: Socket sent incorect Data! (" + data + ")");
			socket.emit('popup', "Incorect Data. Kicked! (Stop Trying to Cheat!)");
			GameServer.Network.kickPlayer(socket);
			return;
		}
		if(data.length > 100 && data.length == 0) { 
			socket.emit('popup', "Message to length incorect! | < 100 | > 0 |");
			return;
		}
		GameServer.Network.onMessage(socket, data);
	});
	socket.on('disconnect', function() {
		NConsole.writeLine("[" + socket.id + ":disconnect]: Disconnected!");
		if(typeof GameServer.GameObjects.Players[socket.id] != "undefined") {
			GameServer.Network.onLogout(socket);
		}
		delete ClientSocket[socket.id];
	});
});

ServerLoop = function() {
	setTimeout(function() {
		var self = this;
		for(var SocketID in ClientSocket) {
			if(SocketID != 'undefined') {
				var Socket = ClientSocket[SocketID];
				if(Socket != 'undefined') {
					GameServer.pFunc.sendPlayers(Socket);
				}
			}
		}
		setImmediate(ServerLoop)
	}, 1000/60);
}
setImmediate(ServerLoop)


// TODO Finish