/**
 * Trevor Summerfield
 * CS 490-001 Fall 2015
 * Quiz Project
 */

/*
 *  Dashboard Angular App
 */

var app = angular.module('dashboard', ['btford.socket-io']);

// Dashboard Socket Factory
app.factory('dashSocket', function(socketFactory) {
    var socket = io.connect(window.location.origin + '/dashboard');
    var ngSocket =  socketFactory({
        ioSocket: socket
    });

    // Forward Socket Events to Angular Root Scope Event System
    ngSocket.forward('testEvent');

    return ngSocket;
});

app.controller('dashboardController', function($scope, dashSocket) {
    //
    //dashSocket.on('news', function (data) {
    //    console.log(data);
    //    socket.emit('click', { my: 'data' });
    //});
    //dashSocket.on('question', function(data) {
    //    console.log(data);
    //});
    //dashSocket.on('cat', function(data) {
    //    console.log(data);
    //});

    $scope.$on('socket:testEvent', function(event, data) {
        console.log(data);
    });


});



