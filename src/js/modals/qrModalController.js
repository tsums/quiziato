/**
 * Trevor Summerfield
 * CS 490-001 Fall 2015
 * Quiz Project
 */

var app = angular.module('dashboard');

app.controller('qrModalController', ['$scope', '$uibModalInstance', 'classroomManager', function ($scope, $uibModalInstance, classroomManager) {

    $scope.manager = classroomManager;

    $scope.close = function() {
        $uibModalInstance.close();
    };

}]);
