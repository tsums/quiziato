/**
 * Trevor Summerfield
 * CS 490-001 Fall 2015
 * Quiz Project
 */

/*
 *  Dashboard Angular App
 */

var app = angular.module('dashboard', ['btford.socket-io', 'ngRoute', 'monospaced.qrcode']);

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
        .otherwise({redirectTo: '/'});

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: true
    });
}]);

app.controller('dashboardController', ['$scope','socket', function($scope, socket) {

    $scope.socket = socket;

    $scope.$on('$routeChangeSuccess', function (event, current, previous) {
        $scope.activeController = current.$$route.controller;
    });

}]);

app.controller('classroomController', ['$scope', '$routeParams', '$controller', 'classroomManager' , 'API', function($scope, $routeParams, $controller, classroomManager, API) {

    $scope.manager = classroomManager;
    $scope.API = API;
    $scope.show_qr = true;

}]);

app.controller('courseManagerController', ['$scope', '$routeParams', 'API', function($scope, $routeParams, API) {

    $scope.API = API;

}]);

app.controller('questionManagerController', ['$scope', '$routeParams', 'API', function($scope, $routeParams, API) {

    $scope.API = API;

}]);



