//constants
var http_IP = '127.0.0.1',
    http_port = 8090;

//import
var express = require('express'),
    errorHandler = require('errorhandler'),
    http = require('http'),
    path = require("path"),
    socket_io = require('socket.io');

//init
var app = module.exports = express(),
    server = http.createServer(app),
    io = socket_io(server);

app.set('port', http_port);
app.use(express.static(path.join(__dirname, 'public')));
app.use(errorHandler());

// routing
app.get('/', function(req, res){res.sendFile(path.join(__dirname, 'public', 'index.html'))});

// io
io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
    socket.on('chat message', function (msg) {
        console.log('message: ' + msg);
        io.emit('chat message', msg);
    });
});

//start server
server.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
