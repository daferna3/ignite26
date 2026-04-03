// ── chat.js ────────────────────────────────────────────────────────────────
// Multi-turn AI chat with conversation history.

(function () {
  const chatWindow = document.getElementById("chat-window");
  const chatInput  = document.getElementById("chat-input");
  const sendBtn    = document.getElementById("chat-send");

  // Conversation history sent to backend for context
  let history = [];

  function getNameInput() {
    return (document.getElementById("user-name")?.value || "").trim();
  }

  function scrollBottom() {
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  function addBubble(text, role = "bot") {
    const div = document.createElement("div");
    div.className = `chat-bubble ${role === "user" ? "user-bubble" : "bot-bubble"}`;
    div.textContent = text;
    chatWindow.appendChild(div);
    scrollBottom();
    return div;
  }

  function addTypingIndicator() {
    const div = document.createElement("div");
    div.className = "chat-bubble typing-bubble";
    div.innerHTML = `<span class="dot"></span><span class="dot"></span><span class="dot"></span>`;
    chatWindow.appendChild(div);
    scrollBottom();
    return div;
  }

  async function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    chatInput.value = "";
    chatInput.disabled = true;
    sendBtn.disabled = true;

    addBubble(text, "user");
    const typing = addTypingIndicator();

    try {
      const data = await API.chat(text, history, getNameInput());
      history = data.history; // keep conversation context
      typing.remove();
      addBubble(data.reply, "bot");
    } catch {
      typing.remove();
      addBubble("I'm having a little trouble connecting. Take a slow breath — I'm still here. 🌿", "bot");
    }

    chatInput.disabled = false;
    sendBtn.disabled = false;
    chatInput.focus();
  }

  sendBtn.addEventListener("click", sendMessage);
  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
})();