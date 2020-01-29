function checaIdade(idade) {
    return new Promise(function (resolve, reject) {
        setTimeout(() => {
            if (idade > 18) {
                resolve();
            } else {
                reject();
            }
        }, 2000);
    });
}

checaIdade(17).then(function () {
    console.log("Maior que 18");
})
    .catch(function () {
        console.log("Menor que 18");
    })

var minhaPromisse = function () {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "https://api.github.com/users/leandrorezende");
        xhr.send(null);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status == 200) {
                    resolve(JSON.parse(xhr.responseText));
                } else {
                    reject("Erro na requisição");
                }
            }
        }
    });
}

minhaPromisse()
    .then(function (response) {
        console.log(response);
    })
    .catch(function (error) {
        console.warn(error);
    });

function getGitHubData(repository) {
    return axios.get("https://api.github.com/users/" + repository + "/repos")
        .then(response => {
            return response.data;
        })
        .catch(function (error) {
            return error;
        });
}

var listElementRepositories = document.querySelector("#app #listRepositories");
var inputElementSearch = document.querySelector("#app #inputGitHubUser");
var buttonElementSearch = document.querySelector("#app #searchRepostories");

var listElementTodos = document.querySelector("#app #listTodos");
var inputElementAdd = document.querySelector("#app #inputAddTodo");
var buttonElementAdd = document.querySelector("#app #addTodo");


var todos = JSON.parse(localStorage.getItem("list_todos")) || [];

function renderTodos() {
    listElementTodos.innerHTML = "";
    todos.forEach(todo => {
        var todoElement = document.createElement("li");
        todoElement.classList.add("list-group-item");
        var todoText = document.createTextNode(todo);

        var deleteButton = document.createElement("a");
        deleteButton.classList.add("btn", "btn-danger", "float-right", "btn-sm");
        deleteButton.setAttribute("href", "#");
        var pos = todos.indexOf(todo);
        todoElement.setAttribute("onclick", "deleteTodo(" + pos + ")");
        deleteButton.appendChild(document.createTextNode("Excluir"));

        todoElement.appendChild(todoText);
        todoElement.appendChild(deleteButton);
        listElementTodos.appendChild(todoElement);
    })
}

renderTodos();

function addTodo() {
    var todoText = inputElementAdd.value;
    todos.push(todoText);
    inputElementAdd.value = "";
    renderTodos();
    saveToStorage();
}

buttonElementAdd.onclick = addTodo;

buttonElementSearch.onclick = function () {
    listElementRepositories.innerHTML = "";
    var repositoryElement = document.createElement("li");
    repositoryElement.classList.add("list-group-item");
    var repositoryText = document.createTextNode("Carregando ...");
    repositoryElement.appendChild(repositoryText);
    listElementRepositories.appendChild(repositoryElement);

    getGitHubData(inputElementSearch.value).then(data => {
        listElementRepositories.innerHTML = "";
        data.forEach(repositoryData => {
            var repositoryElement = document.createElement("li");
            repositoryElement.classList.add("list-group-item");
            var repositoryText = document.createTextNode(repositoryData.name);

            repositoryElement.appendChild(repositoryText);
            listElementRepositories.appendChild(repositoryElement);
        });
    })
        .catch(function (error) {
            alert('Usuário ' + inputElementSearch.value + "não encontrado.");
        });
    inputElementSearch.value = ""
}

function deleteTodo(pos) {
    todos.splice(pos, 1);
    renderTodos();
    saveToStorage();
}

function saveToStorage() {
    localStorage.setItem("list_todos", JSON.stringify(todos));
}