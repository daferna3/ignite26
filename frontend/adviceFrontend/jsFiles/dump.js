// ── dump.js ────────────────────────────────────────────────────────────────
// Brain dump textarea — nothing is saved, just lets users clear their head.

(function () {
  const clearBtn = document.getElementById("clear-dump");
  const dump     = document.getElementById("brain-dump");

  clearBtn.addEventListener("click", () => {
    dump.value = "";
    dump.focus();
  });
})();