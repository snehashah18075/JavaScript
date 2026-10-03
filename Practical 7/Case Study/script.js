// ============================================
// RoutineFlow — Smart Role-Based To-Do & Alarm Planner
// ============================================

const STORAGE_KEY = "routineflow_tasks";

const form = document.getElementById("taskForm");
const textInput = document.getElementById("taskText");
const categoryInput = document.getElementById("taskCategory");
const timeInput = document.getElementById("taskTime");
const submitBtn = document.getElementById("submitBtn");
const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");
const filterBar = document.getElementById("filterBar");

let tasks = loadTasks();
let editingId = null;
let activeFilter = "all";

const CATEGORY_LABELS = {
  study: "📚 Study",
  sleep: "🌙 Sleep",
  work: "💼 Work",
  fitness: "🏋️ Fitness",
  custom: "✦ Custom"
};

// ---------- Persistence ----------
function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Could not load tasks:", e);
    return [];
  }
}

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.error("Could not save tasks:", e);
  }
}

// ---------- CRUD ----------
function addTask(text, category, datetime) {
  tasks.push({
    id: Date.now().toString(),
    text,
    category,
    datetime,
    completed: false
  });
  saveTasks();
  render();
}

function updateTask(id, text, category, datetime) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  task.text = text;
  task.category = category;
  task.datetime = datetime;
  saveTasks();
  render();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  render();
}

function toggleComplete(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  task.completed = !task.completed;
  saveTasks();
  render();
}

// ---------- Form handling (Add + Edit share one form) ----------
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = textInput.value.trim();
  const category = categoryInput.value;
  const datetime = timeInput.value;

  if (!text || !datetime) return;

  if (editingId) {
    updateTask(editingId, text, category, datetime);
    editingId = null;
    submitBtn.textContent = "Add Task";
  } else {
    addTask(text, category, datetime);
  }

  form.reset();
});

function startEdit(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  textInput.value = task.text;
  categoryInput.value = task.category;
  timeInput.value = task.datetime;
  editingId = id;
  submitBtn.textContent = "Save Changes";
  textInput.focus();
}

// ---------- Filtering ----------
filterBar.addEventListener("click", (e) => {
  const chip = e.target.closest(".filter-chip");
  if (!chip) return;
  document.querySelectorAll(".filter-chip").forEach(c => c.classList.remove("active"));
  chip.classList.add("active");
  activeFilter = chip.dataset.filter;
  render();
});

// ---------- Countdown helper ----------
function getCountdownLabel(datetimeStr) {
  const target = new Date(datetimeStr).getTime();
  const now = Date.now();
  const diff = target - now;

  if (diff <= 0) {
    return { label: "⏰ Due now", isDue: true };
  }

  const totalMinutes = Math.floor(diff / 60000);
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;

  let label = "in ";
  if (days > 0) label += `${days}d `;
  if (hours > 0 || days > 0) label += `${hours}h `;
  label += `${minutes}m`;

  // "due soon" window: within 5 minutes
  const isDue = diff <= 5 * 60 * 1000;
  return { label, isDue };
}

// ---------- Rendering (DOM traversal & updates) ----------
function render() {
  taskList.innerHTML = "";

  const visibleTasks = tasks
    .filter(t => activeFilter === "all" || t.category === activeFilter)
    .sort((a, b) => new Date(a.datetime) - new Date(b.datetime));

  emptyState.style.display = visibleTasks.length === 0 ? "block" : "none";

  visibleTasks.forEach(task => {
    const li = document.createElement("li");
    li.className = "task-item";
    li.dataset.id = task.id;
    if (task.completed) li.classList.add("completed");

    const { label, isDue } = getCountdownLabel(task.datetime);
    if (isDue && !task.completed) li.classList.add("due");

    const formattedTime = new Date(task.datetime).toLocaleString(undefined, {
      month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
    });

    li.innerHTML = `
      <span class="cat-dot cat-${task.category}"></span>
      <div class="task-body">
        <p class="task-text">${escapeHtml(task.text)}</p>
        <div class="task-meta">
          <span class="cat-pill pill-${task.category}">${CATEGORY_LABELS[task.category]}</span>
          <span>${formattedTime}</span>
          <span class="countdown">${label}</span>
        </div>
      </div>
      <div class="task-actions">
        <button class="icon-btn" data-action="complete" title="Mark complete">✓</button>
        <button class="icon-btn" data-action="edit" title="Edit">✎</button>
        <button class="icon-btn" data-action="delete" title="Delete">✕</button>
      </div>
    `;

    taskList.appendChild(li);
  });
}

// Event delegation for complete / edit / delete
taskList.addEventListener("click", (e) => {
  const btn = e.target.closest(".icon-btn");
  if (!btn) return;
  const li = btn.closest(".task-item");
  const id = li.dataset.id;
  const action = btn.dataset.action;

  if (action === "complete") toggleComplete(id);
  if (action === "edit") startEdit(id);
  if (action === "delete") deleteTask(id);
});

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// ---------- Live countdown refresh ----------
setInterval(render, 1000 * 30); // refresh every 30s so countdowns & "due" highlight stay current

// ---------- Init ----------
render();