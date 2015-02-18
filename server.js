var Player = require('./nodemmo/objects/player');

var Server = function() {
	this.GameObjects = {
		parent: this,
		Items: {},
		Players: {},
		Maps: {},
	};

	this.pFunc = {
		parent: this,
		// Get Player
		// Player Name Only. getPlayerID(name) -> Player ID | Can't be offline
		getPlayerID: function(Name) {
			for(var object in this.parent.GameObjects.Players) {
				var player = this.parent.GameObjects.Players[object];
				if(player.Username == Name) return object
			}
			return null
		},
		// Player ID Only. getPlayer(getPlayerID(name)) -> Player Object | Can't be offline
		getPlayer: function(id) {
			var player = this.parent.GameObjects.Players[id];
			return player
		},
		// Player Only. isPlaying(getPlayer(getPlayerID(name))) -> Bool
		isPlaying: function(player) {
			if(player != null) {
				if(player.isLoged) { return true };
			}
			return false
		},
		// Do Stuff to Player
		sendMessage: function(Socket, _Message) {
			var Player = this.getPlayer(Socket.id);
			for(var gPlayerID in this.parent.GameObjects.Players) {
				var gPlayer = this.parent.GameObjects.Players[gPlayerID]
				if(this.isPlaying(gPlayer) && Player.Map == gPlayer.Map) {
					var gSocket = gPlayer.Socket;
					gSocket.emit('onMessage', {Sender:Player.Username, Message:_Message});
				}
			}

			Global.writeLine(Player.Username, ":", _Message);
		},
		sendPlayers: function(Socket) {
			var Player = this.parent.GameObjects.Players[Socket.id];
			if(this.isPlaying(Player)) {
				var sfPlayers =[];
				for(var gPlayerID in this.parent.GameObjects.Players) {
					var gPlayer = this.parent.GameObjects.Players[gPlayerID]
					if(this.isPlaying(gPlayer) && Player.Map == gPlayer.Map) {
						sfPlayers.push({id:gPlayer.id, Username:gPlayer.Username, Sprite:gPlayer.Sprite, Vittles:gPlayer.Vittles, Nourishment:gPlayer.Nourishment, Position:gPlayer.Position});
					}
				}
				Socket.emit("onPlayers", {Players:sfPlayers});
			}
		},
	};

	this.Network = {
		parent: this,
		kickPlayer: function(Socket, reason) {
			// TODO Reason
			Socket.disconnect();
		},
		onMessage: function(Socket, Message) {
			

			/*if(Message.startsWith("!")) {
				var Command = Message.substring(1).split("-");
				switch(Command[0].toLowerCase()) {
					case "test":
						this.parent.pFunc.sendMessage(Socket, "Server", "Test Done.");
					break;
					default:
						this.parent.pFunc.sendMessage(Socket, "Server", "Invaild Command.");
					break;
				}
			}*/
		},
		onConnect: function(Socket) {
			var player = new Player(); this.parent.GameObjects.Players[Socket.id] = player; // Create Blank player, has not loged in
		},
		onLogin: function(Socket, username, password) {
			// No password check yet, nothing is saved.
			var player = new Player();
			player.Username = username;
			player.isLoged = true;

			this.parent.GameObjects.Players[Socket.id] = player;
	  	},
	  	onLogout: function(Socket) {
	  		// Save this.Players[id];
	    	delete this.parent.GameObjects.Players[Socket.id];
	  	},
	  	onMovement: function(Socket, dir) {
	  		var player = this.parent.GameObjects.Players[Socket.id];
	  		if(player == 'undefined') return;

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
	  		if(dir == -1) {
	  			player.endAni();
	  		} else {
	  			player.chgDir(dir);player.moveX(movX*5);player.moveY(movY*5);player.nextAni();
	  		}
	  		
	  	},
	}

};

Server.prototype = {

};


module.exports = Server;