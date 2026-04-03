// ── mood.js ────────────────────────────────────────────────────────────────
(function () {
  const moodBtns   = document.querySelectorAll(".mood-btn");
  const tipBox     = document.getElementById("tip-box");
  const tipText    = document.getElementById("tip-text");
  const tipLoader  = document.getElementById("tip-loading");
  const anotherBtn = document.getElementById("another-btn");

  let currentMood = null;

  function getNameInput() {
    return (document.getElementById("user-name")?.value || "").trim();
  }

  function showLoading() {
    tipText.classList.add("hidden");
    tipLoader.classList.remove("hidden");
  }

  function showTip(text) {
    tipLoader.classList.add("hidden");
    tipText.textContent = text;
    tipText.classList.remove("hidden");
  }

  async function fetchTip(mood) {
    showLoading();
    tipBox.classList.remove("hidden");
    try {
      const data = await API.getTip(mood, getNameInput());
      showTip(data.tip);
    } catch {
      showTip("Take a slow breath. In for 4, hold for 2, out for 6. You're not alone.");
    }
  }

  moodBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      moodBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentMood = btn.dataset.mood;
      fetchTip(currentMood);
    });
  });

  anotherBtn.addEventListener("click", () => {
    if (currentMood) fetchTip(currentMood);
  });
})();