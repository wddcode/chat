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


