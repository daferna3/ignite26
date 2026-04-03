require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// ─── Rule-based fallback tips (used if Groq API fails) ─────────────────────
const fallbackTips = {
  anxious: [
    "Take 5 slow breaths — inhale for 4 seconds, hold for 2, exhale for 6.",
    "Name 5 things you can see, 4 you can touch, 3 you can hear.",
    "Place one hand on your chest and focus on the rise and fall.",
    "You are safe right now. The feeling will pass.",
  ],
  overwhelmed: [
    "Stop everything. Pick just ONE small task — nothing else.",
    "Write down every thought crowding your head. Get it out of your mind.",
    "You don't have to do it all at once. One breath, one step.",
    "Step outside for 2 minutes. Fresh air resets your nervous system.",
  ],
  sad: [
    "It's okay to feel this. You don't have to fix it right now.",
    "Reach out to one person — even a simple 'hey' counts.",
    "Put on a song that comforts you. Let yourself feel it.",
    "Drink a warm drink slowly. Small comforts matter.",
  ],
  breakdown: [
    "Step away immediately. You need space right now.",
    "Splash cold water on your face — it resets your system.",
    "Breathe in for 4, hold for 4, out for 8. Repeat 3 times.",
    "It's okay to pause. Pausing is not failing.",
  ],
  stressed: [
    "Write down what's stressing you. Seeing it on paper shrinks it.",
    "Do 10 jumping jacks — release the tension physically.",
    "Ask yourself: will this matter in a week? A year?",
    "Set a 5-minute timer and do nothing but breathe.",
  ],
};

function getFallbackTip(mood) {
  const list = fallbackTips[mood.toLowerCase()] || fallbackTips["overwhelmed"];
  return list[Math.floor(Math.random() * list.length)];
}

// ─── Helper: call Groq API ──────────────────────────────────────────────────
async function callGroq(messages, systemPrompt) {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      max_tokens: 200,
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Groq API error: ${err}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content;
}

// ─── POST /api/tips/mood ────────────────────────────────────────────────────
app.post("/api/tips/mood", async (req, res) => {
  const { mood, name } = req.body;
  if (!mood) return res.status(400).json({ error: "mood is required" });

  const greeting = name ? `for someone named ${name}` : "for someone";

  const systemPrompt = `You are a calm, warm, and supportive mental wellness companion. 
Give short, actionable, grounding advice to someone who is emotionally distressed.
Keep your response to 2-3 sentences max. Be warm but not patronizing. 
Give them something they can actually do RIGHT NOW.
Do not give medical diagnoses. Write in second person ("you"). No bullet points.`;

  try {
    const tip = await callGroq(
      [{ role: "user", content: `The person ${greeting} is currently feeling: ${mood}. Give them one short, calming, practical tip they can use right now.` }],
      systemPrompt
    );

    res.json({ tip, mood, source: "ai" });
  } catch (err) {
    console.error("Groq API error, using fallback:", err.message);
    res.json({ tip: getFallbackTip(mood), mood, source: "fallback" });
  }
});

// ─── POST /api/tips/chat ────────────────────────────────────────────────────
app.post("/api/tips/chat", async (req, res) => {
  const { message, history = [], name } = req.body;
  if (!message) return res.status(400).json({ error: "message is required" });

  const systemPrompt = `You are a calm, warm, and supportive mental wellness companion${name ? ` talking to ${name}` : ""}.
Help someone who is emotionally overwhelmed or anxious.
Keep replies SHORT — 2 to 4 sentences max. Be human, warm, and grounding.
Always give something actionable they can do right now.
If things sound like a genuine crisis, gently encourage them to speak to someone they trust.
Do not diagnose. Just support.`;

  const messages = [...history, { role: "user", content: message }];

  try {
    const reply = await callGroq(messages, systemPrompt);
    res.json({ reply, history: [...messages, { role: "assistant", content: reply }] });
  } catch (err) {
    console.error("Groq API error:", err.message);
    res.status(500).json({
      reply: "I'm having trouble connecting. Try taking a slow breath — in for 4, out for 6. You've got this.",
      history,
    });
  }
});

// ─── Health check ───────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
