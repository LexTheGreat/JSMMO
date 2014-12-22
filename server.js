var express = require('express'), http = require('http'), pp = express(), fs = require('fs'), rqWorld = require('./world'), io = require('socket.io')
var app = new express();
app.use(express.static(__dirname + '/public'));
var server = http.createServer(app).listen(3232);
console.log('Starting Server on port ', 3232);
	
var world = new rqWorld();
var io = io.listen(server);
var lastWorldState = null

io.sockets.on('connection', function(socket) {
	world.onConnect(socket.id);
	socket.emit('connected', socket.id);
	socket.emit('update', lastWorldState)
	
	socket.on('login', function(data) {
		if(!world.isPlaying(world.getPlayerID(data.Username))) {
			world.onLogin(socket.id, data.Username, data.Password);
			socket.emit('login', true);
		} else {
			socket.emit('login', false);
		}
	});

	socket.on('movement', function(data) {
		if(world.isPlaying(socket.id)) {
			if(!(data >= 0 && data <= 3)) {
				world.kickPlayer(socket, "Stop trying to cheat!")
				return
			}
			world.onMovement(socket.id, data);
		}
	});

	socket.on('message', function(data) {
		var safeMessage = data.replace('"', "''").replace('\\', '/')
		if(!world.onMessage(socket, safeMessage)) {
			io.sockets.clients().forEach(function(psocket) {
				if(world.isPlaying(psocket.id)) {
					console.log(world.Players[socket.id].Username + ":", safeMessage);
					psocket.emit('message', { name:world.Players[socket.id].Username, message:safeMessage});
				}
			});
		}
	});

	socket.on('disconnect', function() {
		io.sockets.emit('message', { name:'Server', message: world.Players[socket.id].Username + ' has vanished'});
		world.onLogout(socket.id);
	});
});

world.Create(function(worldState) {
	if(lastWorldState != worldState) {
		io.sockets.clients().forEach(function(socket) {
			if(world.isPlaying(socket.id)) {
				socket.emit('update', worldState);
			} else {
				socket.emit('update', false);
			}
		});
		lastWorldState = worldState
	}
});

io.set("log level", 1);


// Other
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