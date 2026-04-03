// ── TIMER ─────────────────────────────────────────────────────────────────

let time = 1500; // 25 minutes in seconds
let defaultTime = 1500;
let interval = null;

function updateDisplay() {
  let minutes = Math.floor(time / 60);
  let seconds = time % 60;
  document.getElementById("time").textContent =
    `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

// Set timer from preset buttons
function setTimer(minutes) {
  pauseTimer();
  time = minutes * 60;
  defaultTime = time;
  updateDisplay();

  // Update active preset button
  document.querySelectorAll(".preset-btn").forEach(btn => btn.classList.remove("active"));
  event.target.classList.add("active");
}

// Set timer from custom input
function setCustomTimer() {
  let input = document.getElementById("customMinutes");
  let mins = parseInt(input.value);
  if (!mins || mins < 1) return;

  pauseTimer();
  time = mins * 60;
  defaultTime = time;
  updateDisplay();
  input.value = "";

  document.querySelectorAll(".preset-btn").forEach(btn => btn.classList.remove("active"));
}

// Adjust time by +/- minutes (works whether running or paused)
function adjustTime(minutes) {
  time = Math.max(0, time + minutes * 60);
  updateDisplay();
}

function startTimer() {
  if (interval) return;

  interval = setInterval(() => {
    if (time > 0) {
      time--;
      updateDisplay();
    } else {
      clearInterval(interval);
      interval = null;

      if (document.getElementById("soundToggle").checked) {
        let sound = new Audio("audio/bell.mp3");
        sound.volume = 0.5;
        sound.play().catch(() => {}); // catch autoplay restrictions
      }

      // Flash the timer display when done
      document.getElementById("time").classList.add("done");
      setTimeout(() => document.getElementById("time").classList.remove("done"), 3000);
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(interval);
  interval = null;
}

function resetTimer() {
  clearInterval(interval);
  interval = null;
  time = defaultTime;
  updateDisplay();
}

updateDisplay();

// ── SOUND ─────────────────────────────────────────────────────────────────

let soundPlaying = false;

function toggleSound() {
  let audio = document.getElementById("bgSound");
  let btn = document.getElementById("soundBtn");

  if (soundPlaying) {
    audio.pause();
    btn.textContent = "🔇 Calm Sound";
  } else {
    audio.play().catch(() => {});
    btn.textContent = "🔊 Calm Sound";
  }

  soundPlaying = !soundPlaying;
}

// ── FOCUS MODE ─────────────────────────────────────────────────────────────

let focusOn = false;

function toggleFocus() {
  focusOn = !focusOn;
  document.body.classList.toggle("focus-mode", focusOn);
}

// ── TASKS ─────────────────────────────────────────────────────────────────

let tasks = [];

function addTask() {
  let taskText = document.getElementById("taskInput").value.trim();
  let dueDate = document.getElementById("dueDate").value;

  if (!taskText) {
    alert("Please enter a task name.");
    return;
  }

  // Due date is OPTIONAL — if not provided, task goes to bottom
  tasks.push({
    text: taskText,
    due: dueDate ? new Date(dueDate) : null,
    completed: false
  });

  // Sort: tasks WITH due dates first (by date), then tasks WITHOUT due dates
  tasks.sort((a, b) => {
    if (a.due && b.due) return a.due - b.due;  // both have dates: sort by date
    if (a.due) return -1;                       // a has date, b doesn't: a goes first
    if (b.due) return 1;                        // b has date, a doesn't: b goes first
    return 0;                                   // neither has date: keep order
  });

  saveTasks();
  renderTasks();

  document.getElementById("taskInput").value = "";
  document.getElementById("dueDate").value = "";
}

function renderTasks() {
  let list = document.getElementById("taskList");
  list.innerHTML = "";

  if (tasks.length === 0) {
    list.innerHTML = `<li class="empty-state">No tasks yet — you're all clear 🌿</li>`;
    return;
  }

  tasks.forEach((task, index) => {
    let li = document.createElement("li");
    li.className = "task-item" + (task.completed ? " completed" : "");

    // Checkbox
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-checkbox";
    checkbox.checked = task.completed;
    checkbox.onchange = () => {
      tasks[index].completed = checkbox.checked;
      saveTasks();
      renderTasks();
    };

    // Task info wrapper
    let info = document.createElement("div");
    info.className = "task-info";

    // Task text
    let span = document.createElement("span");
    span.className = "task-text";
    span.textContent = task.text;

    // Due date label (only if task has one)
    let dueLabel = document.createElement("span");
    dueLabel.className = "task-due";

    if (task.due) {
      let now = new Date();
      let diff = (task.due - now) / (1000 * 60); // diff in minutes

      dueLabel.textContent = `Due: ${task.due.toLocaleString()}`;

      if (!task.completed) {
        if (diff < 0) dueLabel.classList.add("overdue");
        else if (diff < 60) dueLabel.classList.add("urgent");
        else if (diff < 180) dueLabel.classList.add("soon");
        else dueLabel.classList.add("ok");
      }
    } else {
      dueLabel.textContent = "No due date";
      dueLabel.classList.add("no-date");
    }

    info.appendChild(span);
    info.appendChild(dueLabel);

    // Delete button
    let deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "✕";
    deleteBtn.onclick = () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    };

    li.appendChild(checkbox);
    li.appendChild(info);
    li.appendChild(deleteBtn);
    list.appendChild(li);
  });
}

// ── PERSISTENCE ───────────────────────────────────────────────────────────

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  let saved = localStorage.getItem("tasks");
  if (saved) {
    tasks = JSON.parse(saved).map(t => ({
      ...t,
      due: t.due ? new Date(t.due) : null
    }));
    renderTasks();
  }
}

loadTasks();