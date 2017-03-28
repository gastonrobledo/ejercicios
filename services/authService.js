/**
 * Created by federpc on 16/03/17.
 */
angular.module('auth.services', [])
    .factory('AuthenticationService',
        ['$http', '$q', '$window',
            function ($http, $q, $window) {
                var path = 'http://localhost:3000/api';
                var service = {};
                service.checkSession = function () {
                    var token = $window.sessionStorage.getItem('token');
                    var logged = false;
                    if (token == null) {
                        console.log('Not LoggedIn');
                    }
                    else {
                        console.log('Logged In');
                        logged = true;
                    }
                    return logged;

                };

                service.Login = function (email, password) {
                    var deferred = $q.defer();
                    $http.post(path + '/auth', {email: email, password: password})
                        .then(function (response) {
                            deferred.resolve(response.data.token);
                            console.log('Response from server: ' + response);
                        })
                        .catch(function (error) {
                            deferred.reject(error);
                            console.log('Some error as occurred!: ' + error);
                        });
                    return deferred.promise;
                };

                service.CreateUser = function (user) {
                    var deferred = $q.defer();
                    $http.post(path + '/users', user)
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

                    $http.get(path + '/users', {headers: {'x-access-token': token}})
                        .then(function (response) {
                            deferred.resolve(response.data);
                            console.log(response);
                        })
                        .catch(function (error) {
                            deferred.resolve(error);
                            console.log('Some error as occurred: ' + error)
                        });
                    return deferred.promise;

                };

                service.GetOne = function (id) {
                    var deferred = $q.defer();
                    $http.get(path + '/users', id)
                        .then(function (response) {
                            deferred.resolve(response);
                            console.log(response);
                        })
                        .catch(function (error) {
                            deferred.reject(error);
                            console.log('Some error as occurred: ' + error)
                        });
                    return deferred.promise;
                };

                return service;
            }]);
