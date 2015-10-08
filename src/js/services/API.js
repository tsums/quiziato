/**
 * Trevor Summerfield
 * CS 490-001 Fall 2015
 * Quiz Project
 */


var app = angular.module('dashboard');

app.factory('API', ['$http', function($http) {
    var API = {};

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

    API.getSessions = function() {
        $http.get('/web/api/session/active').then(function(response) {
            API.sessions = response.data;
        }, function(error) {
            console.log(error);
        });
    };

    API.endSession = function(id) {
        $http.post('/web/api/session/' + id + '/end', null).then(function(response) {
            API.getSessions();
        }, function (error) {
            console.log(error);
        })
    };

    API.postQuestion = function(question) {
        $http.post('/web/api/question', question).then(function (response) {
            console.log(response);
        }, function (error) {
            console.log(error);
        })
    };

    API.getCourses();
    API.getSessions();

    return API;

}]);
