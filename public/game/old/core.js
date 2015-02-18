window.Core = function() {
	this.canvas = document.getElementById('canvas');
	this.canvas.width = window.innerWidth;
	this.canvas.height = window.innerHeight;
	this.myIndex = null;
	this.logedIn = false; // For gui, since no data is sent before login
	this.fps = 0;
	this.ctx = canvas.getContext('2d');

	this.canvas.addEventListener("keydown", onKeydown, false);
	this.canvas.addEventListener("keyup", onKeyup, false);
	this.Players = {}; // Synced
	this.Entitys = {}; // Will be Synced?
	this.Messages = [""]; // Not Synced, Might change...
	// Keys
	this.PressedKeys = [0];
};
Core.prototype = {
	// Do stuff
	doMovement: function() { // Checked on the server
		var dir = 4;
		if(Core.PressedKeys.length > 1) {
			switch(Core.PressedKeys[1]) {
				case 83:
					dir = 0;
					break;
				case 68:
					dir = 2;
					break;
				case 87:
				 	dir = 3;
					break;
				case 65:
					dir = 1;
					break;
			}
		}
		if(dir < 4) { 
			Socket.emit("movement", dir);
		}
	},
	stopMovement: function() {
		if(dir < 4) {
			Socket.emit("stop");
		}
	},
	// getPlay stuff
	getPlayerID: function(name) {
		for(var object in this.Players) {
			var player = this.Players[object];
			if(player.Username == Name) return object;
		}
	},
	getPlayer: function(id) {
		return this.Players[id];
	},
	// Drawing
	drawLargeText: function(text, x, y) {
		this.ctx.fillStyle = "#FFFFFF";
		this.ctx.font = "25px 'BIMINI'";
		this.ctx.fillText(text, x, y);
	},
	drawChatText: function(text, x, y) {
		this.ctx.fillStyle = "#FFFFFF";
		this.ctx.font = "15px 'BIMINI'";
		this.ctx.fillText(text, x, y);
	},
	drawNameText: function(text, color, x, y) {
		this.ctx.fillStyle = color;
		this.ctx.font = "15px 'BIMINI'";
		this.ctx.textAlign = "center";
		this.ctx.fillText(text, x, y);
	},
	drawPlayers: function() {
		for(var object in this.Players) {
			var player = this.Players[object];
			this.drawNameText(player.Username, "#FFFFFF", player.Position.x+(96/2), player.Position.y-100);
			this.drawSprite(player.Sprite, player.Position.x, player.Position.y, player.Position.dir, player.Position.ani)
		}
	},
	drawSprite : function(sprite, x, y, d, f) {
		var frameY = d*96;
		var frameX = f*96;
		var h = 96;
		var w = 96;
		var posX = x;
		var posY = y - 96;

		this.ctx.drawImage(Cache.getImage("img/sprite/" + sprite + ".png"), frameX, frameY, w, h, posX, posY, w, h);
	},
	drawGUI: function() {
		this.ctx.beginPath();
		this.drawLargeText("FPS: " + this.fps, 5, 20);

		if(this.logedIn) {
			this.chatInput.render();
			for(var i = 0; i < this.Messages.length; i++) {
				if(i >= 10) return;
				var tempText = this.Messages[this.Messages.length-i];
				if(tempText != undefined) {
					this.drawChatText(tempText, 10, window.innerHeight-40-(15*i));
				}
			}
		} else {
			this.ctx.textAlign = "center";
			this.drawLargeText("JSMMO", window.innerWidth/2, window.innerHeight/2)
			this.usernameInput.render();
		}
	},
	render: function() {
		this.ctx.clearRect(0, 0, 500, 400);
		this.ctx.fillRect(0, 0, canvas.width, canvas.height);
		this.ctx.save();
		this.drawGUI();
		this.drawPlayers();
		this.ctx.restore();

		this.fps = fps.getFPS();
	},
	// Networking
	onUpdate: function(data) {
		if(data != false) {
			this.Players = data;
			this.doMovement();
		}
		this.render()
	},
	onConnect: function(id) {
		this.myIndex = id;
		this.usernameInput = new CanvasInput({
		  canvas: document.getElementById('canvas'),
		  placeHolder: 'Username...',
		  onsubmit: function() {
		  	Socket.emit("login", { Username:this.value(), Password:"" })
			this.value("");
		  },
		  width: 500,
		  y: (window.innerHeight / 2) + 100,
		  x: (window.innerWidth / 2) - (500 / 2)
		});
	},
	onLogin: function(passed) {
		if(passed) {
			this.usernameInput.remove();
			this.usernameInput = null;

			this.chatInput = new CanvasInput({
			  canvas: document.getElementById('canvas'),
			  placeHolder: 'Send message...',
			  onsubmit: function() {
			  	Socket.emit("message", this.value());
				this.value("");
			  },
			  width: 500,
			  y: window.innerHeight - 40,
			  x: 10
			});
			this.logedIn = true;
		} else {
			alert("Username and/or Password is wrong!");
		}
	},
	onMessage: function(data) {
		this.Messages.push(data.name + ": " + data.message);
	}
};

function contains(array, obj) {
    if(jQuery.inArray(obj, array) > 0) return true
    return false;
}

function del(array, obj) {
	return jQuery.grep(array, function(value) { return value != obj; })
}

function wrapText(context, text, x, y, maxWidth, lineHeight) {
        var cars = text.split("\n");

        for (var ii = 0; ii < cars.length; ii++) {

            var line = "";
            var words = cars[ii].split(" ");

            for (var n = 0; n < words.length; n++) {
                var testLine = line + words[n] + " ";
                var metrics = context.measureText(testLine);
                var testWidth = metrics.width;

                if (testWidth > maxWidth) {
                    context.fillText(line, x, y);
                    line = words[n] + " ";
                    y += lineHeight;
            } else {
            	line = testLine;
        	}
        }
		context.fillText(line, x, y);
		y += lineHeight;
	}
}

function onClick(event){
      var x = event.x;
      var y = event.y;
      //x -= window.innerWidth;
      //y -= window.innerHeight;
}

function onKeydown(event) {
	var code = event.keyCode || event.which;
	
	if(!contains(window.Core.PressedKeys, code)) {
		window.Core.PressedKeys.push(code);
		console.log("Pressed Key: ", code);
	}
}

function onKeyup(event) {
	var code = event.keyCode || event.which;
	
	if(contains(window.Core.PressedKeys, code)) {
		window.Core.PressedKeys = del(window.Core.PressedKeys, code);
		console.log("Released Key: ", code);
	}
}

var fps = {
	startTime : 0,
	frameNumber : 0,
	getFPS : function(){
		this.frameNumber++;
		var d = new Date().getTime(),
			currentTime = ( d - this.startTime ) / 1000,
			result = Math.floor( ( this.frameNumber / currentTime ) );

		if( currentTime > 1 ){
			this.startTime = new Date().getTime();
			this.frameNumber = 0;
		}
		return result;

	}	
};