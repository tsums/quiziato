/**
 * Trevor Summerfield
 * CS 490-001 Fall 2015
 * Quiz Project
 */

var app = angular.module('dashboard');

app.controller('sessionManagerController', ['$scope', '$filter', 'API', function ($scope, $filter, API) {

    $scope.API = API;

    $scope.$watch('currentCourse', function (newVal, oldVal) {
        if (newVal) {
            API.getPastSessionsForCourse(newVal._id, function(data) {
                $scope.sessions = data;
            })
        }
    });

    $scope.$watch('currentSession', function (newVal, oldVal) {
        if (newVal) {
            console.log("Current Session Changed: " + newVal._id);
            API.getSession(newVal._id, function(data) {
                $scope.sessionDetail = data;
                console.log(data);
            })
        }
    });

    $scope.getLabel = function(session) {
        return $filter('date')(session.date, "MM/dd h:mm a") + " : " + session.instructor.name.full;
    }

}]);
