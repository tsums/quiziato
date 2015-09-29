/**
 * Trevor Summerfield
 * CS 490-001 Fall 2015
 * Quiz Project
 */
var app = angular.module('dashboard', ['btford.socket-io']);


app.factory('dashSocket', function(socketFactory) {
    var socket = io.connect(window.location.origin + '/dashboard');
    return socketFactory({
        ioSocket: socket
    });
});

app.controller('dashboardController', function(dashSocket) {

    dashSocket.on('news', function (data) {
        console.log(data);
        socket.emit('click', { my: 'data' });
    });
    dashSocket.on('question', function(data) {
        console.log(data);
    });
    dashSocket.on('cat', function(data) {
        console.log(data);
    });
});



