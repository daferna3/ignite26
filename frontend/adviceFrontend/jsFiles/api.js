// ── api.js ─────────────────────────────────────────────────────────────────
// Calls Groq API directly from the browser — no backend needed.
// ⚠️ For hackathon demo only. Delete this key after the event.

const GROQ_API_KEY = "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"; // 👈 paste your gsk_... key here
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

// ─── Fallback tips (used if Groq API fails) ────────────────────────────────
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

async function callGroq(messages, systemPrompt) {
  const response = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 200,
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Groq error: ${err}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content;
}

// ─── API object used by mood.js and chat.js ────────────────────────────────
const API = {
  async getTip(mood, name = "") {
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
      return { tip, mood, source: "ai" };
    } catch (err) {
      console.warn("Groq failed, using fallback:", err.message);
      return { tip: getFallbackTip(mood), mood, source: "fallback" };
    }
  },

  async chat(message, history = [], name = "") {
    const systemPrompt = `You are a calm, warm, and supportive mental wellness companion${name ? ` talking to ${name}` : ""}.
Help someone who is emotionally overwhelmed or anxious.
Keep replies SHORT — 2 to 4 sentences max. Be human, warm, and grounding.
Always give something actionable they can do right now.
If things sound like a genuine crisis, gently encourage them to speak to someone they trust.
Do not diagnose. Just support.`;

    const messages = [...history, { role: "user", content: message }];

    try {
      const reply = await callGroq(messages, systemPrompt);
      return { reply, history: [...messages, { role: "assistant", content: reply }] };
    } catch (err) {
      console.warn("Groq failed:", err.message);
      return {
        reply: "I'm having trouble connecting. Try taking a slow breath — in for 4, out for 6. You've got this.",
        history,
      };
    }
  },
};