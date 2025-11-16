const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public")); // serve frontend from /public

console.log("Learning Multiverse backend starting…");

// Simple offline generator (no OpenAI needed)
function buildMultiverse(topic, level) {
  const levelText = level || "student";

  return {
    story: `Once upon a time, a curious ${levelText} wanted to understand "${topic}", but every textbook felt flat. So Learning Multiverse opened a portal to a new classroom where the concept came alive through characters, colours and conversation.`,
    simple: `"${topic}" might sound complicated, but it's really just an idea we can break into a few easy steps. Imagine explaining it to your younger sibling using simple words and real-life examples.`,
    technical: `From a more formal perspective, "${topic}" can be described using the correct terminology and logical structure expected at ${levelText} level. You would define key terms, outline the main process or concept, and link it to related ideas in the curriculum.`,
    analogy: `Think of "${topic}" like running a tiny factory: different parts have different jobs, but together they create something useful. If one part stops working, the whole system is affected — just like in the real concept.`,
    quiz: [
      {
        question: `Which option best describes "${topic}" in this multiverse?`,
        options: [
          "A magical spell from a fantasy story",
          "A scientific or academic idea we can learn in different styles",
          "A type of snack you eat after school",
          "A new social media app"
        ],
        answer: "A scientific or academic idea we can learn in different styles"
      },
      {
        question: `Why might "${topic}" feel confusing for some students at first?`,
        options: [
          "It uses new words and symbols",
          "It doesn't always include stories or visuals",
          "It feels disconnected from real life examples",
          "All of the above"
        ],
        answer: "All of the above"
      }
    ]
  };
}

app.post("/api/generate", (req, res) => {
  const { topic, level } = req.body;

  if (!topic) {
    return res.status(400).json({ error: "Topic is required" });
  }

  // Always succeed with locally generated content
  const multiverse = buildMultiverse(topic, level);
  res.json(multiverse);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
