import React, { useState, useEffect } from "react";
import questionsData from "./questions.json";
import "./App.css";

function App() {
  const [tool, setTool] = useState("Terraform");
  const [question, setQuestion] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState({ correct: 0, attempted: 0 });
  const [selectedOption, setSelectedOption] = useState(null);
  const [askedQuestions, setAskedQuestions] = useState([]);
  const [buildInfo, setBuildInfo] = useState({ time: '', commit: '', run: '' });

  // Load build info from the global variable
  useEffect(() => {
    if (window.BUILD_INFO) {
      setBuildInfo(window.BUILD_INFO);
    }
  }, []);

  const loadQuestion = () => {
    const filtered = questionsData.filter(
      (q) => q.tool === tool && !askedQuestions.includes(q.id)
    );

    if (filtered.length === 0) {
      alert("🎉 You've answered all questions for this tool! Starting over...");
      setAskedQuestions([]);
      setScore({ correct: 0, attempted: 0 });
      return;
    }

    const random = filtered[Math.floor(Math.random() * filtered.length)];
    setQuestion(random);
    setFeedback("");
    setSelectedOption(null);
    setAskedQuestions((prev) => [...prev, random.id]);
  };

  useEffect(() => {
    loadQuestion();
  }, [tool]);

  const handleAnswer = (option) => {
    setSelectedOption(option);
    const correct = option === question.answer;
    if (correct) {
      setFeedback("✅ Correct!");
      setScore((prev) => ({
        ...prev,
        correct: prev.correct + 1,
        attempted: prev.attempted + 1,
      }));
    } else {
      setFeedback(`❌ Wrong! Correct answer: ${question.answer}`);
      setScore((prev) => ({ ...prev, attempted: prev.attempted + 1 }));
    }
  };

  const getButtonClass = (option) => {
    if (!selectedOption) return "";
    if (option === question.answer) return "correct";
    if (option === selectedOption && option !== question.answer) return "wrong";
    return "";
  };

  return (
    <div className="App">
      <h1>DevOps Quiz</h1>
      <label>Select Tool: </label>
      <select value={tool} onChange={(e) => setTool(e.target.value)}>
        <option>Terraform</option>
        <option>Kubernetes</option>
        <option>Helm</option>
        <option>Ansible</option>
        <option>Git</option>
        <option>GitHub Administration</option>
        <option>Datadog</option>
      </select>

      <p className="score">
        Score: {score.correct} / {score.attempted}
      </p>

      {question && (
        <div className="question-card">
          <h2>{question.question}</h2>
          {question.options.map((opt, idx) => (
            <button
              key={idx}
              className={getButtonClass(opt)}
              onClick={() => handleAnswer(opt)}
              disabled={!!selectedOption}
            >
              {opt}
            </button>
          ))}
          <p className="feedback">{feedback}</p>
          <button className="next-btn" onClick={loadQuestion}>
            Next Question
          </button>
        </div>
      )}

      {/* Build/deploy date from workflow */}
      <p className="build-time">
        {buildInfo.time ? (
          <>
            Last deployed: {buildInfo.time}
            {buildInfo.commit && <span> (Commit: {buildInfo.commit})</span>}
            {buildInfo.run && <span> - Build #{buildInfo.run}</span>}
          </>
        ) : (
          "Loading build info..."
        )}
      </p>
    </div>
  );
}

export default App;