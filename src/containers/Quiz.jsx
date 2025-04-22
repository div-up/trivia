import { useState, useEffect } from "react";
import {
  Clock,
  Award,
  ArrowRight,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronRight,
  LogIn,
  X,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../utils/api";

const Quiz = ({ isAuthenticated }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const location = useLocation();
  // Quiz states
  const [quizState, setQuizState] = useState("intro"); // intro, active, results
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [resultAnimation, setResultAnimation] = useState(false);
  const [quizData, setQuizData] = useState({
    name: `${location?.state?.name} Challenge`,
    totalQuestions: 10,
    estimatedTime: "5 minutes",
  });

  const decodeHtml = (html) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  useEffect(() => {
    if (location?.state?.id) {
      const quizUrl =
        location?.state?.id === -1
          ? `https://opentdb.com/api.php?amount=10`
          : `https://opentdb.com/api.php?amount=10&category=${location?.state?.id}&difficulty=medium`;
      axios
        .get(quizUrl)
        .then((res) => {
          const transformedQuestions = res.data.results.map((item) => {
            const options = [...item.incorrect_answers, item.correct_answer];
            // shuffle options
            const shuffledOptions = options.sort(() => Math.random() - 0.5);

            return {
              question: decodeHtml(item.question),
              options: shuffledOptions.map((opt) => decodeHtml(opt)),
              correctAnswer: decodeHtml(item.correct_answer),
            };
          });

          setQuizData((prev) => ({ ...prev, questions: transformedQuestions }));
        })
        .catch((err) => {
          console.error("Error fetching quiz data:", err);
        });
    }
  }, []);

  const saveQuizResult = async (email, category, score, accuracy) => {
    try {
      const response = await api.post("/game/save-result", {
        email,
        category,
        score,
        accuracy,
      });
      return response.data;
    } catch (error) {
      console.error(
        "Error saving quiz result:",
        error.response?.data?.message || error.message
      );
      throw error;
    }
  };

  // Timer effect
  useEffect(() => {
    let timer;
    if (quizState === "active" && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && quizState === "active") {
      handleNextQuestion();
    }

    return () => clearTimeout(timer);
  }, [timeLeft, quizState]);

  // Handle starting the quiz
  const startQuiz = () => {
    setQuizState("active");
    setTimeLeft(30);
  };

  // Handle answer selection
  const handleAnswerSelect = (answer) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answer);
    setResultAnimation(true);

    const isCorrect =
      answer === quizData.questions[currentQuestion].correctAnswer;

    if (isCorrect) {
      setScore(score + 10);
    }

    setAnswers([
      ...answers,
      {
        questionId: quizData.questions[currentQuestion].id,
        userAnswer: answer,
        correctAnswer: quizData.questions[currentQuestion].correctAnswer,
        isCorrect,
      },
    ]);

    setTimeout(() => {
      setResultAnimation(false);
    }, 1000);
  };

  // Handle moving to next question
  const handleNextQuestion = () => {
    if (currentQuestion < quizData.totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setTimeLeft(30);
    } else {
      saveQuizResult(
        user?.email,
        location?.state?.name,
        score,
        (
          (answers.filter((a) => a.isCorrect)?.length /
            quizData?.totalQuestions) *
          100
        )?.toFixed(0)
      );
      setQuizState("results");
    }
  };

  // Restart the quiz
  const restartQuiz = () => {
    setQuizState("intro");
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setAnswers([]);
    setTimeLeft(30);
  };

  // Format time to mm:ss
  const formatTime = (seconds) => {
    return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(
      seconds % 60
    ).padStart(2, "0")}`;
  };

  // Render intro screen
  const renderIntroScreen = () => (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-xl mx-auto text-center">
      <div className="mb-4 flex justify-center">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
          <Award size={48} className="text-blue-600" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-blue-800 mb-2">{quizData.name}</h2>

      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <div className="flex justify-between items-center mb-3 pb-3 border-b border-blue-100">
          <span className="text-gray-600">Total Questions:</span>
          <span className="font-bold text-blue-800">
            {quizData.totalQuestions}
          </span>
        </div>
        <div className="flex justify-between items-center mb-3 pb-3 border-b border-blue-100">
          <span className="text-gray-600">Time per Question:</span>
          <span className="font-bold text-blue-800">30 seconds</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Estimated Time:</span>
          <span className="font-bold text-blue-800">
            {quizData.estimatedTime}
          </span>
        </div>
      </div>

      <div className="mb-4 py-3 px-4 bg-yellow-100 rounded-lg text-yellow-800 text-sm">
        <div className="flex items-start">
          <AlertCircle size={18} className="mr-2 mt-1 flex-shrink-0" />
          <p className="text-left">
            {!isAuthenticated
              ? "Login to choose a category, set your challenge level, and pick how many questions you want !"
              : "Answer each question within 30 seconds. Each correct answer earns you 10 points. Good luck !"}
          </p>
        </div>
      </div>

      {/* Animated Quiz Mascot */}
      <div className="mb-6 relative h-32">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-20 h-24">
            <div className="absolute w-20 h-20 rounded-full bg-yellow-400 animate-pulse flex items-center justify-center">
              <span className="text-4xl">🧠</span>
            </div>
            <div className="absolute -bottom-4 left-0 right-0 text-center font-medium text-blue-800">
              QuizWhiz
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-8 items-center justify-center">
        <button
          onClick={startQuiz}
          className="px-8 py-3 bg-yellow-400 hover:bg-yellow-300 text-blue-800 font-medium rounded-lg transition shadow-md flex items-center justify-center "
        >
          Start Quiz
          <ChevronRight size={20} className="ml-1" />
        </button>
        <button
          onClick={() => {
            location?.state?.from === "dashboard"
              ? navigate("/dashboard")
              : navigate("/categories");
          }}
          className="px-8 py-3 bg-yellow-400 hover:bg-yellow-300 text-blue-800 font-medium rounded-lg transition shadow-md flex items-center justify-center "
        >
          {!isAuthenticated ? "LogIn" : "Exit"}
          {!isAuthenticated ? (
            <LogIn size={20} className="ml-1" />
          ) : (
            <X size={20} className="ml-1" />
          )}
        </button>
      </div>
    </div>
  );

  // Render active quiz screen
  const renderQuizScreen = () => {
    const currentQ = quizData?.questions[currentQuestion];
    const timerPercentage = (timeLeft / 30) * 100;

    return (
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
        {/* Header with progress and timer */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <span className="bg-blue-100 text-blue-800 font-medium px-3 py-1 rounded-full mr-2">
              Question {currentQuestion + 1}/{quizData.totalQuestions}
            </span>
            <div className="w-32 bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{
                  width: `${
                    ((currentQuestion + 1) / quizData.totalQuestions) * 100
                  }%`,
                }}
              ></div>
            </div>
          </div>

          <div className="flex items-center">
            <Clock size={16} className="text-gray-500 mr-1" />
            <div className="flex items-center mr-2">
              <span
                className={`font-medium ${
                  timeLeft <= 5 ? "text-red-600" : "text-gray-700"
                }`}
              >
                {formatTime(timeLeft)}
              </span>
            </div>
            <div className="w-16 bg-gray-200 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full ${
                  timerPercentage > 60
                    ? "bg-green-600"
                    : timerPercentage > 30
                    ? "bg-yellow-500"
                    : "bg-red-600"
                }`}
                style={{ width: `${timerPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {currentQ?.question}
          </h3>
        </div>

        {/* Answer options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {currentQ?.options?.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isCorrect =
              selectedAnswer !== null && option === currentQ.correctAnswer;

            let optionClass =
              "border border-gray-300 rounded-lg p-4 hover:bg-blue-50 cursor-pointer transition-all";

            if (selectedAnswer !== null) {
              if (isSelected && isCorrect) {
                optionClass =
                  "border-2 border-green-500 bg-green-50 rounded-lg p-4";
              } else if (isSelected && !isCorrect) {
                optionClass =
                  "border-2 border-red-500 bg-red-50 rounded-lg p-4";
              } else if (isCorrect) {
                optionClass =
                  "border-2 border-green-500 bg-green-50 rounded-lg p-4";
              } else {
                optionClass =
                  "border border-gray-300 rounded-lg p-4 opacity-50";
              }
            }

            return (
              <div
                key={index}
                className={optionClass}
                onClick={() => handleAnswerSelect(option)}
              >
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-semibold mr-3">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="flex-grow">{option}</span>

                  {selectedAnswer !== null && isCorrect && (
                    <CheckCircle size={20} className="text-green-600" />
                  )}
                  {isSelected && !isCorrect && (
                    <XCircle size={20} className="text-red-600" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Result animation */}
        {resultAnimation &&
          selectedAnswer ===
            quizData.questions[currentQuestion].correctAnswer && (
            <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-6xl animate-ping text-green-500">+10</div>
            </div>
          )}

        {/* Next button */}
        <div className="flex justify-between items-center">
          <div className="text-lg font-semibold text-blue-800">
            Score: {score}
          </div>

          <button
            onClick={() => handleNextQuestion()}
            disabled={selectedAnswer === null}
            className={`px-6 py-2 rounded-lg flex items-center ${
              selectedAnswer === null
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-yellow-400 hover:bg-yellow-300 text-blue-800 font-medium shadow-md"
            }`}
          >
            {currentQuestion < quizData.totalQuestions - 1
              ? "Next Question"
              : "See Results"}
            <ArrowRight size={18} className="ml-1" />
          </button>
        </div>
      </div>
    );
  };

  // Render results screen
  const renderResultsScreen = () => {
    const correctAnswers = answers.filter((a) => a.isCorrect).length;
    const percentage = (correctAnswers / quizData.totalQuestions) * 100;

    let resultMessage, resultClass;
    if (percentage >= 90) {
      resultMessage = "Outstanding! You're a geography expert!";
      resultClass = "text-green-600";
    } else if (percentage >= 70) {
      resultMessage = "Great job! You know your geography well!";
      resultClass = "text-blue-600";
    } else if (percentage >= 50) {
      resultMessage = "Good effort! Keep exploring the world!";
      resultClass = "text-yellow-600";
    } else {
      resultMessage = "Keep practicing! Geography is a journey!";
      resultClass = "text-red-600";
    }

    return (
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-blue-800 mb-2">
            Quiz Completed!
          </h2>
          <p className={`text-lg font-medium ${resultClass}`}>
            {resultMessage}
          </p>
        </div>

        {/* Score summary */}
        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <div className="text-center mb-4 md:mb-0">
              <div className="text-4xl font-bold text-blue-800">{score}</div>
              <div className="text-gray-600">Total Score</div>
            </div>

            <div className="text-center mb-4 md:mb-0">
              <div className="text-4xl font-bold text-blue-800">
                {correctAnswers}/{quizData.totalQuestions}
              </div>
              <div className="text-gray-600">Correct Answers</div>
            </div>

            <div className="text-center">
              <div className="text-4xl font-bold text-blue-800">
                {percentage.toFixed(0)}%
              </div>
              <div className="text-gray-600">Accuracy</div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className={`h-4 rounded-full ${
                percentage >= 70
                  ? "bg-green-600"
                  : percentage >= 50
                  ? "bg-yellow-500"
                  : "bg-red-600"
              }`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>

        {isAuthenticated ? (
          <>
            {/* Action buttons */}
            <div className="mb-4 flex flex-col md:flex-row gap-4 justify-center">
              <button
                onClick={restartQuiz}
                className="px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-blue-800 font-medium rounded-lg transition shadow-md flex items-center justify-center"
              >
                Try Again
              </button>
              <button
                onClick={() => {
                  navigate("/dashboard");
                }}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition shadow-md flex items-center justify-center"
              >
                Back to Dashboard
              </button>
            </div>

            {/* Questions review */}
            <div className="mb-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Review Quiz
              </h3>

              <div className="space-y-4">
                {answers.map((answer, index) => (
                  <div
                    key={index}
                    className="border rounded-lg overflow-hidden"
                  >
                    <div
                      className={`px-4 py-2 ${
                        answer.isCorrect ? "bg-green-50" : "bg-red-50"
                      } flex items-center`}
                    >
                      <span className="mr-2">
                        {answer.isCorrect ? (
                          <CheckCircle size={18} className="text-green-600" />
                        ) : (
                          <XCircle size={18} className="text-red-600" />
                        )}
                      </span>
                      <span className="font-medium">
                        {quizData.questions[index].question}
                      </span>
                    </div>
                    <div className="px-4 py-3 bg-white">
                      <div className="flex flex-col text-sm">
                        <div className="flex items-center mb-1">
                          <span className="font-medium w-32 text-gray-700">
                            Your Answer:
                          </span>
                          <span
                            className={
                              answer.isCorrect
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {answer.userAnswer}
                          </span>
                        </div>
                        {!answer.isCorrect && (
                          <div className="flex items-center">
                            <span className="font-medium w-32 text-gray-700">
                              Correct Answer:
                            </span>
                            <span className="text-green-600">
                              {answer.correctAnswer}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="mb-4 py-3 px-4 bg-yellow-100 rounded-lg text-yellow-800 text-sm">
              <div className="flex items-start">
                <AlertCircle size={18} className="mr-2 mt-1 flex-shrink-0" />
                <p className="text-left">
                  Log in to take another shot, check your answers, and see where
                  you stand on the leaderboard !
                </p>
              </div>
            </div>
            <div className="mb-4 flex flex-col md:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  navigate("/login");
                }}
                className="px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-blue-800 font-medium rounded-lg transition shadow-md flex items-center justify-center"
              >
                LogIn
                <LogIn size={20} className="ml-1" />
              </button>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 to-blue-900 py-8 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-white">
            <span className="text-yellow-400">Quiz</span>Whiz
          </h1>
        </header>

        {/* Quiz Container */}
        <div className="max-w-6xl mx-auto">
          {quizState === "intro" && renderIntroScreen()}
          {quizState === "active" && renderQuizScreen()}
          {quizState === "results" && renderResultsScreen()}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
