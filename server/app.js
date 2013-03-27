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

	socket.on('sendchat', function (data) {
		messages.push({username: socket.username, data: data});
		io.sockets.emit('updatechat', socket.username, data);
	});

	// when the client emits 'adduser', this listens and executes
	socket.on('adduser', function(username){
		// we store the username in the socket session for this client
		socket.username = username;
		// add the client's username to the global list
		usernames[username] = username;
		// echo to client they've connected
		socket.emit('updatechat', 'SERVER', 'you have connected');
		// send old messages
		for(i in messages) {
			socket.emit('updatechat', messages[i].username, messages[i].data);
		}
		// echo globally (all clients) that a person has connected
		socket.broadcast.emit('updatechat', 'SERVER', username + ' has connected');
		// update the list of users in chat, client-side
		io.sockets.emit('updateusers', usernames);
	});

	// when the user disconnects.. perform this
	socket.on('disconnect', function(){
		// remove the username from global usernames list
		delete usernames[socket.username];
		// update list of users in chat, client-side
		io.sockets.emit('updateusers', usernames);
		// echo globally that this client has left
		socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
	});
});