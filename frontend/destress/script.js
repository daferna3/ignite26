// Navigation logic
const homeBtn = document.getElementById("main-home-btn");
const backButtons = document.querySelectorAll(".back-button");
const popups = document.querySelectorAll(".popup");

function openPopup(id) {
    document.getElementById(id).style.display = "flex";
    homeBtn.style.display = "none"; // Hide home button when in popup
}

function closeAllPopups() {
    popups.forEach(p => p.style.display = "none");
    homeBtn.style.display = "block"; // Show home button when back in menu
    
    // Stop all media/timers
    resetBreathe();
    resetStretch();
    stopWaves();
}

backButtons.forEach(btn => btn.addEventListener("click", closeAllPopups));

// Breathe logic
const breatheBtn = document.getElementById("breathe-button");
const startBreatheBtn = document.getElementById("start-breathe-btn");
const breatheStartScreen = document.getElementById("breathe-start-screen");
const breatheExerciseArea = document.getElementById("breathe-exercise-area");

breatheBtn.addEventListener("click", () => openPopup("breathe-popup"));

startBreatheBtn.addEventListener("click", () => {
    breatheStartScreen.style.display = "none";
    breatheExerciseArea.style.display = "block";
    breatheExerciseArea.classList.add("breathe-active");
});

function resetBreathe() {
    breatheStartScreen.style.display = "block";
    breatheExerciseArea.style.display = "none";
    breatheExerciseArea.classList.remove("breathe-active");
}

// Bounce logic
const bounceBtn = document.getElementById("bounce-button");
const square = document.querySelector(".square");

bounceBtn.addEventListener("click", () => openPopup("bounce-popup"));
square.addEventListener("click", () => {
    square.style.backgroundColor = `rgb(${Math.random()*255},${Math.random()*255},${Math.random()*255})`;
});

// Waves logic
const waveBtn = document.getElementById("wave-button");
const waveVideo = document.getElementById("wave-video");
const waveAudio = document.getElementById("wave-audio");
const waveToggle = document.getElementById("wave-toggle");
const waveOptionsContainer = document.getElementById("wave-options");

waveBtn.addEventListener("click", () => {
    openPopup("wave-popup");
    waveVideo.play();
    waveAudio.volume = 0;
    waveAudio.play();
    // Fade in audio
    let vol = 0;
    const fade = setInterval(() => {
        vol += 0.05;
        waveAudio.volume = Math.min(vol, 1);
        if (vol >= 1) clearInterval(fade);
    }, 100);
});

function stopWaves() {
    waveVideo.pause();
    waveAudio.pause();
    waveOptionsContainer.querySelectorAll(".wave-option").forEach(b => b.classList.remove("show"));
}

const waveVideos = ["Waves", "pixels-bw", "ascii-blue"];
waveVideos.forEach(name => {
    const btn = document.createElement("button");
    btn.className = "wave-option";
    btn.textContent = name;
    btn.onclick = () => {
        waveVideo.src = `resources/ocean/${name.toLowerCase()}.mp4`;
        waveVideo.play();
        waveOptionsContainer.querySelectorAll(".wave-option").forEach(b => b.classList.remove("show"));
    };
    waveOptionsContainer.appendChild(btn);
});

waveToggle.onclick = () => {
    waveOptionsContainer.querySelectorAll(".wave-option").forEach((b, i) => {
        setTimeout(() => b.classList.toggle("show"), i * 50);
    });
};

// Stretch logic
const stretches = [

    {
        name: "Get ready!",
        description: "These can be done while standing or sitting.\nBe careful not to push yourself too far.\nNo need to time yourself. We'll do it for you.",
        duration: 5000 // 5 seconds
    },
    {
        name: "Let's start small.",
        description: "Put your arms out in front of you with your palms facing out.",
        duration: 5000 // 5 secs
    },
    {
        name: "Very slowly, put your fingers down\none-by-one.",
        description: "You should be feeling a stretch in your forearms.\nDo not force yourself if it hurts.",
        duration: 20000
    },
    {
        name: "Keep your arms where they are.",
        description: "Slowly stick your fingers back up.",
        duration: 15000
    },
    {
        name: "Now for your wrists.",
        description: "Keep one of your arms up. Use your other hand to pull back on your extended fingers until you feel a gentle stretch.",
        duration: 20000
    },
    {
        name: "Switch arms.",
        description: "Do the same thing as the previous instructions.",
        duration: 20000 // 20 secs
    },
    {
        name: "Now, gently shake out your wrists.",
        description: null,
        duration: 10000 // 10 secs
    },

    // arm total = 1:50
    // total time = 1:50

    {
        name: "Let's move on to your neck.",
        description: null,
        duration: 5000 // 5 secs
    },
    {
        name: "Put your right arm over your head and touch your left ear.",
        description: "Gently pull your head towards your right shoulder and hold.",
        duration: 15000 // 15 secs
    },
    {
        name: "Now for the other side.",
        description: "Put your left arm over your head and touch your right ear.\nGently pull your head towards your left shoulder and hold.",
        duration: 15000 // 15 secs
    },
    {
        name: "Continuing with the neck.",
        description: "Carefully and slowly, roll your head in a cirular motion.",
        duration: 12000 // 12 secs
    },
    {
        name: "Now for the other side.",
        description: "Roll your head in the opposite direction as before.",
        duration: 13000 // 13 secs
    },

    // neck total = 50 secs
    // total time = 2:40

    {
        name: "Onto the shoulders.",
        description: "Slowly roll your shoulders backwards.\nYou can have your arms down by your side,\nor up and out with your elbows bent.",
        duration: 12000 // 12 secs
    },
    {
        name: "Switch.",
        description: "Roll your shoulders forward.",
        duration: 10000 // 10 secs
    },
    {
        name: "Place your hands behind your head.",
        description: "Squeeze your shoulder blades together and hold.",
        duration: 15000 // 15 secs
    },

    // shoulders and chest = 37 secs
    // total time = ~3:20

    {
        name: "Interlace your fingers and lift your arms over your head.",
        description: "While keeping your elbows straight, press your arms as far back as you can.",
        duration: 15000 // 15 secs
    },
    {
        name: "Keep your arms over your head.",
        description: "Slowly lean to the left and then to the right.",
        duration: 15000 // 15 secs
    },
    {
        name: "Interlace your fingers and bring your arms in front of your body.",
        description: "Stretch and hold.",
        duration: 11000 // 11 secs
    },
    {
        name: "Put your arms behind your back.",
        description: "Stretch and hold.",
        duration: 12000 // 12 secs
    },

    // back = 43 secs
    // total time = 4:00

    {
        name: "Let's move on to your legs.",
        description: "If you're standing and have bad balance, it is recommended to either sit down or find something to hold.",
        duration: 5000 // 5 secs
    },
    {
        name: "Put your left leg out.",
        description: "Flex at your ankle, slowly alternating between pointing your foot up and extending your foot out.",
        duration: 20000 // 20 secs
    },
    {
        name: "Now for your right leg.",
        description: "Flex at your ankle, slowly alternating between pointing your foot up and extending your foot out.",
        duration: 20000 // 20 secs
    },
    {
        name: "Put your feet a shoulder-width apart and hold a squat.",
        description: "If you're using a chair, try to hover over your seat.\nOtherwise, lean against a wall or simply hold it on your own.",
        duration: 15000 // 15 secs
    },
    {
        name: "Gently twist to the right by placing your left hand on your chair or on the outside of your right thigh.",
        description: "Rest your right hand on the chair and look over your right shoulder.",
        duration: 15000 // 15 secs
    },
    {
        name: "Now for the other side.",
        description: "Rest your left hand on the chair and look over your left shoulder.",
        duration: 15000 // 15 secs
    },

    {
        name: "Cross your right foot in front of the left.",
        description: "Keeping your abdominal muscles engaged, hinge forward with a flat back and reach towards your toes.\nHold onto a stable surface for support if needed",
        duration: 20000 // 20 secs
    },
    {
        name: "Last one!",
        description: "Switch legs and hinge forward through the hips with a flat back reaching towards your toes.",
        duration: 20000 // 20 secs
    },

    // leg total: 115 secs
    // total: ~6:00

];

let currentStretch = 0;
let stretchTimeout;
let stretchStartTime;
let totalDuration = 0;
let remainingTime = 0;
let isPaused = false;

const stretchBtn = document.getElementById("stretch-button");
const nextBtn = document.getElementById("next-stretch");
const pauseBtn = document.getElementById("pause-stretch");
const skipBtn = document.getElementById("skip-stretch");
const progressBar = document.getElementById("stretch-progress-bar");

stretchBtn.addEventListener("click", () => openPopup("stretch-popup"));

function updateProgressBar() {
    if (isPaused || totalDuration === 0) return;
    
    const elapsed = Date.now() - stretchStartTime;
    const progress = Math.min((elapsed / totalDuration) * 100, 100);
    progressBar.style.width = progress + "%";
    
    if (progress < 100) {
        requestAnimationFrame(updateProgressBar);
    }
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
        stretchTimeout = setTimeout(() => {
            currentStretch++;
            showStretch(currentStretch);
        }, totalDuration);
    } else {
        nextBtn.style.display = "inline-block";
        nextBtn.textContent = "Restart";
        pauseBtn.style.display = "none";
        skipBtn.style.display = "none";
        progressBar.style.width = "0%";
    }
}

nextBtn.onclick = () => {
    if (nextBtn.textContent === "Restart") currentStretch = 0;
    showStretch(currentStretch);
};

pauseBtn.onclick = () => {
    if (!isPaused) {
        clearTimeout(stretchTimeout);
        remainingTime = totalDuration - (Date.now() - stretchStartTime);
        isPaused = true;
        pauseBtn.textContent = "Resume";
    } else {
        stretchStartTime = Date.now() - (totalDuration - remainingTime);
        stretchTimeout = setTimeout(() => {
            currentStretch++;
            showStretch(currentStretch);
        }, remainingTime);
        isPaused = false;
        pauseBtn.textContent = "Pause";
        requestAnimationFrame(updateProgressBar);
    }
};

skipBtn.onclick = () => {
    clearTimeout(stretchTimeout);
    currentStretch++;
    showStretch(currentStretch);
};

function resetStretch() {
    clearTimeout(stretchTimeout);
    currentStretch = 0;
    isPaused = false;
    totalDuration = 0;
    progressBar.style.width = "0%";
    document.getElementById("stretch-step").textContent = "Got five minutes?";
    document.getElementById("stretch-description").textContent = 'Click "Next" to start stretching.';
    nextBtn.style.display = "inline-block";
    nextBtn.textContent = "Next";
    pauseBtn.style.display = "none";
    skipBtn.style.display = "none";
}