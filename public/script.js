const topicInput = document.getElementById("topicInput");
const levelSelect = document.getElementById("levelSelect");
const generateBtn = document.getElementById("generateBtn");
const statusEl = document.getElementById("status");
const cardsEl = document.getElementById("cards");
const resultTitle = document.getElementById("resultTitle");

generateBtn.addEventListener("click", async () => {
  const topic = topicInput.value.trim();
  const level = levelSelect.value;

  if (!topic) {
    statusEl.textContent = "Please enter a topic.";
    return;
  }

  statusEl.textContent = "Generating your learning universes...";
  resultTitle.textContent = "";          // clear previous title
  generateBtn.disabled = true;
  cardsEl.innerHTML = "";

  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ topic, level }),
    });

    const data = await res.json();

    if (!res.ok) {
      statusEl.textContent = data.error || "Something went wrong.";
      return;
    }

    statusEl.textContent = `Here are your universes for "${topic}":`;
    resultTitle.textContent = `Multiverse for "${topic}" · ${level}`;  // <-- new
    showCards(data);
  } catch (err) {
    console.error(err);
    statusEl.textContent = "Network error. Is the server running?";
  } finally {
    generateBtn.disabled = false;
  }
});

function showCards(multiverse) {
  cardsEl.innerHTML = "";

  addCard("Story Version", multiverse.story);
  addCard("Simple Version", multiverse.simple);
  addCard("Technical Explanation", multiverse.technical);
  addCard("Analogy", multiverse.analogy);

  if (Array.isArray(multiverse.quiz)) {
    const quizDiv = document.createElement("div");
    quizDiv.className = "card";
    const title = document.createElement("h2");
    title.textContent = "Quick Quiz";
    quizDiv.appendChild(title);

    multiverse.quiz.forEach((q, index) => {
      const qDiv = document.createElement("div");
      qDiv.className = "quiz-question";

      const qText = document.createElement("p");
      qText.textContent = `${index + 1}. ${q.question}`;
      qDiv.appendChild(qText);

      const ul = document.createElement("ul");
      ul.className = "quiz-options";
      q.options.forEach((opt) => {
        const li = document.createElement("li");
        li.textContent = opt;
        ul.appendChild(li);
      });
      qDiv.appendChild(ul);

      const answer = document.createElement("small");
      answer.textContent = `Answer: ${q.answer}`;
      qDiv.appendChild(answer);

      quizDiv.appendChild(qDiv);
    });

    cardsEl.appendChild(quizDiv);
  }
}

function addCard(title, text) {
  if (!text) return;

  const card = document.createElement("div");
  card.className = "card";

  const h2 = document.createElement("h2");
  h2.textContent = title;

  const p = document.createElement("p");
  p.textContent = text;

  card.appendChild(h2);
  card.appendChild(p);
  cardsEl.appendChild(card);
}
