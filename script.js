window.onload = function () {
  const quizData = {
    under10: [
      { q: "What color is the sky?", options: ["Blue", "Red", "Green", "Yellow"], answer: "Blue" },
      { q: "How many legs does a dog have?", options: ["2", "4", "3", "6"], answer: "4" },
      { q: "What does ‘meow’ come from?", options: ["Cat", "Dog", "Cow", "Bird"], answer: "Cat" },
      { q: "2 + 2 = ?", options: ["3", "4", "5", "6"], answer: "4" },
      { q: "Which is a fruit?", options: ["Apple", "Car", "Table", "Chair"], answer: "Apple" }
    ],
    "10to19": [
      { q: "H2O is …?", options: ["Hydrogen", "Helium", "Water", "Oxygen"], answer: "Water" },
      { q: "Which planet is red?", options: ["Earth", "Mars", "Jupiter", "Venus"], answer: "Mars" },
      { q: "Which sport uses a bat?", options: ["Cricket", "Soccer", "Tennis", "Swimming"], answer: "Cricket" },
      { q: "7 days = … weeks?", options: ["0.5", "1", "2", "7"], answer: "1" },
      { q: "Sun rises in the …?", options: ["East", "West", "North", "South"], answer: "East" }
    ],
    "20to29": [
      { q: "HTML stands for?", options: ["HyperText Markup Language", "HotText Markup language", "HyperTool Markup language", "HomeText Mark language"], answer: "HyperText Markup Language" },
      { q: "CSS is for …", options: ["Structure", "Styling", "Logic", "Storage"], answer: "Styling" },
      { q: "JS is a …", options: ["Language", "Drink", "Framework", "Database"], answer: "Language" },
      { q: "<a> tag is for …", options: ["Link", "Image", "Paragraph", "Table"], answer: "Link" },
      { q: "JavaScript by …", options: ["Microsoft", "Google", "Netscape", "Mozilla"], answer: "Netscape" }
    ],
    "30plus": [
      { q: "Capital of India?", options: ["Mumbai", "Delhi", "Chennai", "Kolkata"], answer: "Delhi" },
      { q: "Currency of USA?", options: ["Euro", "Dollar", "Rupee", "Yen"], answer: "Dollar" },
      { q: "Earth revolves around …", options: ["Mars", "Moon", "Sun", "Venus"], answer: "Sun" },
      { q: "Heart pumps …", options: ["Blood", "Air", "Water", "Bone"], answer: "Blood" },
      { q: "CO2 is absorbed by …", options: ["Rain", "Plants", "Sun", "Rocks"], answer: "Plants" }
    ]
  };

  const ageGroup = localStorage.getItem("ageGroup");
  if (!ageGroup) {
    window.location.href = "index.html";
  }

  const questions = quizData[ageGroup];
  let current = 0, score = 0;

  const topicTitle = document.getElementById("topicTitle");
  topicTitle.textContent = `${{
    under10: "Under 10 Quiz",
    "10to19": "Age 10–19 Quiz",
    "20to29": "Age 20–29 Quiz",
    "30plus": "Age 30+ Quiz"
  }[ageGroup]}`;

  const questionBox = document.getElementById("questionBox");
  const resultBox = document.getElementById("resultBox");

  function loadQuestion() {
    const q = questions[current];
    questionBox.innerHTML = `<h3 style="margin-bottom: 1rem;">Q${current + 1}: ${q.q}</h3>`;

    q.options.forEach((opt, index) => {
      const div = document.createElement("div");
      div.className = "option";

      const input = document.createElement("input");
      input.type = "radio";
      input.name = "option";
      input.id = `opt${index}`;
      input.value = opt;
      input.disabled = !!q.userAnswer;

      const label = document.createElement("label");
      label.htmlFor = `opt${index}`;
      label.textContent = opt;
      label.style.marginLeft = "10px";

      div.appendChild(input);
      div.appendChild(label);

      if (q.userAnswer) {
        if (opt === q.answer) div.classList.add("correct");
        else if (opt === q.userAnswer) div.classList.add("wrong");
        if (opt === q.userAnswer) input.checked = true;
      }

      div.onclick = () => {
        if (q.userAnswer) return;
        input.checked = true;
        selectAnswer(div, opt);
      };

      questionBox.appendChild(div);
    });
  }

  function selectAnswer(div, selected) {
    const q = questions[current];
    if (q.userAnswer) return;
    q.userAnswer = selected;
    if (selected === q.answer) {
      div.classList.add("correct");
      score++;
    } else {
      div.classList.add("wrong");
      [...questionBox.querySelectorAll(".option")].forEach(d => {
        if (d.textContent.includes(q.answer)) d.classList.add("correct");
      });
    }
  }

  document.getElementById("nextBtn").onclick = () => {
    if (!questions[current].userAnswer) return alert("Please select an answer!");
    current++;
    current < questions.length ? loadQuestion() : showResult();
  };

  document.getElementById("prevBtn").onclick = () => {
    if (current > 0) {
      current--;
      loadQuestion();
    }
  };

  function showResult() {
    questionBox.innerHTML = "";
    resultBox.classList.remove("hidden");
    document.querySelector('.nav-buttons').classList.add("hidden");

    const percent = Math.round((score / questions.length) * 100);
    let msg = "";

    if (ageGroup === "under10") {
      msg = "You've done a good job, keep going!";
    } else if (ageGroup === "10to19") {
      msg = "Great work!";
    } else {
      msg = "Nice effort!";
    }

    resultBox.innerHTML = `
      <h3>Your Score: ${percent}%</h3>
      <p style="margin-bottom: 10px;">${msg}</p>
      <p><em>Fetching a joke for you...</em></p>
      <div id="jokeContainer"></div>
    `;

    // Restart button (only one)
    const restartBtn = document.createElement("button");
    restartBtn.id = "restartBtn";
    restartBtn.textContent = "Restart Quiz";
    restartBtn.style.marginTop = "20px";
    restartBtn.style.padding = "10px 20px";
    restartBtn.style.borderRadius = "10px";
    restartBtn.style.border = "none";
    restartBtn.style.background = "#111827";
    restartBtn.style.color = "white";
    restartBtn.style.cursor = "pointer";

    restartBtn.onmouseover = () => restartBtn.style.background = "#2563eb";
    restartBtn.onmouseout = () => restartBtn.style.background = "#111827";

    restartBtn.onclick = function () {
      localStorage.removeItem("ageGroup");
      window.location.href = "index.html";
    };

    resultBox.appendChild(restartBtn);

    // Fetch joke
    fetch("https://v2.jokeapi.dev/joke/Any?type=single")
      .then(res => res.json())
      .then(data => {
        const joke = data.joke || "Why don’t programmers like nature? It has too many bugs.";
        document.getElementById("jokeContainer").innerHTML =
          `<p style="margin-top: 1rem;"><strong>🤣 Joke:</strong> ${joke}</p>`;
      })
      .catch(() => {
        document.getElementById("jokeContainer").innerHTML =
          `<p style="margin-top: 1rem;"><strong>🤣 Joke:</strong> Why did the web developer go broke? Because he used up all his cache!</p>`;
      });
  }

  loadQuestion();
};
