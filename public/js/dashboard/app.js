/**
 * Trevor Summerfield
 * CS 490-001 Fall 2015
 * Quiz Project
 */

/*
 *  Dashboard Angular App
 */

var app = angular.module('dashboard', ['btford.socket-io', 'ngRoute']);

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
        .otherwise({redirectTo: '/'});

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: true
    });
}]);

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

    $scope.$on('socket:testEvent', function(event, data) {
        console.log(data);
    });

});

app.controller('classroomController', function($scope, $routeParams) {
    $scope.foo = 'classroom-foo';
});

app.controller('questionManagerController', function($scope, $routeParams) {
    $scope.foo = 'questionManager-foo';
});



