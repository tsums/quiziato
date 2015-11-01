/**
 * Trevor Summerfield
 * CS 490-001 Fall 2015
 * Quiz Project
 */

/*
    Angular API Connector Service
 */

var app = angular.module('dashboard');

app.factory('API', ['$http', function($http) {
    var API = {};

    API.courses = [];
    API.sessions = [];

    API.getCourses = function() {
        $http.get('/web/api/course/my').then(function(response) {
            API.courses = response.data;
        }, function(error) {
            console.log(error);
        });
    };

    API.postCourse = function(title) {
        $http.post('/web/api/course', {
            title: title
        }).then(function(response) {
            API.getCourses();
        }, function(error) {
            console.log(error);
        });
    };

    API.getActiveSessions = function() {
        $http.get('/web/api/session/active').then(function(response) {
            API.sessions = response.data;
        }, function(error) {
            console.log(error);
        });
    };

    API.getPastSessionsForCourse = function(courseId, callback) {
        $http.get('/web/api/session/ended/course/' + courseId).then(function(response) {
            callback(response.data);
        }, function(error) {
            console.log(error);
        });
    };

    API.getSession = function (sessionId, callback) {
        $http.get('/web/api/session/' + sessionId).then(function(response) {
            callback(response.data);
        }, function(error) {
            console.log(error);
        });
    };

    API.endSession = function(id) {
        $http.post('/web/api/session/' + id + '/end', null).then(function(response) {
            API.getActiveSessions();
        }, function (error) {
            console.log(error);
        })
    };

    API.getQuestionsForCourse = function (courseId, callback) {
        $http.get('/web/api/question', {
            params: {
                course: courseId
            }
        }).then(function(response) {
            callback(response.data)
        }, function (error) {
            console.log(error);
        })
    };

    API.postQuestion = function(question) {
        return $http.post('/web/api/question', question);
    };

    API.getAssignment = function(assignmentId) {
        return $http.get('/web/api/assignment/' + assignmentId);
    };

    API.getCourses();
    API.getActiveSessions();

    return API;

}]);
