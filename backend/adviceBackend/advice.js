require("dotenv").config();
const express = require("express");
const Anthropic = require("@anthropic-ai/sdk");

const router = express.Router();
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ─── Rule-based fallback tips (used if Claude API fails) ───────────────────
const fallbackAdvice = {
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
    "Splash cold water on your face or hold an ice cube — it resets your system.",
    "Breathe in for 4, hold for 4, out for 8. Repeat 3 times.",
    "It's okay to pause. Pausing is not failing. You're doing what you need to.",
  ],
  stressed: [
    "Write down what's stressing you. Seeing it on paper shrinks it.",
    "Do 10 jumping jacks or shake your arms — release the tension physically.",
    "Ask yourself: will this matter in a week? A year?",
    "Set a 5-minute timer and do nothing but breathe.",
  ],
};

// ─── Helper: get fallback tip ──────────────────────────────────────────────
function getFallbackTip(mood) {
  const key = mood.toLowerCase();
  const list = fallbackAdvice[key] || fallbackAdvice["overwhelmed"];
  return list[Math.floor(Math.random() * list.length)];
}

// ─── POST /api/tips/mood ───────────────────────────────────────────────────
// Body: { mood: "anxious" | "overwhelmed" | "sad" | "breakdown" | "stressed" }
router.post("/mood", async (req, res) => {
  const { mood, name } = req.body;

  if (!mood) {
    return res.status(400).json({ error: "mood is required" });
  }

  const greeting = name ? `for someone named ${name}` : "for someone";

  const systemPrompt = `You are a calm, warm, and supportive mental wellness companion. 
Your job is to give short, actionable, grounding advice to someone who is feeling emotionally distressed.
Keep your response to 2-3 sentences max. Be warm but not patronizing. 
Be practical — give them something they can actually do RIGHT NOW.
Do not give medical diagnoses. Do not suggest calling hotlines unless it's a crisis.
Write in second person ("you"). No bullet points — just flowing, human sentences.`;

  const userPrompt = `The person ${greeting} is currently feeling: ${mood}.
Give them one short, calming, practical tip they can use right now.`;

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 150,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const tip = message.content[0]?.text || getFallbackTip(mood);

    res.json({
      tip,
      mood,
      source: "ai",
    });
  } catch (err) {
    console.error("Claude API error, using fallback:", err.message);
    res.json({
      tip: getFallbackTip(mood),
      mood,
      source: "fallback",
    });
  }
});

// ─── POST /api/tips/chat ───────────────────────────────────────────────────
// Body: { message: "I feel like I'm about to panic", history: [...] }
router.post("/chat", async (req, res) => {
  const { message, history = [], name } = req.body;

  if (!message) {
    return res.status(400).json({ error: "message is required" });
  }

  const systemPrompt = `You are a calm, warm, and supportive mental wellness companion${
    name ? ` talking to ${name}` : ""
  }.
Your role is to help someone who is emotionally overwhelmed or anxious.
Keep each reply SHORT — 2 to 4 sentences max. Be human, warm, and grounding.
Always give something actionable they can do right now.
If things sound like a genuine crisis or emergency, gently encourage them to speak to someone they trust or a professional.
Do not diagnose. Do not lecture. Just support.`;

  // Build message history for multi-turn conversation
  const messages = [
    ...history,
    { role: "user", content: message },
  ];

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 200,
      system: systemPrompt,
      messages,
    });

    const reply = response.content[0]?.text || "I'm here with you. Take a slow breath — in for 4, out for 6. You've got this.";

    res.json({
      reply,
      // Return updated history so the frontend can maintain conversation state
      history: [
        ...messages,
        { role: "assistant", content: reply },
      ],
    });
  } catch (err) {
    console.error("Claude API error:", err.message);
    res.status(500).json({
      reply: "I'm having trouble connecting right now. Try taking a slow breath — in for 4 counts, out for 6. You've got this.",
      history,
    });
  }
});

module.exports = router;