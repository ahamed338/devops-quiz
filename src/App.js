import React, { useState, useEffect } from "react";
import questionsData from "./questions.json";
import "./App.css";

function App() {
  const [tool, setTool] = useState("Terraform");
  const [question, setQuestion] = useState(null);
  const [feedback, setFeedback] = useState("");

  // Load a random question
  const loadQuestion = () => {
    const filtered = questionsData.filter(q => q.tool === tool);
    const random = filtered[Math.floor(Math.random() * filtered.length)];
    setQuestion(random);
    setFeedback("");
  };

  useEffect(() => {
    loadQuestion();
  }, [tool]);

  const handleAnswer = (option) => {
    if(option === question.answer) setFeedback("✅ Correct!");
    else setFeedback(`❌ Wrong! Correct answer: ${question.answer}`);
  };

  return (
    <div className="App">
      <h1>DevOps Quiz</h1>
      <label>Select Tool: </label>
      <select value={tool} onChange={e => setTool(e.target.value)}>
        <option>Terraform</option>
        <option>Kubernetes</option>
        <option>Helm</option>
        <option>Ansible</option>
        <option>Azure DevOps</option>
        <option>GitHub</option>
      </select>

      {question && (
        <div className="question-card">
          <h2>{question.question}</h2>
          {question.options.map((opt, idx) => (
            <button key={idx} onClick={() => handleAnswer(opt)}>{opt}</button>
          ))}
          <p>{feedback}</p>
          <button onClick={loadQuestion}>Next Question</button>
        </div>
      )}
    </div>
  );
}

export default App;
