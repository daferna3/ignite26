
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

waveButton.addEventListener("click", () => {
    wavePage.style.display = "flex";
});

// stretch section

const stretchPage = document.getElementById("stretch-popup");
const stretchButton = document.getElementById("stretch-button");

stretchButton.addEventListener("click", () => {
    stretchPage.style.display = "flex";
});