/**
 * Created by federpc on 01/11/16.
 */




function init() {
    getDate();
    document.getElementById("save").addEventListener("click", save);
    document.getElementById("cancel").addEventListener("click", clear);
    pager = new Pager("list", 3);
}
function previewFile() {
    var preview = document.getElementById('imgPreview');
    var file = document.getElementById('image').files[0];
    var reader = new FileReader();
    var string64;

    reader.onloadend = function () {
        preview.src = reader.result;

    }


    if (file != null) {
        reader.readAsDataURL(file);
    }
    return reader;

}

function getDate() {
    var today = new Date();
    var day = today.getDate();
    var month = today.getMonth() + 1; //January is 0!
    var year = today.getFullYear();

    if (day < 10) {
        day = '0' + day
    }
    if (month < 10) {
        month = '0' + month
    }
    var today = year + '-' + month + '-' + day;
    document.getElementById("date").value = today;
    document.getElementById("date").setAttribute('min', today);
    document.getElementById("date").onkeydown = function (e) {
        e.preventDefault();
    }


}

function show() {
    todoObj.init();//update JSON
    var taskList = todoObj.getAll();
    var tableDiv = document.getElementById("tableDiv");
    var sortDiv = document.getElementById("sortDiv");


    //create the sortBox
    var sortBox = document.getElementById("sortBox");
    if (sortBox == null) {
        sortBox = document.createElement("select");
        sortBox.setAttribute("id", "sortBox");
        sortBox.setAttribute("class", "form-control");
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
        sortBox.addEventListener("change", show);

        sortDiv.appendChild(sortBox);
    }

    //to avoid table duplication
    var oldTable = document.getElementById("list");
    if (oldTable != null) {
        tableDiv.removeChild(oldTable);
    }


    //create the table
    var table = document.createElement("table");
    table.setAttribute("id", "list");
    table.setAttribute("class", "table table-striped table-hover table-condensed data-toggle='table'" +
        " data-pagination='true' data-page-list='[5, 10, 20, 50, 100, 200]'");
    var tBody = document.createElement('tbody');

    taskList.sort(dynamicSort(sortBox.value));


    for (var i = 0; i < taskList.length; i++) {
        {
            //create rows and cells
            var row = document.createElement("tr");
            var cellTitle = document.createElement("td");
            var cellDescription = document.createElement("td");
            var cellDate = document.createElement("td");
            var cellImage = document.createElement("td");
            var cellEdit = document.createElement("td");
            //create textNodes
            var title = document.createTextNode(taskList[i].title);
            var description = document.createTextNode(taskList[i].description);
            var date = document.createTextNode(taskList[i].date);
            var id = document.createElement("input");
            //Image
            var img = taskList[i].img;
            var image = new Image();
            image.src = img;
            image.alt = "No image";
            image.style.height = '100px';
            image.style.width = '100px';

            id.setAttribute("id", "id");
            id.setAttribute("type", "hidden");
            id.setAttribute("value", taskList[i].id);

            //buttons
            var editButton = document.createElement("a");
            var editIcon = document.createElement("span");
            editIcon.setAttribute("class", "fa fa-pencil fa-3x aria-hidden='true'");
            editButton.setAttribute("class", "");
            editButton.appendChild(editIcon);

            var deleteButton = document.createElement("a");
            var delIcon = document.createElement("span");
            delIcon.setAttribute("class", "fa fa-times fa-3x aria-hidden='true'");
            deleteButton.setAttribute("class", "");
            deleteButton.appendChild(delIcon);

            editButton.addEventListener("click", edit(id.getAttribute("value")));
            deleteButton.addEventListener("click", delTask(id.getAttribute("value")));

            //Append tr y td
            //tBody.appendChild(row);
            cellTitle.appendChild(title);
            cellDate.appendChild(date);
            //date comparison
            var d = Date.parse(taskList[i].date);
            var today = new Date();
            if (today.getTime() > d) {
                row.setAttribute("class", "danger");
            }
            //check if it's a completed task
            if (taskList[i].completed == true) {
                row.setAttribute("class", "success");
            }
            ;


            cellDescription.appendChild(description);
            cellEdit.appendChild(editButton);
            cellEdit.appendChild(deleteButton);
            cellImage.appendChild(image);
            row.appendChild(cellDate);
            row.appendChild(cellTitle);
            row.appendChild(cellDescription);
            row.appendChild(id);
            row.appendChild(cellImage);
            row.appendChild(cellEdit);
            tBody.appendChild(row);
            table.appendChild(tBody);


        }
        document.getElementById("tableDiv").appendChild(table);


        pager.init();
        pager.showPageNav('pager', 'pagination');
        pager.showPage(1);
        console.log(taskList.length);


    }
}

function delTask(id) {
    function f() {
        var task = todoObj.getOne(id);
        if (confirm("Do you want to delete the task '" + task.title + "'?")) {
            var taskList = todoObj.getAll();
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
        var task = todoObj.getOne(id);
        document.getElementById("title").value = task.title;
        document.getElementById("description").value = task.description;
        document.getElementById("date").value = task.date;
        document.getElementById("id").setAttribute("value", id);
        document.getElementById("action").value = "edit";
    }

    return f;

}

function clear() {
    var img = document.getElementById("imgPreview");
    var imgInfo = document.getElementById("imgInfo");
    var r = confirm("Do you want to cancel?");
    if (r == true) {
        document.getElementById("taskForm").reset();
        img.setAttribute("src", "https://getuikit.com/v2/docs/images/placeholder_600x400.svg")//display the default thumbnail
        imgInfo.innerHTML = "";
        getDate();
    }
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
    var completed = document.getElementById("completed").checked;
    //image
    var imgFile = document.getElementById("imgPreview").src;

    if (action == "new") {
        id = Date.now();
    }
    else {
        id = document.getElementById("id").value;
    }

    //if editing, delete the object with the same id
    if (action == "edit") {
        for (var i = 0; i < taskList.length; i++) {
            if (taskList[i].id == id) {
                taskList.splice(i, 1);
                document.getElementById("action").value = "new";
                break;
            }

        }

    }

    var task = {
        'title': title,
        'description': description,
        'date': date,
        'id': id,
        "img": imgFile,
        "completed": completed
    };

    if (!validate("title", title)) {

        //push the new object
        taskList.push(task);

        localStorage.setItem('taskList', JSON.stringify(taskList));
        show();
    }
    else {
        alert("There's another task with the same title");
    }
}

function validate(property, value) { ///Si invierto true por false no funciona, preguntar
    var taskList = todoObj.getAll();
    for (var i = 0; i < taskList.length; i++) {
        if (taskList[i][property] == value) {
            return true
            break;
        }
    }
}

function dynamicSort(property) {
    var sortOrder = 1;
    if (property[0] === "-") { // "-" before the property string
        sortOrder = -1;
        property = property.substr(1);// deletes the "-"
    }
    return function (a, b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }

}

function Pager(tableName, itemsPerPage) {
    this.tableName = tableName;
    this.itemsPerPage = itemsPerPage;
    this.currentPage = 1;
    this.pages = 0;
    this.inited = false;

    this.showRecords = function (from, to) {
        var rows = document.getElementById(tableName).rows;
        // i starts from 1 to skip table header row
        for (var i = 0; i < rows.length; i++) {
            if (i >= from && i <= to)
                rows[i].style.display = '';
            else
                rows[i].style.display = 'none';
        }
    }

    this.showPage = function (pageNumber) {
        if (!this.inited) {
            alert("not inited");
            return;
        }
        this.currentPage = pageNumber;
        var from = (pageNumber - 1) * itemsPerPage;
        var to = from + itemsPerPage - 1;
        this.showRecords(from, to);
    }

    this.prev = function () {
        if (this.currentPage > 1)
            this.showPage(this.currentPage - 1);
    }

    this.next = function () {
        if (this.currentPage < this.pages) {
            this.showPage(this.currentPage + 1);
        }
    }

    this.init = function () {
        var rows = document.getElementById(tableName).rows;
        var records = (rows.length);//-1
        this.pages = Math.ceil(records / itemsPerPage);
        console.log("pages " + this.pages);
        this.inited = true;
    }

    this.showPageNav = function (pagerName, positionId) {
        if (!this.inited) {
            alert("not inited");
            return;
        }
        var element = document.getElementById(positionId);

        var pagerHtml = '<li><span onclick="' + pagerName + '.prev();" class=""> &#171 Prev </span></li> ';
        for (var page = 1; page <= this.pages; page++)
            pagerHtml += '<li><span id="pg' + page + '" class="" onclick="' + pagerName + '.showPage(' + page + ');">' + page + '</span></li> ';
        pagerHtml += '<li><span onclick="' + pagerName + '.next();" class="pg-normal"> Next &#187;</span></li>';

        element.innerHTML = pagerHtml;
    }
}
