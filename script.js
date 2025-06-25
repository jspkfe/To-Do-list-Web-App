window.onload = loadTasks;

function addTask() {
  const taskInput = document.getElementById("taskInput");
  const taskText = taskInput.value.trim();

  if (taskText === "") {
    alert("Please enter a task before adding.");
    return;
  }

  if (taskText.length < 3) {
    alert("Task must be at least 3 characters long.");
    return;
  }
  const task = {
    text: taskText,
    completed: false
  };
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));

  renderTask(task);
  taskInput.value = "";
}

function renderTask(task) {
  const li = document.createElement("li");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.completed;
  checkbox.style.marginRight = "10px";

  const span = document.createElement("span");
  span.textContent = task.text;
  if (task.completed) {
    span.classList.add("done");
  }
  const editButton = document.createElement("button");
editButton.textContent = "Edit";
editButton.style.marginLeft = "10px";

editButton.addEventListener("click", () => {
  const oldText = task.text;
  const newText = prompt("Edit task:", oldText);

  if (!newText || newText.trim().length < 3) {
    alert("Task must be at least 3 characters.");
    return;
  }
  const trimmedText = newText.trim();
  if (trimmedText === oldText) return;
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const duplicate = tasks.some(t => t.text.toLowerCase() === trimmedText.toLowerCase());
  if (duplicate) {
    alert("This task already exists.");
    return;
  }
  const updatedTasks = tasks.map(t =>
    t.text === oldText ? { ...t, text: trimmedText } : t
  );
  localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  span.textContent = trimmedText;
  task.text = trimmedText; 
});

  checkbox.addEventListener("change", () => {
    span.classList.toggle("done", checkbox.checked);
    updateTaskStatus(task.text, checkbox.checked);
  });
  li.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    li.remove();
    deleteTask(task.text);
  });
  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(editButton);
  document.getElementById("taskList").appendChild(li);
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(task => renderTask(task));
}

function updateTaskStatus(taskText, isCompleted) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.map(task =>
    task.text === taskText ? { ...task, completed: isCompleted } : task
  );
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function deleteTask(taskText) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.filter(task => task.text !== taskText);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function clearAllTasks() {
  localStorage.removeItem("tasks");
  document.getElementById("taskList").innerHTML = "";
}
function filterTasks(filterType) {
  const allTasks = document.querySelectorAll("#taskList li");

  allTasks.forEach(li => {
    const checkbox = li.querySelector("input[type='checkbox']");
    const isCompleted = checkbox.checked;

    if (filterType === "all") {
      li.style.display = "flex";
    } else if (filterType === "active") {
      li.style.display = isCompleted ? "none" : "flex";
    } else if (filterType === "completed") {
      li.style.display = isCompleted ? "flex" : "none";
    }
  });
}
