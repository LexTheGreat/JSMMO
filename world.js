var Player = require('./player')

var World = function() {
  	this.Players = {};
  	this.Entitys = {};
  	this.FPS = 30;
};

World.prototype = {
	kickPlayer: function(socket, reason) {
		console.log(this.Players[socket.id].Username, "was kicked:", reason)
		socket.emit("alert", {Message: "[KICKED] " + reason});
		socket.disconnect();
	},
	//
	getPlayerID: function(name) {
		for(var object in this.Players) {
			var player = this.Players[object];
			if(player.isLoged && player.Username == name) return object
		}
		return null
	},
	getPlayer: function(id) {
		var player = this.Players[id];
		if(player.isLoged) return player
		return null
	},
	isPlaying: function(id) {
		if(this.Players[id] != null)
			if(this.Players[id].isLoged) return true
		return false
	},
	// 
	onMessage: function(Socket, Message) {
		if(Message.startsWith("!")) {
			var Command = Message.substring(1).split("|");
			switch(Command[0].toLowerCase()) {
				case "setname":
					if(Command.length = 2) {this.Players[Socket.id].Username = Command[1];Socket.emit('message', { name:"Server", message:"Username Changed"});} else {Socket.emit('message', { name:"Server", message:"Username Change Failed"});}
				break;
			}
			return true;
		}
		return false;
	},
	onConnect: function(id) {
		var player = new Player(); this.Players[id] = player; // Create Blank player, has not loged in
	},
	onLogin: function(id, username, password) {
		var player = new Player(); player.Username = username;  player.isLoged = true; 

		this.Players[id] = player;
  	},
  	onLogout: function(id) {
    	delete this.Players[id];
  	},
  	onMovement: function(id, dir) {
  		var player = this.Players[id];
  		var movX = 0; var movY = 0;
  		switch(dir) {
  			case 0:
  				movY = 1
  				break;
  			case 1:
  				movX = -1
  				break;
  			case 2:
  				movX = 1
  				break;
  			case 3:
  				movY = -1
  				break;
  		}
  		player.chgDir(dir);player.moveX(movX*5);player.moveY(movY*5);player.nextAni();
  	},
  	Create: function(callback) {
    	var self = this;
    	setInterval(function() {
			var sfPlayers = [];
			for(var player in self.Players) {
				var object = self.Players[player];
				if(object.isLoged) {
					sfPlayers.push({id:object.id, Username:object.Username, Sprite:object.Sprite, Vittles:object.Vittles, Nourishment:object.Nourishment, Position:object.Position})
				}
			}
			callback(sfPlayers)
    	}, 1000/this.FPS);
	}
};

module.exports = World;