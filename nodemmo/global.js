var Global = function() {
	this.lib = {
		Express: require('express'),
		HTTP: require('http'),
		FileSystem: require('fs'),
		SocketIO: require('socket.io'),
		Moment: require('moment')
	};

	this.App = {};
	this.HTTPServer = {};
	this.Server = {};

	this.Setup = false;
};

Global.prototype = {
	write: function(message) {
		console.log("Server:", message);
	},
	writeLine: function(message) {
		console.log("[" + this.lib.Moment().format('h:mm:ss') + "]:", "Server:", message);
	},
	setupServer: function(folder, port) {
		this.App = new this.lib.Express()
		this.App.use(this.lib.Express.static(folder));

		this.HTTPServer = this.lib.HTTP.createServer(this.App).listen(port);
		this.writeLine("HTTP Server Started.");
		this.Server = this.lib.SocketIO(this.HTTPServer);
		this.writeLine("Socket Server Started.");

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