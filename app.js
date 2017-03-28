/**
 * Created by federpc on 10/03/17.
 */
angular.module('toDoApp', ['ui.router', 'ui.bootstrap', 'ngAnimate', 'toDoApp.services', 'toDoApp.controllers', 'auth.services', 'ngMessages'])

    .config(function ($stateProvider, $urlRouterProvider) {
        var home = {
            name: 'home',
            url: '/',
            templateUrl: 'home.html',
            controller: 'taskListControl'
        };

        var add = {
            name: 'add',
            url: '/add',
            templateUrl: 'newTask.html',
            controller: 'addTaskController'
        };

        var edit = {
            name: 'edit',
            url: '/edit/:id',
            templateUrl: 'newTask.html',
            controller: 'addTaskController'
        };

        var login = {
            name: 'login',
            url: '/login',
            templateUrl: 'login.html',
            controller: 'loginController'
        };

        var registration = {
            name: 'registration',
            url: '/registration',
            templateUrl: 'registration.html',
            controller: 'registrationController'
        };

        $urlRouterProvider.otherwise('/login');
        $stateProvider.state(home);
        $stateProvider.state(add);
        $stateProvider.state(edit);
        $stateProvider.state(login);
        $stateProvider.state(registration);
    })
    .filter('startFrom', function () {
        return function (input, start) {
            start = +start;
            return input.slice(start);
        };
    })
    .directive('compareTo', function () {
        return {
            restrict: 'A',
            require: '?ngModel',
            link: function (scope, elem, attrs, ngModel) {
                ngModel.$parsers.unshift(validate);//Adds validate() to the beginning of the $parsers array

                scope.$watch(attrs.compareTo, function () { // Force-trigger the parsing pipeline.
                    validate(ngModel.$viewValue);
                });
                function validate(value) {
                    var isValid = scope.$eval(attrs.compareTo) == value; //attrs.compareTo = user.password

                    ngModel.$setValidity('compareTo', isValid);

                    return isValid ? value : undefined;
                }
            }
        };
    });



