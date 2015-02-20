var ConsoleLib = require("../consolelib");
var Player = require('./objects/player');
var NConsole = new ConsoleLib();
var sqlite3 = require("sqlite3").verbose();
var FileSystem = require("fs");
var db = "";

var Database = function() {
	
};

Database.prototype = {
	open: function(file) {
		var status = "";
		var exists = FileSystem.existsSync(file);

		if(!exists) {
			NConsole.writeLine("Creating Database...");
			FileSystem.openSync(file, "w");
		} else {
			NConsole.writeLine("Opening Database...");
		}

		db = new sqlite3.Database(file);

		db.serialize(function() {
			if(!exists) {
				NConsole.writeLine("Creating table...");
				db.run("CREATE TABLE Players (Username TEXT, Password TEXT, Sprite TEXT, Map TEXT, Health INT, Mana INT, x INT, y INT, dir INT)");
			}
		});
	},
	close: function() {
		if(typeof db != "string") {
			NConsole.writeLine("Closed Database.");
			db.close();
			db = "";
		}
	},
	// Players
	loginCorrect: function(Username, Password) {
		var userLoginCorrect = false;

		if(typeof db != "string") {
			db.serialize(function() {
				db.each("SELECT * FROM Players", function(err, row) {
					if(row.Username == Username && row.Password == Password) {
						userLoginCorrect = true
					}
				});
			});
		}
		return userLoginCorrect;
	},
	// Returns False! Fix something else
	isNew: function(Username, callback) {
		if(typeof db != "string") {
			db.serialize(function() {
				var foundUser = false;

				db.each("SELECT * FROM Players", function(err, row) {
					if(row.Username == Username && !foundUser) {
						foundUser = true;
						return;
					}
				});
				callback(foundUser);
			});
		}
	},
	loadPlayer: function(Username, Password, callback) {
		if(typeof db != "string") {
			db.serialize(function() {
				var player = new Player();
				db.each("SELECT * FROM Players", function(err, row) {
					if(row.Username == Username && row.Password == Password) {
						player.isLoged = true;
						player.Username = row.Username;
						player.Password = row.Password;
						player.Sprite = row.Sprite;
						player.Map = row.Map;
						player.Vittles.health = row.Health;
						player.Vittles.mana = row.Mana;
						player.Position.x = row.x;
						player.Position.y = row.y;
						player.Position.dir = row.dir;
					}
				});

				callback(player)
			});
		}
	},
	savePlayer: function(player) {
		var self = this;
		this.isNew(player.Username, function(userIsNew) {
			if(userIsNew) {
				self.newPlayer(player);
			} else {
				db.serialize(function() {
					db.run("UPDATE Players SET Sprite = '" + player.Sprite + "', Map = '" + player.Map + "', Health = " + player.Vittles.health + ", Mana = " + player.Vittles.mana + ", x = " + player.Position.x + ", y = " + player.Position.y + ", dir = " + player.Position.dir + " WHERE Username = '" + player.Username + "'");
				});
			}
		});
	},
	newPlayer: function(player) {
		db.serialize(function() {
			db.run("INSERT INTO Players (Username, Password, Sprite, Map, Health, Mana, x, y, dir) VALUES ('" + player.Username + "', '" + player.Password + "', '" + player.Sprite + "', '" + player.Map + "', " + player.Vittles.health + ", " + player.Vittles.mana + ", " + player.Position.x + ", " + player.Position.y + ", " + player.Position.dir + ")");
		});
	}
}

module.exports = Database;