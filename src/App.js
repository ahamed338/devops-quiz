import React, { useState, useEffect } from "react";
import questionsData from "./questions.json";
import "./App.css";

function App() {
  const [tool, setTool] = useState("Terraform");
  const [question, setQuestion] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [askedIds, setAskedIds] = useState([]);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const loadQuestion = () => {
    const filtered = questionsData.filter(
      (q) => q.tool === tool && !askedIds.includes(q.id)
    );

    if (filtered.length === 0) {
      setAskedIds([]);
      setQuestion(null);
      setFeedback("🎉 You've answered all questions for this tool! Starting over...");
      return;
    }

    const random = filtered[Math.floor(Math.random() * filtered.length)];
    setQuestion(random);
    setFeedback("");
    setAskedIds([...askedIds, random.id]);
  };

  useEffect(() => {
    setAskedIds([]);
    setScore({ correct: 0, total: 0 });
    loadQuestion();
  }, [tool]);

  const handleAnswer = (option) => {
    if (!question) return;

    if (option === question.answer) {
      setFeedback("✅ Correct!");
      setScore({ correct: score.correct + 1, total: score.total + 1 });
    } else {
      setFeedback(`❌ Wrong! Correct answer: ${question.answer}`);
      setScore({ correct: score.correct, total: score.total + 1 });
    }
  };

  return (
    <div className="App">
      <h1>DevOps Quiz</h1>

      <div className="controls">
        <label>Select Tool: </label>
        <select value={tool} onChange={(e) => setTool(e.target.value)}>
          <option>Terraform</option>
          <option>Kubernetes</option>
          <option>Helm</option>
          <option>Ansible</option>
          <option>Azure DevOps</option>
          <option>GitHub</option>
        </select>
      </div>

      <div className="score">
        Score: {score.correct} / {score.total}
      </div>

      {question && (
        <div className="question-card">
          <h2>{question.question}</h2>
          {question.options.map((opt, idx) => (
            <button key={idx} onClick={() => handleAnswer(opt)}>
              {opt}
            </button>
          ))}
          <p className="feedback">{feedback}</p>
          <button className="next-btn" onClick={loadQuestion}>
            Next Question
          </button>
        </div>
      )}

      {!question && feedback && <p className="feedback">{feedback}</p>}

      <div className="last-updated">
        Last Updated: {new Date(process.env.REACT_APP_BUILD_TIME).toLocaleString()}
      </div>
    </div>
  );
}

export default App;
