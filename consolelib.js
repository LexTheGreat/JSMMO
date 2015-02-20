var Moment = require('moment')
var ConsoleLib = function() {
	
};

ConsoleLib.prototype = {
	write: function(message) {
		console.log("Server:", message);
	},
	writeLine: function(message) {
		console.log("[" + Moment().format('h:mm:ss') + "]:", "Server:", message);
	}
}

module.exports = ConsoleLib;