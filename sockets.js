/**
 * Trevor Summerfield
 * CS 490-001 Fall 2015
 * Quiz Project
 */

var socketio = require('socket.io');

module.exports.listen = function(server){

    var io = socketio.listen(server);

    var classroom = io.of('/classroom');

    classroom.on('connection', function (socket) {
        socket.emit('news', { hello: 'world' });
        socket.on('click', function (data) {
            console.log(data);
        });

        socket.on('attendance', function(data) {
           if (data === true) {
               socket.join('inClass');
               classroom.to('inClass').emit('question', "What is the square root of 4?");
               console.log('socket joining inClass');
           }
        });
    });

    return io;
};
