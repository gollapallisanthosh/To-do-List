const addBtn = document.getElementById("add-btn");
const taskInput = document.getElementById("new-task");
const taskList = document.querySelector(".task-list");
const totalTaskEl = document.getElementById("total-task");
const completedTaskEl = document.getElementById("completed-task");
const filterBtns = document.querySelectorAll(".filter-btn");
const modeToggle = document.getElementById("mode-toggle");
const themeBtns = document.querySelectorAll(".theme-btn");
const priorityOptions = document.querySelectorAll(".priority-option");
const prioritySlider = document.getElementById("priority-slider");
const dateInput = document.getElementById("task-date");
const timeInput = document.getElementById("task-time");
const prioritySelector = document.querySelector(".priority-selector");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";
let currentPriority = "medium";
let darkMode = localStorage.getItem("darkMode") === "true";

/* INIT */
document.addEventListener("DOMContentLoaded", init);

function init() {
  if (darkMode) document.body.classList.add("dark");

  const now = new Date();
  dateInput.value = now.toISOString().split("T")[0];
  timeInput.value =
    now.getHours().toString().padStart(2, "0") +
    ":" +
    now.getMinutes().toString().padStart(2, "0");

  document.querySelector(`[data-priority="${currentPriority}"]`)
    .classList.add("selected");

  updatePrioritySlider();
  renderTasks();
}

/* SAVE */
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

/* RENDER */
function renderTasks() {
  taskList.innerHTML = "";

  let filtered = tasks;
  if (currentFilter === "active")
    filtered = tasks.filter(t => !t.completed);
  if (currentFilter === "completed")
    filtered = tasks.filter(t => t.completed);

  if (filtered.length === 0) {
    taskList.innerHTML = `
      <div class="empty-state">
        <i class="fa-solid fa-clipboard-list" style="font-size: 2rem; margin-bottom: 10px; opacity: 0.5;"></i>
        <p>No tasks found</p>
      </div>`;
  }

  filtered.forEach((task) => {
    const index = tasks.indexOf(task);
    const div = document.createElement("div");
    div.className = "task-item" + (task.completed ? " completed" : "");

    div.innerHTML = `
  <div class="task-content">
    <strong>${task.text}</strong>
    <small><i class="fa-regular fa-calendar"></i> ${task.date || ""} ${task.time || ""}</small>
    <small class="priority-indicator ${task.priority || 'medium'}">${task.priority || 'medium'}</small>
  </div>
  <div class="task-actions">
    <button onclick="toggleTask(${index})">
      <i class="fa-solid fa-check"></i>
    </button>
    <button onclick="deleteTask(${index})">
      <i class="fa-solid fa-trash"></i>
    </button>
  </div>
`;

    taskList.appendChild(div);
  });

  updateStats();
}

/* STATS */
function updateStats() {
  totalTaskEl.textContent = `${tasks.length} tasks`;
  completedTaskEl.textContent =
    `${tasks.filter(t => t.completed).length} completed`;
}

/* ADD */
addBtn.onclick = () => {
  if (!taskInput.value.trim()) return;

  tasks.push({
    text: taskInput.value,
    completed: false,
    priority: currentPriority,
    date: dateInput.value,
    time: timeInput.value
  });
console.log(currentPriority);
  taskInput.value = "";
  saveTasks();
  renderTasks();
};

/* TOGGLE */
function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

/* DELETE */
function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

/* FILTER */
filterBtns.forEach(btn => {
  btn.onclick = () => {
    document.querySelector(".filter-btn.active")
      .classList.remove("active");
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderTasks();
  };
});

/* DARK MODE */
modeToggle.onclick = () => {
  document.body.classList.toggle("dark");
  darkMode = document.body.classList.contains("dark");
  localStorage.setItem("darkMode", darkMode);

  const icon = modeToggle.querySelector("i");
  icon.classList.toggle("fa-moon");
  icon.classList.toggle("fa-sun");
};

/* THEME */
themeBtns.forEach(btn => {
  btn.onclick = () => {
    document.querySelector(".theme-btn.active")
      .classList.remove("active");
    btn.classList.add("active");
    document.body.style.background = btn.style.background;
  };
});

/* PRIORITY */
priorityOptions.forEach(option => {
  option.addEventListener("click", () => {

    // Remove old selected
    document.querySelector(".priority-option.selected")
      ?.classList.remove("selected");

    // Add selected to clicked one
    option.classList.add("selected");

    // Update current priority
    currentPriority = option.dataset.priority;

    console.log("Selected Priority:", currentPriority); // debug
    updatePrioritySlider();
  });
});

function updatePrioritySlider() {
  const index = [...priorityOptions]
    .findIndex(opt => opt.dataset.priority === currentPriority);

  prioritySlider.style.left = `${index * 33.3}%`;
}