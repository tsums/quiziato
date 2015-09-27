/**
 * Trevor Summerfield
 * CS 490-001 Fall 2015
 * Quiz Project
 */

/*
 * Socket.io Configuration
 */
var socketio = require('socket.io');
var winston = require('winston').loggers.get('socket');

var listen = function(server) {

    var io = socketio.listen(server);

    var classroom = io.of('/classroom');

    classroom.on('connection', function (socket) {

        winston.info('Client connected to namespace \'/classroom\'');

        socket.emit('news', { hello: 'world' });

        socket.on('attendance', function(data) {
           socket.join(data);
           classroom.to(data).emit('question', "What is the square root of 4?");
           winston.info('socket joining inClass');
        });

        socket.on('data_test', function(data) {
            winston.info(data.toString());
        });

    });

    return io;
};

module.exports.listen = listen;
