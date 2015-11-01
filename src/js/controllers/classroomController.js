/**
 * Trevor Summerfield
 * CS 490-001 Fall 2015
 * Quiz Project
 */

var app = angular.module('dashboard');

app.controller('classroomController', ['$scope', '$routeParams', '$controller', 'classroomManager' , 'API', function($scope, $routeParams, $controller, classroomManager, API) {

    $scope.manager = classroomManager;

    $scope.API = API;

    $scope.show_qr = true;

    $scope.timeInput = 1;

    $scope.toggleQR = function() {
        $scope.show_qr = !$scope.show_qr;
    }

}]);
