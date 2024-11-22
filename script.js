const taskInput = document.getElementById("task-input");
const categoryInput = document.getElementById("category-input");
const prioritySelect = document.getElementById("priority-select");
const addTaskButton = document.getElementById("add-task-button");
const searchBar = document.getElementById("search-bar");
const filterStatus = document.getElementById("filter-status");
const filterPriority = document.getElementById("filter-priority");
const todoList = document.getElementById("todo-list");

const todoForm = document.getElementById("todo-form");

addTaskButton.addEventListener("click", addTask);
searchBar.addEventListener("input", searchTasks);
filterStatus.addEventListener("change", filterTasks);
filterPriority.addEventListener("change", sortTasks);

function addTask(event) {
    event.preventDefault(); // Prevent form submission

    const taskName = taskInput.value.trim();
    const category = categoryInput.value.trim() || "General";
    const priority = prioritySelect.value;
    const date = document.getElementById("date-input").value || null; // Get the selected date

    if (taskName === "" || priority === "") {
        alert("Task name and priority are required.");
        return;
    }

    const newTask = {
        name: taskName,
        category: category,
        priority: priority,
        completed: false,
        date: date, // Store the due date
    };

    saveTodoToLocalStorage(newTask);
    renderTodos();
    todoForm.reset();
}

function renderTodos() {
    const todos = getTodosFromLocalStorage();
    todoList.innerHTML = ""; // Clear the current list

    todos.forEach((todo, index) => {
        const todoItem = document.createElement("tr");
        todoItem.classList.add("todo-item");
        if (todo.completed) {
            todoItem.classList.add("completed");
        }

        // Apply priority color classes
        const priorityClass = getPriorityClass(todo.priority);

        todoItem.innerHTML = `
            <td class="todo-name">${todo.name}</td>
            <td class="todo-category">${todo.category}</td>
            <td class="todo-priority ${priorityClass}">${capitalizeFirstLetter(todo.priority)}</td>
            <td class="todo-date">${todo.date || "No date"}</td> <!-- Display the date -->
            <td class="todo-status">${todo.completed ? "Completed" : "Pending"}</td>
            <td>
                <button class="complete-btn">${todo.completed ? "Undo" : "Complete"}</button>
                <button class="delete-btn">Delete</button>
            </td>
        `;

        const completeBtn = todoItem.querySelector(".complete-btn");
        const deleteBtn = todoItem.querySelector(".delete-btn");

        completeBtn.addEventListener("click", () => toggleComplete(todo, index));
        deleteBtn.addEventListener("click", () => deleteTask(index));

        todoList.appendChild(todoItem);
    });
}

// Function to return the class for priority color
function getPriorityClass(priority) {
    switch (priority) {
        case "high":
            return "high-priority";
        case "medium":
            return "medium-priority";
        case "low":
            return "low-priority";
        default:
            return "";
    }
}

function toggleComplete(todo, index) {
    todo.completed = !todo.completed;
    updateTodoInLocalStorage(todo, index);
    renderTodos();
}

function deleteTask(index) {
    const todos = getTodosFromLocalStorage();
    todos.splice(index, 1);
    localStorage.setItem("todos", JSON.stringify(todos));
    renderTodos();
}

function saveTodoToLocalStorage(todo) {
    const todos = getTodosFromLocalStorage();
    todos.push(todo);
    localStorage.setItem("todos", JSON.stringify(todos));
}

function getTodosFromLocalStorage() {
    return localStorage.getItem("todos") ? JSON.parse(localStorage.getItem("todos")) : [];
}

function updateTodoInLocalStorage(todo, index) {
    const todos = getTodosFromLocalStorage();
    todos[index] = todo;
    localStorage.setItem("todos", JSON.stringify(todos));
}

function searchTasks() {
    const query = searchBar.value.toLowerCase();
    const todos = document.querySelectorAll(".todo-item");

    todos.forEach((todo) => {
        const taskName = todo.querySelector(".todo-name").textContent.toLowerCase();
        todo.style.display = taskName.includes(query) ? "table-row" : "none";
    });
}

function filterTasks() {
    const status = filterStatus.value;
    const todos = document.querySelectorAll(".todo-item");

    todos.forEach((todo) => {
        const isCompleted = todo.classList.contains("completed");
        if (status === "all" || (status === "completed" && isCompleted) || (status === "pending" && !isCompleted)) {
            todo.style.display = "table-row";
        } else {
            todo.style.display = "none";
        }
    });
}

function sortTasks() {
    const priority = filterPriority.value;
    const todos = Array.from(document.querySelectorAll(".todo-item"));

    todos.sort((a, b) => {
        const priorityA = a.querySelector(".todo-priority").textContent.toLowerCase();
        const priorityB = b.querySelector(".todo-priority").textContent.toLowerCase();

        if (priority === "high") {
            return priorityA === "high" ? -1 : 1;
        } else if (priority === "medium") {
            return priorityA === "medium" ? -1 : 1;
        } else if (priority === "low") {
            return priorityA === "low" ? -1 : 1;
        }
        return 0;
    });

    todos.forEach((todo) => {
        todoList.appendChild(todo);
    });
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
