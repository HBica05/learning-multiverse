const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public")); // serve frontend files from /public

async function generateMultiverse(topic, level) {
  const prompt = `
You are a friendly teacher. Take the topic "${topic}" for a ${level} student
and explain it in multiple learning styles.

Return ONLY valid JSON in this exact format:

{
  "story": "a short story-based explanation",
  "simple": "an easy, ELI5-style explanation",
  "technical": "a more formal, detailed explanation",
  "analogy": "a real-world analogy that makes it intuitive",
  "quiz": [
    {
      "question": "question text",
      "options": ["A", "B", "C", "D"],
      "answer": "A"
    }
  ]
}
`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini", // or another chat model you have access to
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    }),
  });

  const data = await response.json();
  const content = data.choices[0].message.content;
  return JSON.parse(content);
}

app.post("/api/generate", async (req, res) => {
  const { topic, level } = req.body;

  if (!topic) {
    return res.status(400).json({ error: "Topic is required" });
  }

  try {
    const result = await generateMultiverse(topic, level || "high school");
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate learning multiverse" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
