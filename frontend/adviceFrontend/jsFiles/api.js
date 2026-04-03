// ── api.js ─────────────────────────────────────────────────────────────────
const BASE_URL = "http://localhost:3001/api";

const API = {
  async getTip(mood, name = "") {
    const res = await fetch(`${BASE_URL}/tips/mood`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mood, name }),
    });
    if (!res.ok) throw new Error("Failed to fetch tip");
    return res.json();
  },

  async chat(message, history = [], name = "") {
    const res = await fetch(`${BASE_URL}/tips/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, history, name }),
    });
    if (!res.ok) throw new Error("Failed to get chat response");
    return res.json();
  },
};