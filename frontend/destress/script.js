
// go back

const genPopup = document.querySelectorAll(".popup");
const backButtons = document.querySelectorAll(".back-button");

backButtons.forEach(button => {
    button.addEventListener("click", () => {
        const popup = button.closest(".popup");
        popup.style.display = "none";
    });
});


// breathe section

const breathePage = document.getElementById("breathe-popup");
const breatheButton = document.getElementById("breathe-button");

breatheButton.addEventListener("click", () => {
    breathePage.style.display = "flex";
});

// bounce section

const bouncePage = document.getElementById("bounce-popup");
const bounceButton = document.getElementById("bounce-button");

bounceButton.addEventListener("click", () => {
    bouncePage.style.display = "flex";
});

const square = document.querySelector("#bounce-popup .square");

function getRandomColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r}, ${g}, ${b})`;
}

square.addEventListener("click", () => {
  square.style.backgroundColor = getRandomColor();
});

// wave section

const wavePage = document.getElementById("wave-popup");
const waveButton = document.getElementById("wave-button");
const waveVideo = document.getElementById("wave-video");
const waveAudio = document.getElementById("wave-audio");
const waveBackButton = wavePage.querySelector(".back-button");

const waveToggle = document.getElementById("wave-toggle");
const waveOptionsContainer = document.getElementById("wave-options");

const waveVideos = [
    "Waves",
    "pixels-bw",
    "ascii-blue"
];

waveVideos.forEach(name => {
    const btn = document.createElement("button");
    btn.classList.add("wave-option");
    btn.textContent = name; // text on bubble
    btn.addEventListener("click", () => {
        waveVideo.src = `resources/ocean/${name.toLowerCase()}.mp4`;
        waveVideo.play();
        toggleWaveOptions(false); // collapse
    });
    waveOptionsContainer.appendChild(btn);
});

function toggleWaveOptions(show) {
    const options = waveOptionsContainer.querySelectorAll(".wave-option");
    options.forEach((btn, i) => {
        if (show) {
            setTimeout(() => btn.classList.add("show"), i * 50);
        } else {
            btn.classList.remove("show");
        }
    });
}

// Open wave popup with video & audio fade-in
waveButton.addEventListener("click", () => {
    wavePage.style.display = "flex";
    waveVideo.play();

    waveAudio.src = "resources/ocean/wave-audio.mp3";
    waveAudio.load();
    waveAudio.volume = 0; // start muted
    waveAudio.play();

    let fadeDuration = 2000; // 2 secs
    let fadeSteps = 20;
    let stepTime = fadeDuration / fadeSteps;
    let currentStep = 0;

    let fadeInterval = setInterval(() => {
        currentStep++;
        waveAudio.volume = Math.min(currentStep / fadeSteps, 1);
        if (currentStep >= fadeSteps) clearInterval(fadeInterval);
    }, stepTime);
});

waveBackButton.addEventListener("click", () => {
    wavePage.style.display = "none";

    waveVideo.pause();
    waveVideo.currentTime = 0;

    waveAudio.pause();
    waveAudio.currentTime = 0;
    waveAudio.src = "";
    waveAudio.load();
    toggleWaveOptions(false); // hide bubbles
});

waveToggle.addEventListener("click", () => {
    const anyVisible = Array.from(waveOptionsContainer.children).some(
        btn => btn.classList.contains("show")
    );
    toggleWaveOptions(!anyVisible);
});

// stretch section

const stretchPage = document.getElementById("stretch-popup");
const stretchButton = document.getElementById("stretch-button");

stretchButton.addEventListener("click", () => {
    stretchPage.style.display = "flex";
});

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
let remainingTime = 0;
let stretchStartTime = 0;
let isPaused = false;
let totalDuration = 0;

const stretchStep = document.getElementById("stretch-step");
const stretchDesc = document.getElementById("stretch-description");
const nextStretchButton = document.getElementById("next-stretch");
const pauseButton = document.getElementById("pause-stretch");
const skipButton = document.getElementById("skip-stretch");
const backButton = document.querySelector("#stretch-popup .back-button");
const progressBar = document.getElementById("stretch-progress-bar");

function updateProgressBar() {
    if (!isPaused) {
        const elapsed = totalDuration - remainingTime + (Date.now() - stretchStartTime);
        let progress = (elapsed / totalDuration) * 100;

        if (progress > 100) progress = 100;
        progressBar.style.width = progress + "%";

        if (progress < 100) {
            requestAnimationFrame(updateProgressBar);
        }
    }
}

function showStretch(index, duration = null) {
    if (index < stretches.length) {
        const stretch = stretches[index];
        stretchStep.textContent = stretch.name;
        stretchDesc.textContent = stretch.description;

        remainingTime = duration || stretch.duration;
        stretchStartTime = Date.now();
        isPaused = false;

        pauseButton.style.display = "inline-block";
        skipButton.style.display = "inline-block";
        nextStretchButton.style.display = "none";

        // reset progress bar
        progressBar.style.width = "0%";
        requestAnimationFrame(updateProgressBar);

        // start timer
        stretchTimeout = setTimeout(() => {
            currentStretch++;
            showStretch(currentStretch);
        }, remainingTime);
    } else {
        stretchStep.textContent = "Congratulations!";
        stretchDesc.textContent = "You're done for now.";
        nextStretchButton.style.display = "";
        nextStretchButton.textContent = "Go again";
        pauseButton.style.display = "none";
        skipButton.style.display = "none";
        progressBar.style.width = "0%";
        currentStretch = 0;
    }
}


nextStretchButton.addEventListener("click", () => {
    nextStretchButton.style.display = "none";
    showStretch(currentStretch);
});

// pause / resume
pauseButton.addEventListener("click", () => {
    if (!isPaused) {
        // pause timer
        clearTimeout(stretchTimeout);
        remainingTime -= (Date.now() - stretchStartTime);
        pauseButton.textContent = "Resume";
        isPaused = true;
    } else {
        // resume timer
        stretchStartTime = Date.now();
        stretchTimeout = setTimeout(() => {
            currentStretch++;
            showStretch(currentStretch);
        }, remainingTime);
        pauseButton.textContent = "Pause";
        isPaused = false;
        requestAnimationFrame(updateProgressBar);
    }
});


skipButton.addEventListener("click", () => {
    clearTimeout(stretchTimeout);
    currentStretch++;
    showStretch(currentStretch);
});

backButton.addEventListener("click", () => {
    clearTimeout(stretchTimeout);
    currentStretch = 0;

    nextStretchButton.style.display = "inline-block";
    nextStretchButton.textContent = "Next";

    pauseButton.style.display = "none";
    pauseButton.textContent = "Pause";

    skipButton.style.display = "none";

    stretchStep.textContent = "Got five minutes?";
    stretchDesc.textContent = 'Click "Next" to start stretching.';
    progressBar.style.width = "0%";
});