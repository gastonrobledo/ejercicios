/**
 * Created by federpc on 10/03/17.
 */
angular.module('toDoApp.controllers', ['toDoApp.services', 'auth.services'])

    .controller('taskListController', ['$scope', '$state', 'toDoService', '$uibModal', 'AuthenticationService', '$window', function ($scope, $state, toDoService, $uibModal, authService, $window) {
        if (!authService.checkSession()) {
            $state.go('login');
        }
        function init() {

            $scope.taskList = toDoService.getAll();
            $scope.itemsPerPage = 3;
            $scope.taskToShow = [];
            $scope.totalItems = $scope.taskList.length;
            $scope.currentPage = 1;
            $scope.setPage = function (pageNo) {
                $scope.currentPage = pageNo;
            };
            $scope.maxSize = 5;
            $scope.bigTotalItems = 175;
            $scope.bigCurrentPage = 1;
        }

        $scope.deleteTask = function (id) {
            var task = toDoService.getOne(id);
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'modal.html',
                controller: ['$uibModalInstance', 'task', function ($uibModalInstance, task) {
                    this.task = task;
                    this.accept = function () {
                        $uibModalInstance.close(task);
                    };
                    this.cancel = function () {
                        $uibModalInstance.dismiss();
                    };
                }],
                controllerAs: '$ctrl',
                resolve: {
                    task: function () {
                        return task;
                    }
                }
            });
            modalInstance.result.then(function (task) {
                toDoService.deleteTask(task);
                init();
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });
        };

        $scope.dynamicSort = function (property) {
            var sortOrder = 1;
            if (property[0] === "-") { // "-" before the property string
                sortOrder = -1;
                property = property.substr(1);// deletes the "-"
            }
            return function (a, b) {
                var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
                return result * sortOrder;
            }

        };

        $scope.editTask = function (id) {
            $state.go("edit", {id: id});
        };

        $scope.getAll = function () {
            authService.GetAll($scope.token)
                .then(function (response) {
                    $scope.allUsers = response;
                })
                .catch(function (error) {
                    console.log(error);
                });
        };

        init();


    }])
    .controller('addTaskController', ['$scope', '$state', 'toDoService', '$stateParams', 'AuthenticationService', function ($scope, $state, toDoService, $stateParams, authService) {
        if (!authService.checkSession()) {
            $state.go('login');
        }
        function init() {
            $scope.newTask = {};
            $scope.taskList = toDoService.getAll();
            $scope.getDate();
            if ($state.current.name == "edit") {
                $scope.newTask = toDoService.getOne($state.params.id);
                $scope.newTask.date = new Date($scope.newTask.date);
            }
        }

        $scope.addTask = function () {
            if ($state.current.name == "add") {
                $scope.newTask.id = Date.now();
            }
            if ($state.current.name == "edit") {
                for (var i = 0; i < $scope.taskList.length; i++) {
                    if ($scope.taskList[i].id == $scope.newTask.id) {
                        $scope.taskList.splice(i, 1);
                        break;
                    }

                }

            }
            if (!$scope.validate("title", $scope.newTask.title)) {

                //push the new object
                toDoService.addTask($scope.newTask);
                $state.go('home');
            }
            else {
                alert("There's another task with the same title");
            }
        };

        $scope.validate = function (property, value) {
            $scope.taskList = toDoService.getAll();
            var result = false;
            for (var i = 0; i < $scope.taskList.length; i++) {
                if ($scope.taskList[i][property] == value) {
                    result = true;
                    break;
                }
            }
            return result;
        };

        $scope.clear = function () {
            var r = confirm("Do you want to cancel?");
            if (r == true) {
                $scope.newTask = {};
                $state.go('home');
            }
        };

        $scope.previewFile = function (element) {
            var imageFile = element.files[0];
            var reader = new FileReader();

            reader.onloadend = function () {
                $scope.$apply(function () {
                    $scope.newTask.imgPreview = reader.result;
                });
            };

            if (imageFile) {
                reader.readAsDataURL(imageFile);
            }
            else {
                $scope.newTask.imgPreview = "https://getuikit.com/v2/docs/images/placeholder_600x400.svg";
            }
        };

        $scope.getDate = function () {
            var today = new Date();
            $scope.format = 'dd-MMM-y';
            $scope.newTask.date = today;
            $scope.dt = today;//ui datepicker
            date.onkeydown = function (e) {
                e.preventDefault();
            };
            $scope.popup1 = {
                opened: false
            };
            $scope.open1 = function () {
                $scope.popup1.opened = true;
            };

            $scope.dateOptions = {
                formatYear: 'yy',
                maxDate: new Date(2020, 5, 22),
                minDate: today,
                startingDay: 1
            };

        };


        init();


    }])
    .controller('loginController', ['$rootScope','$scope', '$state', '$window', 'AuthenticationService', function ($rootScope,$scope, $state, $window, authService) {

        if (authService.checkSession()) {
            $state.go('home');
        }
        $scope.user = {};
        $scope.login = function (user) {
            authService.Login(user.email, user.password)
                .then(function (response) {
                    $window.sessionStorage.setItem('token', response);
                    $state.go('home');
                })
                .catch(function (error) {
                    $scope.loginError = true;
                    console.log(error);
                })
        };
        $scope.initMsg = function(){
            if($rootScope.userSaved && $rootScope.userSaved != 'notSaved'){
                $scope.successMsg =  "The user "+$rootScope.userSaved.email+ " was successfully created!";
                $scope.user.email = $rootScope.userSaved.email;
            }
            else if($rootScope.userSaved && $rootScope.userSaved == 'notSaved'){
                $scope.successMsg =  "There was a problem, try again";
            }

        }


    }])
    .controller('registrationController', ['$rootScope','$scope', '$state', 'AuthenticationService', function ($rootScope,$scope, $state, authService) {
        $scope.register = function (user, form) {
            if (form.$valid) {
                authService.CreateUser(user)
                    .then(function (response) {
                        console.log(response.data);
                        console.log(user);
                        $rootScope.userSaved = user;
                    })
                    .catch(function (error) {
                        $rootScope.userSaved = 'notSaved';
                        console.log(error);
                    }).finally(function () {
                    $state.go('login');
                });


            }
        }
    }]);