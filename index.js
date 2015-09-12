var http = require("http");
var app = require("express")();
var port = process.env.PORT || 5000;
var server = http.Server(app);
var io = require('socket.io')(server);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    console.log('a user connected');
});

server.listen(port, function(){
    console.log('listening on *:' + port);
});

