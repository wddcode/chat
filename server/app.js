var http = require('http');
var express = require("express");
var app = express();
var server = http.createServer(app)

var io = require('socket.io').listen(server);


// app setup
app.use(require('less-middleware')({ src: __dirname + '/static' }));
app.use(express.static(__dirname + '/static'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);

// start server
server.listen(8081);


// routing (just the index a.t.m.)
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

// connected users
var usernames = {};
// store messages for users joining later on
var messages = [];


io.sockets.on('connection', function (socket) {

	console.log('connection');
	
	socket.on('adduser', function(username){
		socket.username = username;
		usernames[username] = username;
		
		socket.emit('updatechat', 'SERVER', 'you have connected');
		socket.broadcast.emit('updatechat', 'SERVER', username + ' has connected');
		
		io.sockets.emit('updateusers', usernames);
		
	});
	
	socket.on('sendchat', function (data) {
		io.sockets.emit('updatechat', socket.username, data);
	});
	
	/* */
	socket.on('disconnect', function(){
		delete usernames[socket.username];
		io.sockets.emit('updateusers', usernames);
		socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
	});
	
	
	
});