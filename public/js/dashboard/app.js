/**
 * Trevor Summerfield
 * CS 490-001 Fall 2015
 * Quiz Project
 */

/*
 *  Dashboard Angular App
 */

var app = angular.module('dashboard', ['btford.socket-io', 'ngRoute']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '/partials/main'
        })
        .when('/classroom', {
            templateUrl: '/partials/classroom',
            controller: 'classroomController'
        })
        .when('/questions', {
            templateUrl: '/partials/questionManager',
            controller: 'questionManagerController'
        })
        .when('/courses', {
            templateUrl: '/partials/courseManager',
            controller: 'courseManagerController'
        })
        .otherwise({redirectTo: '/'});

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: true
    });
}]);

// Dashboard Socket Factory
app.factory('dashSocket', ['socketFactory', function(socketFactory) {
    var socket = io.connect(window.location.origin + '/dashboard');
    var ngSocket =  socketFactory({
        ioSocket: socket
    });

    // events can be forwarded to scope here.

    return ngSocket;
}]);

app.factory('classroomManager', ['dashSocket', function(dashSocket) {

    var manager = {};
    manager.students = [];

    // Add student to list when they join the room
    dashSocket.on('studentJoined', function(data) {
        manager.students.push(data);
        console.log("studentJoined: " + data)
    });

    // remove student from list when they leave the room.
    dashSocket.on('studentLeft', function(data) {
        var i = manager.students.indexOf(data);
        console.log("studentLeft: " + data);
        if (i > -1) {
            manager.students.splice(i, 1);
        }
    });

    // when we get a new students lisrt, replace it.
    dashSocket.on('students', function(data) {
        manager.students = data;
    });

    // Temporary Logger for Random Data.
    dashSocket.on('testEvent', function(data) {
        console.log(data);
    });

    // create a class session.
    manager.startSession = function(courseID) {
        dashSocket.emit('startSession', {
            course: courseID
        }, function(data) {
            if (data.success) {
                manager.inSession = true;
            }
        });
    };

    return manager;
}]);

app.factory('API', ['$http', function($http) {
    var API = {};

    API.getCourses = function() {
        $http.get('/web/api/course/my').then(function(response) {
            API.courses = response.data;
        }, function(error) {
            console.log(error);
        });
    };

    API.getSessions = function() {
        $http.get('/web/api/session/active').then(function(response) {
            API.sessions = response.data;
        }, function(error) {
            console.log(error);
        });
    };

    API.postCourse = function(title) {
        $http.post('/web/api/course', {
            title: title
        }).then(function(response) {
            API.getCourses();
        }, function(error) {
            console.log(error);
        });
    };

    API.getCourses();
    API.getSessions();

    return API;
}]);

app.controller('dashboardController', ['$scope', function($scope) {

}]);

app.controller('classroomController', ['$scope', '$routeParams', '$controller', 'classroomManager' , 'API', function($scope, $routeParams, $controller, classroomManager, API) {
    $scope.manager = classroomManager;
    $scope.API = API;
}]);

app.controller('courseManagerController', ['$scope', '$routeParams', 'API', function($scope, $routeParams, API) {

    $scope.API = API;

}]);

app.controller('questionManagerController', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {

}]);



