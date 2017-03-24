/**
 * Created by federpc on 10/03/17.
 */
angular.module('toDoApp.services', ["LocalStorageModule"])
    .service("toDoService", function (localStorageService) {
        this.key = "taskList";
        if (localStorageService.get(this.key)) {
            this.tasks = localStorageService.get(this.key);
        }
        else {
            this.tasks = [];
        }

        this.addTask = function (newTask) {
            this.tasks.push(newTask);
            this.updateStorage();
        };
        this.updateStorage = function () {
            localStorageService.set(this.key, this.tasks);
        };
        this.clean = function () {
            this.tasks = [];
            this.updateStorage();
            return this.getAll();
        };
        this.getAll = function () {
            return this.tasks;
        };
        this.deleteTask = function (item) {
            var deleted = this.tasks.filter(function (task) {
                return task !== item;
            });
            this.tasks = deleted;
            this.updateStorage();
            return this.getAll();
        };
        this.getOne = function (taskId) {
            var data = this.getAll();
            var result;

            for (var i = 0; i < data.length; i++) {
                if (data[i].id == taskId) {
                    result = data[i];
                    break;
                }
            }
            return result;

        };


    });