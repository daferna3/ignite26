const mainHomeBtn = document.getElementById("main-home-btn");
const backButtons = document.querySelectorAll(".back-button");
const popups = document.querySelectorAll(".popup");

function openPopup(id) {
    document.getElementById(id).style.display = "flex";
    mainHomeBtn.style.display = "none";
}

function closeAllPopups() {
    popups.forEach(p => p.style.display = "none");
    mainHomeBtn.style.display = "block";
    resetBreathe();
    resetStretch();
    if(waveVideo) { waveVideo.pause(); waveAudio.pause(); }
}

backButtons.forEach(btn => btn.addEventListener("click", closeAllPopups));

// Breathe
const startBreatheBtn = document.getElementById("start-breathe-btn");
const breatheStartScreen = document.getElementById("breathe-start-screen");
const breatheExerciseArea = document.getElementById("breathe-exercise-area");

document.getElementById("breathe-button").onclick = () => openPopup("breathe-popup");
startBreatheBtn.onclick = () => {
    breatheStartScreen.style.display = "none";
    breatheExerciseArea.style.display = "block";
    breatheExerciseArea.classList.add("breathe-active");
};

function resetBreathe() {
    breatheStartScreen.style.display = "block";
    breatheExerciseArea.style.display = "none";
    breatheExerciseArea.classList.remove("breathe-active");
}

// Bounce
const square = document.querySelector(".square");
document.getElementById("bounce-button").onclick = () => openPopup("bounce-popup");
square.onclick = () => { square.style.backgroundColor = `rgb(${Math.random()*255},${Math.random()*255},${Math.random()*255})`; };

// Waves
const waveVideo = document.getElementById("wave-video");
const waveAudio = document.getElementById("wave-audio");
const waveToggle = document.getElementById("wave-toggle");
const waveOptionsContainer = document.getElementById("wave-options");

document.getElementById("wave-button").onclick = () => {
    openPopup("wave-popup");
    waveVideo.play();
    waveAudio.play();
};

const waveVideos = ["Waves", "pixels-bw", "ascii-blue"];
waveVideos.forEach(name => {
    const btn = document.createElement("button");
    btn.className = "wave-option";
    btn.textContent = name;
    btn.onclick = () => { waveVideo.src = `resources/ocean/${name.toLowerCase()}.mp4`; waveVideo.play(); };
    waveOptionsContainer.appendChild(btn);
});

waveToggle.onclick = () => {
    waveOptionsContainer.querySelectorAll(".wave-option").forEach((b, i) => {
        setTimeout(() => b.classList.toggle("show"), i * 50);
    });
};

// Stretch
const stretches = [
    { name: "Forearm Stretch", description: "Arms out, palms out. Fingers down.", duration: 15000 },
    { name: "Neck Tilt", description: "Gently pull head toward shoulder.", duration: 12000 },
    { name: "Shoulder Rolls", description: "Roll shoulders backward slowly.", duration: 12000 },
    { name: "All Done!", description: "Take a deep breath and smile.", duration: 0 }
];

let currentStretch = 0, stretchTimeout, stretchStartTime, totalDuration = 0, isPaused = false;
const nextBtn = document.getElementById("next-stretch"), pauseBtn = document.getElementById("pause-stretch"), skipBtn = document.getElementById("skip-stretch"), progressBar = document.getElementById("stretch-progress-bar");

document.getElementById("stretch-button").onclick = () => openPopup("stretch-popup");

function updateProgressBar() {
    if (isPaused || totalDuration === 0) return;
    const elapsed = Date.now() - stretchStartTime;
    const progress = Math.min((elapsed / totalDuration) * 100, 100);
    progressBar.style.width = progress + "%";
    if (progress < 100) requestAnimationFrame(updateProgressBar);
}

function showStretch(index) {
    if (index >= stretches.length) return resetStretch();
    const stretch = stretches[index];
    document.getElementById("stretch-step").textContent = stretch.name;
    document.getElementById("stretch-description").textContent = stretch.description;

    if (stretch.duration > 0) {
        totalDuration = stretch.duration;
        stretchStartTime = Date.now();
        nextBtn.style.display = "none";
        pauseBtn.style.display = "inline-block";
        skipBtn.style.display = "inline-block";
        requestAnimationFrame(updateProgressBar);
        stretchTimeout = setTimeout(() => { currentStretch++; showStretch(currentStretch); }, totalDuration);
    } else {
        nextBtn.style.display = "inline-block"; nextBtn.textContent = "Restart";
        pauseBtn.style.display = "none"; skipBtn.style.display = "none";
        progressBar.style.width = "0%";
    }
}

nextBtn.onclick = () => { if(nextBtn.textContent === "Restart") currentStretch = 0; showStretch(currentStretch); };
skipBtn.onclick = () => { clearTimeout(stretchTimeout); currentStretch++; showStretch(currentStretch); };

function resetStretch() {
    clearTimeout(stretchTimeout); currentStretch = 0; isPaused = false;
    progressBar.style.width = "0%";
    nextBtn.style.display = "inline-block"; nextBtn.textContent = "Next";
    pauseBtn.style.display = "none"; skipBtn.style.display = "none";
}
