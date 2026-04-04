function goHome() {
  window.location.href = "../../index.html";
}

// ── TIMER ─────────────────────────────────────────────────────────────────

let time = 300; // 5 minutes in seconds
let defaultTime = 300;
let interval = null;
let circle = null;
let circumference = null;

function setupCircle() {
  const circleEl = document.querySelector(".progress-ring-circle");
  if (!circleEl) return;

  const radius = circleEl.r.baseVal.value;
  circumference = 2 * Math.PI * radius;

  circleEl.style.strokeDasharray = `${circumference}`;
  circleEl.style.strokeDashoffset = `${circumference}`;

  circle = circleEl;
}

let audioUnlocked = false;

function unlockAudio() {
  if (audioUnlocked) return;

  const bg = document.getElementById("bgSound");
  const bell = document.getElementById("bellSound");
  const alarm = document.getElementById("alarmSound");

  [bg, bell, alarm].forEach(a => {
    if (a) {
      a.volume = 0;
      a.play().then(() => {
        a.pause();
        a.currentTime = 0;
      }).catch(() => {});
    }
  });

  audioUnlocked = true;
}

function updateDisplay() {
  let minutes = Math.floor(time / 60);
  let seconds = time % 60;
  let formatted = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

  document.getElementById("time").textContent = formatted;

  let focusTime = document.getElementById("focusTime");
  if (focusTime) focusTime.textContent = formatted;

  // 🔥 Update circle progress
  if (circle && circumference) {
    let progress = time / defaultTime;
    let offset = circumference * (1 - progress);
    circle.style.strokeDashoffset = offset;
  }
}

// Set timer from preset buttons
function setTimer(minutes, btn) {
  pauseTimer();
  time = Math.round(minutes * 60);
  defaultTime = time;
  updateDisplay();

  document.querySelectorAll(".preset-btn")
    .forEach(b => b.classList.remove("active"));

  btn.classList.add("active");
}

// Set timer from custom input
function setCustomTimer() {
  let input = document.getElementById("customMinutes");
  let mins = parseFloat(input.value);
  if (!mins || mins < 0.1) return;

  pauseTimer();
  time = Math.round(mins * 60);
  defaultTime = time;
  updateDisplay();
  input.value = "";

  document.querySelectorAll(".preset-btn").forEach(btn => btn.classList.remove("active"));
}

// Adjust time by +/- minutes (works whether running or paused)
function adjustTime(minutes) {
  time = Math.max(0, time + Math.round(minutes * 60));
  updateDisplay();
}

function playBell() {
  let bell = document.getElementById("bellSound");
  if (bell) {
    console.log("BELL TRIGGERED");
    bell.currentTime = 0;
    bell.volume = 0.6;
    bell.play().catch(err => console.log("BELL ERROR:", err));
  }
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

      // Alarm always plays when timer ends — not optional
      playAlarm();

      // Flash the timer display when done
      document.getElementById("time").classList.add("done");
      setTimeout(() => document.getElementById("time").classList.remove("done"), 3000);

      setTimeout(() => {
        resetTimer();
      }, 4000);
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

let fadeInterval = null;

function toggleSound() {
  let audio = document.getElementById("bgSound");
  let btn = document.getElementById("soundBtn");

  if (soundPlaying) {
    // STOP sound
    if (fadeInterval) clearInterval(fadeInterval);

    audio.pause();
    audio.currentTime = 0;
    btn.textContent = "🔇 Calm Sound";

  } else {
    // START sound with fade
    audio.volume = 0;
    audio.play().catch(() => {});
    btn.textContent = "🔊 Calm Sound";

    let vol = 0;
    fadeInterval = setInterval(() => {
      if (vol < 0.3) {
        vol += 0.05;
        audio.volume = vol;
      } else {
        clearInterval(fadeInterval);
      }
    }, 100);
  }

  soundPlaying = !soundPlaying;
}

// ── FOCUS MODE ─────────────────────────────────────────────────────────────

let focusOn = false;

function toggleFocus() {
  focusOn = !focusOn;

  const focusView = document.getElementById("focusView");
  const mainUI = document.querySelector(".container");

  focusView.classList.toggle("hidden", !focusOn);
  mainUI.style.display = focusOn ? "none" : "grid";

  if (focusOn) {
    setupCircle();      // 👈 initialize circle
  }

  updateFocusTask();
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

  tasks.push({
    text: taskText,
    due: dueDate ? new Date(dueDate) : null,
    completed: false
  });

  // Sort: tasks WITH due dates first (by date), then tasks WITHOUT due dates
  tasks.sort((a, b) => {
    if (a.due && b.due) return a.due - b.due;
    if (a.due) return -1;
    if (b.due) return 1;
    return 0;
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
      let wasCompleted = tasks[index].completed;

      tasks[index].completed = checkbox.checked;

      // Only play when going from incomplete → complete
      if (!wasCompleted && checkbox.checked) {
        playBell();
      }

      saveTasks();
      renderTasks();
      updateFocusTask();
    };

    // Task info wrapper
    let info = document.createElement("div");
    info.className = "task-info";

    // Task text
    let span = document.createElement("span");
    span.className = "task-text";
    span.textContent = task.text;

    // Due date label
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

function updateFocusTask() {
  let focusTask = document.getElementById("focusTask");

  let nextTask = tasks.find(t => !t.completed);

  if (nextTask) {
    focusTask.textContent = nextTask.text;
  } else {
    focusTask.textContent = "You're all caught up 🌿";
  }
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

function playAlarm() {
  let alarm = document.getElementById("alarmSound");
  if (alarm) {
    console.log("ALARM TRIGGERED");
    alarm.currentTime = 0;
    alarm.volume = 0.8;
    alarm.play().catch(err => console.log("ALARM ERROR:", err));
  }
}

document.addEventListener("click", unlockAudio, { once: true });

loadTasks();
updateFocusTask();
