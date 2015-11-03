/**
 * Trevor Summerfield
 * CS 490-001 Fall 2015
 * Quiz Project
 */

/*
    Classroom Manager Service. Keeps control of socket connections.
 */

var app = angular.module('dashboard');

app.factory('classroomManager', ['dashSocket', 'API', '$timeout', '$interval', function(dashSocket, API, $timeout, $interval) {

    var manager = {};

    // when we get a new students lis  t, replace it.
    dashSocket.on('students', function(data) {
        manager.attendanceRecords = data;
    });

    // Temporary Logger for Random Data.
    dashSocket.on('testEvent', function(data) {
        console.log(data);
    });

    dashSocket.on('currentAssignment', function(data) {
        manager.assignment = data;

        var due = moment(manager.assignment.dueAt);
        manager.assignment.remaining = due.diff(moment(), 'seconds');

        manager.assignment.counter = $interval(function () {
            manager.assignment.remaining = due.diff(moment(), 'seconds');
        }, 1000, manager.assignment.remaining);

        manager.assignment.timeout = $timeout(function() {
            $interval.cancel(manager.assignment.counter);
            manager.assignment = null;
        }, manager.assignment.remaining * 1000);

    });

    manager.reset = function() {
        manager.attendanceRecords = [];
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
            API.getActiveSessions();
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

    manager.assignQuestion = function(question, time) {
        console.log(time);
        dashSocket.emit('assignQuestion', {question: question._id, time: time}, function(data) {
            manager.assignment = data;
            manager.assignment.question = question;

            var due = moment(manager.assignment.dueAt);
            manager.assignment.remaining = due.diff(moment(), 'seconds');

            manager.assignment.counter = $interval(function () {
                manager.assignment.remaining = due.diff(moment(), 'seconds');
            }, 1000, manager.assignment.remaining);

            manager.assignment.timeout = $timeout(function() {
                $interval.cancel(manager.assignment.counter);
                manager.assignment = null;
            }, manager.assignment.remaining * 1000);

        });
    };

    manager.endQuestion = function() {
        dashSocket.emit('endAssignment', manager.assignment._id, function() {
            $interval.cancel(manager.assignment.counter);
            manager.assignment = null;
        })
    };

    manager.reset();

    return manager;
}]);
