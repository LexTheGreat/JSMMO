var Player = function() {
  this.Username = ''; // Username for login, sent as ign
  this.Password = '';
  this.Sprite = "dragon";
  this.Access = 0;
  this.Vittles = { health: 100, mana: 100}; // Health | Energy
  this.Map = "Spawn";
  this.Position = { x: 100, y: 100, dir: 3, ani: 0 };
  this.isLoged = false; // Has loged in

  this.end = false;
  this.movY = 0;
  this.movX = 0;
  this.movDir = -1;

  // Animation Variables
  this.nextAniT = 5;
  this.AniT = 0;

  this.Socket = "";
};

Player.prototype = {
	isMod: function() {
		if(this.Access >= 1) return true;
	},
	isAdmin: function() {
		if(this.Access >= 2) return true;
	},
	getHtmlName: function() {
		var Sty = "color: #000000;";
		if(this.isMod()) { Sty = "color: #33CC33;font-weight:bold;"; }
		if(this.isAdmin()) { Sty = "color: #FF3300;font-weight:bold;"; }
		return '<name style="' + Sty + '">' + this.Username + '</name>'
	},
	nextAni: function() {
		if(this.AniT != this.nextAniT) {
			this.AniT += 1;
		} else {
			this.AniT = 0;
			if(this.Position.ani+1 > 3) {
				this.Position.ani = 0;
			} else {
				this.Position.ani += 1;
			}
		}
	},
	endAni: function() {
		this.Position.ani = 0;
	},
	chgDir: function(dir) {
		if(this.Position.dir != dir) {
			this.Position.dir = dir;
			this.AniT = 0;
			this.Position.ani = 0;
		}
	},
	moveX: function(amount) {
		this.Position.x += amount;
	},
	moveY: function(amount) {
		this.Position.y += amount;
	}
}

// Return Player
module.exports = Player;