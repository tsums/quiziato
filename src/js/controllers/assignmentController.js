/**
 * Trevor Summerfield
 * CS 490-001 Fall 2015
 * Quiz Project
 */

var app = angular.module('dashboard');

app.controller('assignmentController', ['$scope', '$filter', '$routeParams', '$location', 'API', function ($scope, $filter, $routeParams, $location, API) {

    if ($routeParams.sid) {
        API.getSession($routeParams.sid, function (data) {
            $scope.session = data;
        });
    }

    if ($routeParams.aid) {
        API.getAssignment($routeParams.aid).then(function (response) {
            $scope.assignment = response.data;
        }, function(error) {
            console.log(error);
        })
    }

    $scope.API = API;

    $scope.returntoSession = function() {
        window.history.back()
    };

    $scope.getLabel = function(session) {
        return $filter('date')(session.date, "MM/dd h:mm a") + " : " + session.instructor.name.full;
    };

    $scope.getFullLabel = function(session) {
        return session.course.title + " : " + $filter('date')(session.date, "MM/dd h:mm a") + " : " + session.instructor.name.full;
    }

}]);
