/**
 * Trevor Summerfield
 * CS 490-001 Fall 2015
 * Quiz Project
 */

var app = angular.module('dashboard');

app.controller('courseManagerController', ['$scope', '$routeParams', 'API', function($scope, $routeParams, API) {

    $scope.API = API;

    $scope.new_course = {};

}]);
