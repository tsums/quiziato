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
        if (newVal) {
            $scope.fetchCurrentQuestions(newVal._id);
        }
    });

    $scope.fetchCurrentQuestions = function(courseId) {
        API.getQuestionsForCourse(courseId, function(data) {
            $scope.questions = data;
        });
    };

    $scope.addOption = function() {
        $scope.new_question.options.push({text: ""});
    };

    $scope.postQuestion = function() {
        $scope.new_question.course = $scope.currentCourse._id;
        API.postQuestion($scope.new_question).then(function(response) {
            $scope.fetchCurrentQuestions($scope.currentCourse._id);
            $scope.new_question = {};
            $scope.new_question.options = [{}];
        }, function(error) {
            console.log(error);
        })
    };

    $scope.deleteQuestion = function(questionId) {
        API.deleteQuestion(questionId).then(function (response) {
            $scope.fetchCurrentQuestions($scope.currentCourse._id);
            $scope.currentQuestion = null;
        }, function(error) {
            console.log(error);
        })
    }
}]);
