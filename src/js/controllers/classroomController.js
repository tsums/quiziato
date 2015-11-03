/**
 * Trevor Summerfield
 * CS 490-001 Fall 2015
 * Quiz Project
 */

var app = angular.module('dashboard');

app.controller('classroomController', ['$scope', '$routeParams', '$controller', '$location', '$uibModal', 'classroomManager' , 'API',
        function($scope, $routeParams, $controller, $location, $uibModal, classroomManager, API) {

    $scope.manager = classroomManager;

    $scope.API = API;

    $scope.show_qr = true;

    $scope.timeInput = 1;

    $scope.toggleQR = function() {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: '/modals/qrModal',
            controller: 'qrModalController',
            resolve: {
                items: function () {
                    return $scope.items;
                }
            }
        });
    };

    $scope.redirectToSession = function() {
        $location.path('/sessions/' + $scope.manager.session._id);
    }

}]);
