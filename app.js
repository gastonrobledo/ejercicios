/**
 * Created by federpc on 10/03/17.
 */
angular.module('toDoApp', ['ui.router','ui.bootstrap','ngAnimate', 'toDoApp.services', 'toDoApp.controllers','auth.services'])

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

        var login={
            name:'auth',
            url:'/login',
            templateUrl:'login.html',
            controller: 'loginControl'
        };

        $urlRouterProvider.otherwise('/login');
        $stateProvider.state(home);
        $stateProvider.state(addTask);
        $stateProvider.state(editTask);
        $stateProvider.state(login);
    })
    .filter('startFrom',function(){
        return function(input,start){
            start = +start;
            return input.slice(start);
        };
    })
