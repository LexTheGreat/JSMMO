window.GameEngine = function() {
	this.Canvas = document.getElementById('gameCanvas'); this.Canvas.width = window.innerWidth; this.Canvas.height = window.innerHeight;

	this.Canvas.addEventListener("keydown", onKeyDown, false);
	this.Canvas.addEventListener("keyup", onKeyUp, false);

	this.NetVar = {
		myIndex: "",
		isOnline: false,
		Players: {} // Needs something in there..
	};

	this.GUI = {
		parent: this,
		hide: function(obj) {
			$("#" + obj).hide();
		},
		show: function(obj) {
			$("#" + obj).show();
		},
		toggle: function(obj) {
			$("#" + obj).toggle();
		}
	};

	this.Movement = {
		parent: this,
		dir: 4,
		Process: function() {
			if(window.PressedKeys.length > 1) {
				switch(window.PressedKeys[1]) {
					case 83:
						this.dir = 0;
						break;
					case 65:
						this.dir = 1;
						break;
					case 68:
						this.dir = 2;
						break;
					case 87:
					 	this.dir = 3;
						break;
				}
			}
			if(this.dir < 4) { 
				Socket.emit("onMovement", this.dir);
			}
		},
	};

	this.Render = {
		parent: this,
		ctx: this.Canvas.getContext('2d'),
		fps: 0,
		draw: function() {
			this.parent.Canvas.width = window.innerWidth;
            this.parent.Canvas.height = window.innerHeight;
			this.ctx.clearRect(0, 0, this.parent.Canvas.width, this.parent.Canvas.height);
			this.ctx.save();
			// Start Draw objects here
			this.parent.DrawnObject.drawPlayers(this.ctx)
			this.parent.DrawnObject.drawFPS(this.ctx, this.fps);
			// End Draw Objects Here
			this.ctx.restore();
			this.fps = this.parent.FPS.getFPS();
		}
	};

	// this.Text = this.RenderObjects.textObject()
	this.DrawnObject = {
		parent: this,
		// Text
		drawText: function(ctx, text, x, y, color) {
			color = typeof color !== 'undefined' ? color : "black";
			ctx.fillStyle = color;
			ctx.font = "16px serif";
			ctx.fillText(text, x, y);
		},
		drawLargeText: function(ctx, text, x, y) {
			ctx.fillStyle = "#FFFFFF";
			ctx.font = "25px 'BIMINI'";
			ctx.fillText(text, x, y);
		},
		drawChatText: function(ctx, text, x, y) {
			ctx.fillStyle = "#FFFFFF";
			ctx.font = "15px 'BIMINI'";
			ctx.fillText(text, x, y);
		},
		drawNameText: function(ctx, text, color, x, y) {
			ctx.fillStyle = color;
			ctx.font = "15px 'BIMINI'";
			ctx.textAlign = "center";
			ctx.fillText(text, x, y);
		},
		// Objects
		drawFPS: function(ctx, fps) {
			var color = "green";
			if(fps < 20) { 
				color = "yellow";
			} else if(fps < 10) {
				color = "red";
			}
  			this.drawText(ctx, "FPS: " + fps, 30, 15, color);
		},
		drawSprite : function(ctx, sprite, x, y, d, f) {
			// Sprite Size = 96
			// Todo auto sprite size
			var h = 96;
			var w = 96;

			var frameY = d*h;
			var frameX = f*w;
			var posX = x;
			var posY = y - h;

			ctx.drawImage(Cache.getImage("img/sprite/" + sprite + ".png"), frameX, frameY, w, h, posX, posY, w, h);
		},
		drawPlayers: function(ctx) {
			for(var obj in this.parent.NetVar.Players) {
				var player = this.parent.NetVar.Players[obj];
				this.drawNameText(ctx, player.Username, "#000", player.Position.x+(96/2), player.Position.y-100);
				this.drawSprite(ctx, player.Sprite, player.Position.x, player.Position.y, player.Position.dir, player.Position.ani)
			}
		}
	}

	this.GameLoop = {
		parent: this,
		didsendReset: false,
		update: function() {
			var self = this;
			
			setTimeout(function() {
	        	requestAnimationFrame(function() {self.update()})
				

				if(isMoving) {
					Network.sendMovement(Dir);
					this.didsendReset = false;
				} else if(!this.didsendReset) {
					Network.sendReset();
					this.didsendReset = true
				}
				
	 			self.parent.Render.draw();
    		}, 1000/60);
			//setInterval(function() {
				
    		//}, 500);
		}
	};

	this.FPS = {
		parent: this,
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

	this.Network = {
		parent: this,
		onConnect: function(id) {
			this.parent.NetVar.myIndex = id;
		},
		onLogin: function() {
			this.parent.NetVar.isOnline = true;
			this.parent.GUI.hide("loginGUI");
			this.parent.GUI.show("gameGUI");

			this.parent.GameLoop.update(); // -> Start Game Loop & Drawing
		}
	}
};

GameEngine.prototype = {
	
};


function contains(array, obj) {
    if(jQuery.inArray(obj, array) > 0) return true
    return false;
}

function del(array, obj) {
	return jQuery.grep(array, function(value) { return value != obj; })
}

var Dir = -1;
var isMoving = false;
function onKeyDown(event) {
	var self = this;
	var code = event.keyCode || event.which;

	console.log("Pressed Key: ", code);


	switch(code) {
		case 83:
			if(Dir == -1) Dir = 0;
			break;
		case 68:
			if(Dir == -1) Dir = 2;
			break;
		case 87:
		 	if(Dir == -1) Dir = 3;
			break;
		case 65:
			if(Dir == -1) Dir = 1;
			break;
	}

	if(code == 83 || code == 68 || code == 87 || code == 65) {
		isMoving = true
	}
}

function onKeyUp(event) {
	var self = this;
	var code = event.keyCode || event.which;

	console.log("Released Key: ", code);

	// Movement Keys
	if(code == 83 || code == 68 || code == 87 || code == 65) {
		Dir = -1;
		isMoving = false
	}
}

/*function wrapText(context, text, x, y, maxWidth, lineHeight) {
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
}*/