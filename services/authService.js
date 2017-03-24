/**
 * Created by federpc on 16/03/17.
 */
angular.module('auth.services', [])
    .factory('AuthenticationService',
        ['$http', '$q', '$window', '$state',
            function ($http, $q, $window, $state) {
                var service = {};
                service.CheckSession = function () {
                    var token = $window.sessionStorage.getItem('token');
                    if (token == null) {
                        console.log('Not LoggedIn');
                        $state.go('auth');
                    }
                    else {
                        console.log('Logged In');
                        return true;
                    }

                };

                service.Login = function (email, password) {
                    var deferred = $q.defer();
                    $http.post('http://localhost:3000/api/auth', {email: email, password: password})
                        .then(function (response) {
                            deferred.resolve(response.data.token);
                            console.log('Response from server: ' + response);
                        })
                        .catch(function(error) {
                        deferred.reject(error);
                        console.log('Some error as occurred!: ' + error);
                    });
                    return deferred.promise;
                };

                service.CreateUser = function (user) {
                    var deferred = $q.defer();
                    $http.post('http://localhost:3000/api/users', user)
                        .then(function (response) {
                            deferred.resolve(response);
                            console.log('User saved:' + response);
                        })
                        .catch(function (error) {
                        deferred.reject(error);
                        console.log('Some error as occurred: ' + error)
                    });
                    return deferred.promise;

                };

                service.GetAll = function (token) {
                    var deferred = $q.defer();
                    $http.get('http://localhost:3000/api/users', {headers: {'x-access-token': token}})
                        .then(function (response) {
                            deferred.resolve(response.data);
                            console.log(response);
                        })
                        , function (error) {
                        deferred.resolve(error);
                        console.log('Some error as occurred: ' + error)
                    };
                    return deferred.promise;

                };

                service.GetOne = function (id) {
                    var deferred = $q.defer();
                    $http.get('http://localhost:3000/api/users', id)
                        .then(function (response) {
                            deferred.resolve(response);
                            console.log(response);
                        })
                        , function (error) {
                        deferred.reject(error);
                        console.log('Some error as occurred: ' + error)
                    }
                    return deferred.promise;
                };

                return service;
            }]);
