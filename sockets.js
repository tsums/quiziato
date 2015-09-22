/**
 * Trevor Summerfield
 * CS 490-001 Fall 2015
 * Quiz Project
 */

var socketio = require('socket.io');

module.exports.listen = function(server){

    var io = socketio.listen(server);

    io.on('connection', function (socket) {
        socket.emit('news', { hello: 'world' });
        socket.on('click', function (data) {
            console.log(data);
        });
    });

    return io;
};
