/**
 * Trevor Summerfield
 * CS 490-001 Fall 2015
 * Quiz Project
 */

var app = angular.module('dashboard');

app.controller('questionManagerController', ['$scope', '$routeParams', 'API', function($scope, $routeParams, API) {

    $scope.API = API;

    $scope.$watch('currentCourse', function(newVal, oldVal) {
        $scope.new_question = {};
        $scope.new_question.options = [{}];
    });

    $scope.addOption = function() {
        $scope.new_question.options.push({text: ""});
    };

    $scope.postQuestion = function() {

    }
}]);
