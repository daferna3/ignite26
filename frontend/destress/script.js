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
    if (waveVideo) { waveVideo.pause(); waveAudio.pause(); }
}

backButtons.forEach(btn => btn.addEventListener("click", closeAllPopups));

// --- Breathe ---
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

// --- Bounce ---
const square = document.querySelector(".square");
document.getElementById("bounce-button").onclick = () => openPopup("bounce-popup");
square.onclick = () => { 
    square.style.backgroundColor = `rgb(${Math.random()*255},${Math.random()*255},${Math.random()*255})`; 
};

// --- Waves ---
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
    btn.onclick = () => { 
        waveVideo.src = `resources/ocean/${name.toLowerCase()}.mp4`; 
        waveVideo.play(); 
    };
    waveOptionsContainer.appendChild(btn);
});

waveToggle.onclick = () => {
    waveOptionsContainer.querySelectorAll(".wave-option").forEach((b, i) => {
        setTimeout(() => b.classList.toggle("show"), i * 50);
    });
};

// --- Stretch Data ---
const stretches = [
    { name: "Get ready!", description: "These can be done while standing or sitting.\nBe careful not to push yourself too far.", duration: 5000 },
    { name: "Let's start small.", description: "Put your arms out in front of you with your palms facing out.", duration: 5000 },
    { name: "Very slowly, put your fingers down one-by-one.", description: "You should be feeling a stretch in your forearms.", duration: 20000 },
    { name: "Keep your arms where they are.", description: "Slowly stick your fingers back up.", duration: 15000 },
    { name: "Now for your wrists.", description: "Pull back on your extended fingers until you feel a gentle stretch.", duration: 20000 },
    { name: "Switch arms.", description: "Do the same thing as the previous instructions.", duration: 20000 },
    { name: "Now, gently shake out your wrists.", description: "", duration: 10000 },
    { name: "Let's move on to your neck.", description: "", duration: 5000 },
    { name: "Right arm over head.", description: "Gently pull your head towards your right shoulder.", duration: 15000 },
    { name: "Other side.", description: "Gently pull your head towards your left shoulder.", duration: 15000 },
    { name: "Neck rolls.", description: "Carefully and slowly, roll your head in a circular motion.", duration: 12000 },
    { name: "Switch direction.", description: "Roll your head in the opposite direction.", duration: 13000 },
    { name: "Shoulder rolls.", description: "Slowly roll your shoulders backwards.", duration: 12000 },
    { name: "Forward rolls.", description: "Roll your shoulders forward.", duration: 10000 },
    { name: "Shoulder squeeze.", description: "Squeeze your shoulder blades together and hold.", duration: 15000 },
    { name: "Overhead reach.", description: "Interlace fingers, reach up and back.", duration: 15000 },
    { name: "Side lean.", description: "Slowly lean to the left and then to the right.", duration: 15000 },
    { name: "Front stretch.", description: "Interlace fingers and bring arms in front of body.", duration: 11000 },
    { name: "Back stretch.", description: "Put your arms behind your back. Stretch and hold.", duration: 12000 },
    { name: "Leg stretches.", description: "Hold onto something if your balance is poor.", duration: 5000 },
    { name: "Left ankle flex.", description: "Alternate pointing and flexing your foot.", duration: 20000 },
    { name: "Right ankle flex.", description: "Alternate pointing and flexing your foot.", duration: 20000 },
    { name: "Wall squat / Chair hover.", description: "Hold a squat position.", duration: 15000 },
    { name: "Twist Right.", description: "Look over your right shoulder.", duration: 15000 },
    { name: "Twist Left.", description: "Look over your left shoulder.", duration: 15000 },
    { name: "Toe touch (Right over Left).", description: "Hinge forward with a flat back.", duration: 20000 },
    { name: "Last one! (Left over Right).", description: "Switch legs and hinge forward.", duration: 20000 }
];

// --- Stretch Logic ---
let currentStretch = 0, stretchTimeout, stretchStartTime, totalDuration = 0, isPaused = false;
const nextBtn = document.getElementById("next-stretch");
const pauseBtn = document.getElementById("pause-stretch");
const skipBtn = document.getElementById("skip-stretch");
const progressBar = document.getElementById("stretch-progress-bar");

document.getElementById("stretch-button").onclick = () => {
    openPopup("stretch-popup");
    showStretch(currentStretch);
};

function updateProgressBar() {
    if (isPaused || totalDuration === 0) return;
    const elapsed = Date.now() - stretchStartTime;
    const progress = Math.min((elapsed / totalDuration) * 100, 100);
    progressBar.style.width = progress + "%";
    if (progress < 100) requestAnimationFrame(updateProgressBar);
}

function showStretch(index) {
    if (index >= stretches.length) return resetStretch();
    
    clearTimeout(stretchTimeout);
    isPaused = false;
    pauseBtn.textContent = "Pause";
    progressBar.style.width = "0%";

    const stretch = stretches[index];
    document.getElementById("stretch-step").textContent = stretch.name;
    document.getElementById("stretch-description").textContent = stretch.description || "";

    totalDuration = stretch.duration;
    stretchStartTime = Date.now();
    
    nextBtn.style.display = "none";
    pauseBtn.style.display = "inline-block";
    skipBtn.style.display = "inline-block";
    
    requestAnimationFrame(updateProgressBar);
    stretchTimeout = setTimeout(() => { 
        currentStretch++; 
        showStretch(currentStretch); 
    }, totalDuration);
}

pauseBtn.onclick = () => {
    if (!isPaused) {
        isPaused = true;
        clearTimeout(stretchTimeout);
        pauseBtn.textContent = "Resume";
        const elapsed = Date.now() - stretchStartTime;
        totalDuration -= elapsed; 
    } else {
        isPaused = false;
        pauseBtn.textContent = "Pause";
        stretchStartTime = Date.now();
        requestAnimationFrame(updateProgressBar);
        stretchTimeout = setTimeout(() => { 
            currentStretch++; 
            showStretch(currentStretch); 
        }, totalDuration);
    }
};

skipBtn.onclick = () => { 
    clearTimeout(stretchTimeout); 
    currentStretch++; 
    showStretch(currentStretch); 
};

nextBtn.onclick = () => { 
    if(nextBtn.textContent === "Restart" || nextBtn.textContent === "Start") {
        currentStretch = 0;
    }
    showStretch(currentStretch); 
};

function resetStretch() {
    clearTimeout(stretchTimeout); 
    currentStretch = 0; 
    isPaused = false;
    progressBar.style.width = "0%";
    pauseBtn.textContent = "Pause";
    nextBtn.style.display = "inline-block"; 
    nextBtn.textContent = "Start";
    pauseBtn.style.display = "none"; 
    skipBtn.style.display = "none";
}
