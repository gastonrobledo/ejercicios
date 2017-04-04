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
                            console.log('Some error has occurred!: ' + error);
                        });
                    return deferred.promise;
                };

                service.CreateUser = function (user) {
                    $http.post(path + '/users', user)
                };

                service.GetAll = function (token) {

                    return $http.get(path + '/users', {headers: {'x-access-token': token}});
                };

                service.GetOne = function (id) {
                    return $http.get(path + '/users', id);
                };

                service.SendResetToken = function (email) {
                    return $http.post(path + '/recover-password', {email: email});
                };

                service.GetOneByToken = function (token) {
                    return $http.get(path + '/users/reset/'+token);
                };

                service.UpdateUser = function (user,token) {
                    var config = {
                        method: 'PUT',
                        url: path + '/auth/'+user._id,
                        data: user,
                        headers: {
                            'x-access-token': token
                        },
                        cache: true
                    };
                    return $http(config);
                };
                return service;
            }]);