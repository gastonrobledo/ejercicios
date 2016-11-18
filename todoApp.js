/**
 * Created by federpc on 01/11/16.
 */




    function init(){
    getDate();
    document.getElementById("save").addEventListener("click",save);
}


    function getDate(){
    var today = new Date();
    var day = today.getDate();
    var month = today.getMonth()+1; //January is 0!
    var year = today.getFullYear();

    if(day<10){
        day='0'+day
    }
    if(month<10){
        month='0'+month
    }
    var today = year+'-'+month+'-'+day;
    document.getElementById("date").value = today;
    document.getElementById("date").setAttribute('min',today);
    document.getElementById("date").onkeydown= function(e){
        e.preventDefault();
    }


}

    function show() {
        //traigo el objeto del localStorage
        todoObj.init();//actualizo el JSON
        var taskList = todoObj.getAll();
        var tableDiv = document.getElementById("tableBox");

        //creo sortBox
        var sortBox = document.getElementById("sortBox");
        if (sortBox == null) {
            sortBox = document.createElement("select");
            sortBox.setAttribute("id", "sortBox");
            var optDate = document.createElement("option");
            var optDateDes = document.createElement("option");
            var optTitle = document.createElement("option");
            var optTitleDes = document.createElement("option");
            optDate.text = "Date - new first -";
            optDate.value = "-date";
            optDateDes.text = "Date - old first -"
            optDateDes.value = "date"
            optTitle.text = "Title A to Z";
            optTitle.value = "title";
            optTitleDes.text = "Title Z to A";
            optTitleDes.value = "-title";
            sortBox.appendChild(optDate);
            sortBox.appendChild(optDateDes)
            sortBox.appendChild(optTitle);
            sortBox.appendChild(optTitleDes);
            sortBox.addEventListener("change",show);

            tableDiv.appendChild(sortBox);
        }

        //para que no se duplique la tabla
        var oldTable = document.getElementById("list");
        if (oldTable != null) {
            tableDiv.removeChild(oldTable);
        }


        //Creo la tabla
        var table = document.createElement("table");
        table.setAttribute("id", "list");
        var tHead = document.createElement("th");
        var titleRow = document.createElement("tr");
        var headTitle = document.createElement("td");
        var headDescription = document.createElement("td");
        var headDate = document.createElement("td");

        tHead.innerHTML = "Task List";
        headTitle.innerHTML = "Title";
        headDescription.innerHTML = "Description";
        headDate.innerHTML = "Due date";

        titleRow.appendChild(tHead);
        table.appendChild(titleRow);
        table.appendChild(headTitle);
        table.appendChild(headDescription);
        table.appendChild(headDate);

        taskList.sort(dynamicSort(sortBox.value));
        console.log(sortBox.value);
        console.log(taskList);


        for (var i = 0; i < taskList.length; i++) {
            {
                //creo las filas y celdas
                var row = document.createElement("tr");
                var cellTitle = document.createElement("td");
                var cellDescription = document.createElement("td");
                var cellDate = document.createElement("td");
                var cellEdit = document.createElement("td");
                var cellDelete = document.createElement("td");
                //creo los textNodes
                var title = document.createTextNode(taskList[i].title);
                var description = document.createTextNode(taskList[i].description);
                var date = document.createTextNode(taskList[i].date);
                var id = document.createElement("input");
                id.setAttribute("id", "id");
                id.setAttribute("type", "hidden");
                id.setAttribute("value", taskList[i].id);

                //botones --- usar setAtribute?
                var editButton = document.createElement("button");
                var textE = document.createTextNode("Edit");
                editButton.appendChild(textE);

                var deleteButton = document.createElement("button");
                var textD = document.createTextNode("Delete");
                deleteButton.appendChild(textD);

                editButton.addEventListener("click", edit(id.getAttribute("value")));
                deleteButton.addEventListener("click", delTask(id.getAttribute("value")));

                //Append tr y td
                tHead.appendChild(row);
                cellTitle.appendChild(title);
                cellDate.appendChild(date);
                //Comparo las fechas
                var d = Date.parse(taskList[i].date);
                console.log(d);
                var today = new Date();
                console.log(today.getTime());
                if(today.getTime() > d){
                    cellDate.setAttribute("class","expired");
                }

                cellDescription.appendChild(description);
                cellDelete.appendChild(deleteButton);
                cellEdit.appendChild(editButton);
                row.appendChild(cellTitle);
                row.appendChild(cellDescription);
                row.appendChild(cellDate);
                row.appendChild(id);
                row.appendChild(cellEdit);
                row.appendChild(cellDelete);
                table.appendChild(row);




            }
            document.getElementById("tableBox").appendChild(table);
            console.log(taskList);


        }
    }

    function delTask(id) {
        function f() {
            var task = todoObj.getOne(id);
            console.log(task);
            if (confirm("Do you want to delete the task '" + task.title + "'?")) {
                var taskList = todoObj.getAll();
                console.log(taskList);
                for (var i = 0; i < taskList.length; i++) {
                    if (taskList[i].id == task.id) {
                        taskList.splice(i, 1);
                        localStorage.setItem('taskList', JSON.stringify(taskList));
                        show();
                        break;
                    }

                }
            }

        }

        return f;
    }

    function edit(id) {
        function f() {
            console.log(id);
            var task = todoObj.getOne(id);
            document.getElementById("title").value = task.title;
            document.getElementById("description").value = task.description;
            document.getElementById("date").value = task.date;
            document.getElementById("id").setAttribute("value",id);
            document.getElementById("action").value = "edit";
        }

        return f;

    }

    function save(taskForm) {

        var taskList = [];
        var parsedList = todoObj.getAll();

        if (parsedList != null) {
            for (var x in parsedList) {
                taskList.push(parsedList[x]);
            }
        }
        var id = 0;
        var action = document.getElementById("action").value;
        var title = document.getElementById("title").value;
        var description = document.getElementById("description").value;
        var date = document.getElementById("date").value;

        if (action == "new") {
            id = Date.now();
        }
        else {
            id = document.getElementById("id").value;//window.location.search.substr(4);
        }

        //elimino el objeto si lo voy a editar
        if (action == "edit") {
            for (var i = 0; i < taskList.length; i++) {
                if (taskList[i].id == id) {
                    taskList.splice(i, 1);
                    document.getElementById("action").value = "new";
                    break;
                }

            }

        }

        var task = {'title': title, 'description': description, 'date': date, 'id': id};

        if (!validate("title",title)) {

            //agrego el nuevo objeto al array
            taskList.push(task);

            localStorage.setItem('taskList', JSON.stringify(taskList));
            show();
        }
        else{
            alert("There's another task with the same title");
        }
    }

    function validate(property, value){ ///Si invierto true por false no funciona, preguntar
        var taskList = todoObj.getAll();
        for(var i=0;i<taskList.length;i++) {
            if (taskList[i][property] == value) {
                console.log(taskList[i]);
                return true
                break;
            }
        }
    }

    function dynamicSort(property) {
            var sortOrder = 1;
            if (property[0] === "-") { //si tiene un - antes de la property
                sortOrder = -1;
                property = property.substr(1);// le saco el -
            }
            return function (a, b) {
                var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
                return result * sortOrder;
            }

}

