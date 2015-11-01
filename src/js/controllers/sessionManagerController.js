/**
 * Trevor Summerfield
 * CS 490-001 Fall 2015
 * Quiz Project
 */

var app = angular.module('dashboard');

app.controller('sessionManagerController', ['$scope', '$filter', '$routeParams', '$location', 'API', function ($scope, $filter, $routeParams, $location, API) {

    if ($routeParams.sid) {
        API.getSession($routeParams.sid, function (data) {
            $scope.sessionDetail = data;
        });
    }

    $scope.API = API;

    $scope.$watch('currentCourse', function (newVal, oldVal) {
        if (newVal) {
            API.getPastSessionsForCourse(newVal._id, function(data) {
                $scope.sessions = data;
            })
        }
    });

    $scope.openSession = function() {
        $location.path('/sessions/' + $scope.currentSession._id);
    };

    $scope.getLabel = function(session) {
        return $filter('date')(session.date, "MM/dd h:mm a") + " : " + session.instructor.name.full;
    };

    $scope.getFullLabel = function(session) {
        return session.course.title + " : " + $filter('date')(session.date, "MM/dd h:mm a") + " : " + session.instructor.name.full;
    }

}]);
