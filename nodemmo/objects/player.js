var Player = function() {
  this.Username = ''; // Username for login, sent as ign
  this.Sprite = "dragon";
  this.Vittles = { health: 100, mana: 100}; // Health | Energy
  this.Nourishment = { food: 100, water: 100}; // Food | Water
  this.Map = "Spawn";
  this.Position = { x: 100, y: 100, dir: 3, ani: 0 };
  this.isLoged = false; // Has loged in

  // Animation Variables
  this.nextAniT = 5;
  this.AniT = 0;
};

Player.prototype = {
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