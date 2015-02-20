var ConsoleLib = require("../consolelib");
var NConsole = new ConsoleLib();

var Global = function() {
	this.lib = {
		Express: require('express'),
		HTTP: require('http'),
		SocketIO: require('socket.io'),
		Moment: require('moment')
	};

	this.App = {};
	this.HTTPServer = {};
	this.Server = {};

	this.Setup = false;
};

Global.prototype = {
	setupServer: function(folder, port) {
		this.App = new this.lib.Express()
		this.App.use(this.lib.Express.static(folder));

		this.HTTPServer = this.lib.HTTP.createServer(this.App).listen(port);
		NConsole.writeLine("HTTP Server Started.");
		this.Server = this.lib.SocketIO(this.HTTPServer);
		NConsole.writeLine("Socket Server Started.");

		this.Setup = true;
	},
	getApp: function() {
		return thos.App;
	},
	getHTTPServer: function() {
		return this.HTTPServer;
	},
	getServer: function() {
		return this.Server;
	}
}

module.exports = Global;