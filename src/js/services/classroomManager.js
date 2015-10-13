/**
 * Trevor Summerfield
 * CS 490-001 Fall 2015
 * Quiz Project
 */


var app = angular.module('dashboard');

app.factory('classroomManager', ['dashSocket', 'API', '$timeout', '$interval', function(dashSocket, API, $timeout, $interval) {

    var manager = {};

    manager.students = [];
    manager.questions = [];
    manager.inSession = false;
    manager.assignment = null;
    manager.session = null;

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

    manager.reset = function() {
        manager.students = [];
        manager.questions = [];
        manager.inSession = false;
        manager.assignment = null;
        manager.session = null;
    };

    // create a class session.
    manager.startSession = function(course) {
        dashSocket.emit('startSession', {
            course: course._id
        }, function(data) {
            data.course = course;
            manager.inSession = true;
            manager.session = data;
            API.getSessions();
            API.getQuestionsForCourse(course._id, function(questions) {
                manager.questions = questions;
            });
        });
    };

    manager.resumeSession = function(session) {
        dashSocket.emit('resumeSession', {
            id: session._id
        }, function(data) {
            manager.session = data;
            manager.inSession = true;
            API.getQuestionsForCourse(manager.session.course._id, function(questions) {
                manager.questions = questions;
            });
        });
    };

    manager.leaveSession = function() {
        dashSocket.emit('leaveSession');
        manager.reset();
    };

    manager.assignQuestion = function(question) {
        dashSocket.emit('assignQuestion', question._id, function(data) {
            manager.assignment = data;
            manager.assignment.question = question;

            var due = moment(manager.assignment.dueAt);
            manager.assignment.remaining = due.diff(moment(), 'seconds');
            console.log(typeof(manager.assignment.remaining));

            var counter = $interval(function () {
                manager.assignment.remaining = due.diff(moment(), 'seconds');
            }, 1000, manager.assignment.remaining);

            $timeout(function() {
                console.log("ended");
                $interval.cancel(counter);
                manager.assignment = null;
            }, manager.assignment.remaining * 1000);


        });
    };

    return manager;
}]);
