/**
 * Trevor Summerfield
 * CS 490-001 Fall 2015
 * Quiz Project
 */


var app = angular.module('dashboard');

app.factory('socket', function() {
    var socket = io.connect(window.location.origin + '/dashboard');
    return socket;
});

// Dashboard Socket Factory
app.factory('dashSocket', ['socketFactory', 'socket', function(socketFactory, socket) {
    var ngSocket =  socketFactory({
        ioSocket: socket
    });

    // events can be forwarded to scope here.

    return ngSocket;
}]);
