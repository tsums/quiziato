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

            $scope.assignment = $scope.session.assignments.filter(function(assignment) {
                return assignment._id == $routeParams.aid;
            });

            if ($scope.assignment.length > 0) {
                $scope.assignment = $scope.assignment[0];
            }
        });
    }

    $scope.API = API;

    $scope.getLabel = function(session) {
        return $filter('date')(session.date, "MM/dd h:mm a") + " : " + session.instructor.name.full;
    };

    $scope.getFullLabel = function(session) {
        return session.course.title + " : " + $filter('date')(session.date, "MM/dd h:mm a") + " : " + session.instructor.name.full;
    }

}]);
