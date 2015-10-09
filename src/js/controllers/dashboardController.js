/**
 * Trevor Summerfield
 * CS 490-001 Fall 2015
 * Quiz Project
 */

var app = angular.module('dashboard');

app.controller('dashboardController', ['$scope','socket', function($scope, socket) {

    $scope.socket = socket;

    $scope.$on('$routeChangeSuccess', function (event, current, previous) {
        $scope.activeController = current.$$route.controller;
    });

}]);
