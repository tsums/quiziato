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

        console.log('Client connected to namespace \'/classroom\'');

        socket.emit('news', { hello: 'world' });

        socket.on('attendance', function(data) {
           socket.join(data);
           classroom.to(data).emit('question', "What is the square root of 4?");
           console.log('socket joining inClass');
        });

        socket.on('data_test', function(data) {
            console.log(data.toString());
        });




    });

    return io;
};
