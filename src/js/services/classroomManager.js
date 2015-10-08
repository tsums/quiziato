/**
 * Trevor Summerfield
 * CS 490-001 Fall 2015
 * Quiz Project
 */


var app = angular.module('dashboard');

app.factory('classroomManager', ['dashSocket', function(dashSocket) {

    var manager = {};

    manager.students = [];
    manager.inSession = false;

    // Add student to list when they join the room
    dashSocket.on('studentJoined', function(data) {
        manager.students.push(data);
        console.log("studentJoined: " + data)
    });

    // remove student from list when they leave the room.
    dashSocket.on('studentLeft', function(data) {
        var i = manager.students.indexOf(data);
        console.log("studentLeft: " + data);
        if (i > -1) {
            manager.students.splice(i, 1);
        }
    });

    // when we get a new students lisrt, replace it.
    dashSocket.on('students', function(data) {
        manager.students = data;
    });

    // Temporary Logger for Random Data.
    dashSocket.on('testEvent', function(data) {
        console.log(data);
    });

    // create a class session.
    manager.startSession = function(course) {
        dashSocket.emit('startSession', {
            course: course._id
        }, function(data) {
            console.log(data);
            data.course = course;
            manager.inSession = true;
            manager.session = data;
        });
    };

    manager.resumeSession = function(session) {
        dashSocket.emit('resumeSession', {
            id: session._id
        }, function(data) {
            manager.session = data;
            manager.inSession = true;
        });
    };

    return manager;
}]);
