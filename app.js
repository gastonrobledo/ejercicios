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

        var add ={
            name: 'add',
            url: '/add',
            templateUrl: 'newTask.html',
            controller: 'addTaskControl'
        };

        var edit={
            name: 'edit',
            url:'/edit/:id',
            templateUrl: 'newTask.html',
            controller:'addTaskControl'
        };

        var login={
            name:'login',
            url:'/login',
            templateUrl:'login.html',
            controller: 'loginControl'
        };

        var registration={
            name :'registration',
            url: '/registration',
            templateUrl:'registration.html',
            controller:'registrationControl'
        };

        $urlRouterProvider.otherwise('/login');
        $stateProvider.state(home);
        $stateProvider.state(add);
        $stateProvider.state(edit);
        $stateProvider.state(login);
        $stateProvider.state(registration);
    })
    .filter('startFrom',function(){
        return function(input,start){
            start = +start;
            return input.slice(start);
        };
    })
