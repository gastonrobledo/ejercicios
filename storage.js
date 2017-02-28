/**
 * Created by federpc on 03/11/16.
 */

var Storage = {
    init: function(){
        var data = localStorage.getItem('taskList');
        this.data = data ? JSON.parse(data) : [];
        return this;
    },

    getAll: function(){
        return this.data;
    },

    getOne: function(id){
        var data = todoObj.getAll();

        for(var i=0;i<data.length;i++) {
            if (data[i].id == id) {
                return data[i];
                break;
            }
        }
    }



};

var todoObj = Storage.init();