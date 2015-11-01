/**
 * Trevor Summerfield
 * CS 490-001 Fall 2015
 * Quiz Project
 */

/*
 *  Dashboard Angular App
 */

var app = angular.module('dashboard', ['btford.socket-io', 'ngRoute', 'monospaced.qrcode', 'ui.bootstrap']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '/partials/main'
        })
        .when('/classroom', {
            templateUrl: '/partials/classroom',
            controller: 'classroomController'
        })
        .when('/questions', {
            templateUrl: '/partials/questionManager',
            controller: 'questionManagerController'
        })
        .when('/courses', {
            templateUrl: '/partials/courseManager',
            controller: 'courseManagerController'
        })
        .when('/sessions', {
            templateUrl: '/partials/sessionManager',
            controller: 'sessionManagerController'
        })
        .when('/sessions/:sid', {
            templateUrl: '/partials/sessionManager',
            controller: 'sessionManagerController'
        })
        .when('/sessions/:sid/assignment/:aid', {
            templateUrl: '/partials/assignmentManager',
            controller: 'assignmentController'
        })
        .otherwise({redirectTo: '/'});

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: true
    });
}]);
