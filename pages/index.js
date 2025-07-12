import { useEffect, useState } from "react";
import Head from "next/head";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [startQuiz, setStartQuiz] = useState(false);
  const [selected, setSelected] = useState(null);

  // Fetch questions on quiz start
  useEffect(() => {
    if (startQuiz) {
      fetch("/api/quiz")
        .then((res) => res.json())
        .then((data) => setQuestions(data));
    }
  }, [startQuiz]);

  // Timer logic
  useEffect(() => {
    if (!startQuiz || finished) return;
    if (timeLeft === 0) {
      moveToNext();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, startQuiz, finished]);

  // Reset timer on question change
  useEffect(() => {
    setTimeLeft(60);
  }, [current]);

  const handleAnswer = (selectedOption) => {
    if (selected !== null) return; // Prevent double answer

    setSelected(selectedOption);
    if (selectedOption === questions[current].answer) {
      setScore((prev) => prev + 1);
    }

    // Move to next question after delay
    setTimeout(() => {
      setSelected(null);
      moveToNext();
    }, 1500);
  };

  const moveToNext = () => {
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      setFinished(true);
    }
  };

  const startQuizNow = () => {
    setStartQuiz(true);
  };

  const q = questions[current];

  return (
    <>
      <Head>
        <title>{finished ? "Quiz Completed" : "Quiz App | Take a Quiz"}</title>
        <link rel="icon" href="/quizapp.png" />
        <meta name="description" content="Take a quiz and test your knowledge!" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-100 to-white text-gray-800">
        {/* Main Content */}
        <main className="flex-grow flex items-center justify-center p-6">
          <AnimatePresence mode="wait">
            {!startQuiz ? (
              // Landing Page
              <motion.div
                key="landing"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                className="text-center max-w-xl"
              >
                <img src="/quizapp.png" alt="Quiz Logo" className="mx-auto w-24 h-24 mb-6" />
                <h1 className="text-4xl font-bold mb-4">Welcome to Quiz App</h1>
                <p className="mb-6 text-lg">Test your knowledge with fun and interactive quizzes!</p>
                <button
                  onClick={startQuizNow}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition text-lg"
                >
                  🎯 Take Quiz
                </button>
              </motion.div>
            ) : finished ? (
              // Result Page
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <h2 className="text-3xl font-bold mb-4">🎉 Quiz Finished!</h2>
                <p className="text-xl">Your Score: {score} / {questions.length}</p>
              </motion.div>
            ) : !questions.length ? (
              // Loading
              <p className="text-xl">Loading Questions...</p>
            ) : (
              // Quiz Questions
              <motion.div
                key="quiz"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-white w-full max-w-xl p-8 rounded-2xl shadow-lg"
              >
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${((current + 1) / questions.length) * 100}%` }}
                  ></div>
                </div>

                {/* Timer & Count */}
                <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
                  <span>⏱ {timeLeft}s left</span>
                  <span>Question {current + 1} / {questions.length}</span>
                </div>

                {/* Question */}
                <h2 className="text-xl font-semibold mb-4">{q.question}</h2>

                {/* Options */}
                <div className="grid gap-4">
                  {q.options.map((option, idx) => {
                    const isCorrect = option === q.answer;
                    const isSelected = option === selected;
                    const showFeedback = selected !== null;

                    const buttonStyle = showFeedback
                      ? isSelected && isCorrect
                        ? "bg-green-500 text-white"
                        : isSelected && !isCorrect
                        ? "bg-red-500 text-white"
                        : "bg-white text-gray-800"
                      : "hover:bg-blue-100 bg-white text-gray-800";

                    return (
                      <button
                        key={idx}
                        onClick={() => handleAnswer(option)}
                        className={`px-4 py-3 border rounded-lg transition font-medium ${buttonStyle} ${selected ? "cursor-not-allowed" : ""}`}
                        disabled={selected !== null}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t text-center py-4 text-sm text-gray-600">
          All rights reserved © VRG @2025
        </footer>
      </div>
    </>
  );
}
