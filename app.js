/**
 * Created by federpc on 10/03/17.
 */
angular.module('toDoApp', ['ui.router','ui.bootstrap','ngAnimate', 'toDoApp.services', 'toDoApp.controllers'])

    .config(function ($stateProvider,$urlRouterProvider) {
        var home = {
            name: 'home',
            url: '/',
            templateUrl: 'home.html',
            controller: 'taskListControl'
        };

        var addTask = {
            name: 'addTask',
            url: '/add',
            templateUrl: 'newTask.html',
            controller: 'addTaskControl'
        };

        var editTask={
            name: 'editTask',
            url:'/edit/:id',
            templateUrl: 'newTask.html',
            controller:'addTaskControl'
        };
        $urlRouterProvider.otherwise('/');
        $stateProvider.state(home);
        $stateProvider.state(addTask);
        $stateProvider.state(editTask);
    })
    .filter('startFrom',function(){
        return function(input,start){
            start = +start;
            return input.slice(start);
        };
    });