import { useState } from "react";
import {
  ChevronRight,
  Target,
  Book,
  Trophy,
  RefreshCw,
  PartyPopper,
  Ellipsis,
  CalendarCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const [hoverButton, setHoverButton] = useState(null);
  const navigate = useNavigate();

  const features = [
    {
      icon: <Target size={24} />,
      title: "Ready. Set. Quiz!",
      description:
        'Step into the world of brain-teasing questions and fast-paced fun. Tap "Start Quiz" to dive right into a challenge and see how sharp your mind really is!',
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: <Book size={24} />,
      title: "Pick Your Passion",
      description:
        "Whether you're a science geek, movie buff, history lover, or sports fanatic – we've got a quiz for you. Head to \"Choose Category\" and explore topics that match your vibe.",
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: <Trophy size={24} />,
      title: "Climb the Leaderboard",
      description:
        "Think you've got what it takes to be a QuizWhiz champion? Play smart, score high, and check out the Leaderboard to see where you stand among other quiz masters!",
      color: "bg-orange-100 text-orange-600",
    },
    {
        icon: <CalendarCheck size={24} />,
        title: "Daily Quiz Challenge",
        description: "Jump into a fresh quiz every day with new categories and earn double points. Test your skills, level up faster, and stay sharp!",
        color: "bg-blue-100 text-blue-600",
      },      
    {
      icon: <RefreshCw size={24} />,
      title: "Always Something New",
      description:
        "New questions. Fresh challenges. Different categories. Every visit is a chance to learn, play, and top your last score.",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: <PartyPopper size={24} />,
      title: "Let the Games Begin!",
      description:
        "Join the fun, test your brain, and show the world you're the ultimate QuizWhiz. Are you in?",
      color: "bg-pink-100 text-pink-600",
    },
  ];

  const categories = [
    { name: "Science", emoji: "🔬", color: "bg-blue-500" },
    { name: "Movies", emoji: "🎬", color: "bg-purple-500" },
    { name: "History", emoji: "📜", color: "bg-amber-500" },
    { name: "Sports", emoji: "⚽", color: "bg-green-500" },
    { name: "Music", emoji: "🎵", color: "bg-pink-500" },
    { name: "& Many More.", emoji: <Ellipsis />, color: "bg-cyan-500" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-blue-600 font-bold text-xl mr-3">
              Q
            </div>
            <span className="font-bold text-xl">QuizWhiz</span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              className="px-3 py-1 rounded-md hover:bg-blue-700 transition"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <button
              className="px-4 py-1 bg-white text-blue-600 font-medium rounded-md hover:bg-blue-50 transition"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Welcome to <span className="text-yellow-300">QuizWhiz</span>
            </h1>
            <p className="text-xl mb-6">Where Knowledge Meets Fun!</p>
            <div className="flex space-x-4">
              <button
                className="px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-blue-800 font-medium rounded-lg transition shadow-lg flex items-center"
                onMouseEnter={() => setHoverButton("start")}
                onMouseLeave={() => setHoverButton(null)}
                onClick={() => {
                  navigate("/quiz/Any%20Category", {
                    state: { name: "Any Category", id: -1 },
                  });
                }}
              >
                Start Demo
                <ChevronRight
                  size={20}
                  className={`ml-1 transform transition-transform ${
                    hoverButton === "start" ? "translate-x-1" : ""
                  }`}
                />
              </button>
              <button
                className="px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-medium rounded-lg transition flex items-center"
                onMouseEnter={() => setHoverButton("explore")}
                onMouseLeave={() => setHoverButton(null)}
                onClick={() => {
                  navigate("/categories");
                }}
              >
                Explore Categories
                <ChevronRight
                  size={20}
                  className={`ml-1 transform transition-transform ${
                    hoverButton === "explore" ? "translate-x-1" : ""
                  }`}
                />
              </button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-72 h-72 md:w-80 md:h-80">
              {/* Animated floating icons */}
              <div
                className="absolute top-4 left-4 w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-2xl animate-bounce"
                style={{ animationDelay: "0.1s" }}
              >
                🧠
              </div>
              <div
                className="absolute top-20 right-0 w-20 h-20 rounded-full bg-purple-500 flex items-center justify-center text-3xl animate-bounce"
                style={{ animationDelay: "0.3s" }}
              >
                ❓
              </div>
              <div
                className="absolute bottom-0 left-16 w-24 h-24 rounded-full bg-yellow-400 flex items-center justify-center text-4xl animate-bounce"
                style={{ animationDelay: "0.5s" }}
              >
                🏆
              </div>
              <div
                className="absolute bottom-16 right-12 w-14 h-14 rounded-full bg-green-400 flex items-center justify-center text-xl animate-bounce"
                style={{ animationDelay: "0.7s" }}
              >
                📚
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Preview */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Popular Quiz Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <div
                key={category.name}
                className="flex flex-col items-center p-6 rounded-xl bg-white shadow-md hover:shadow-lg transition cursor-pointer border border-gray-100"
              >
                <div
                  className={`${category.color} w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-4`}
                >
                  {category.emoji}
                </div>
                <h3 className="font-medium text-gray-800">{category.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Why QuizWhiz?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition"
              >
                <div
                  className={`${feature.color} w-12 h-12 rounded-full flex items-center justify-center mb-4`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to test your knowledge?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of players and start your quiz journey today!
          </p>
          <button
            className="px-8 py-4 bg-yellow-400 hover:bg-yellow-300 text-blue-800 font-medium rounded-lg text-lg transition shadow-xl"
            onClick={() => {
              navigate("/dashboard");
            }}
          >
            Start Playing Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-blue-600 font-bold text-sm mr-2">
                Q
              </div>
              <span className="font-bold text-white">QuizWhiz</span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-white transition">
                About
              </a>
              <a href="#" className="hover:text-white transition">
                Contact
              </a>
            </div>
          </div>
          <div className="mt-8 text-center text-sm">
            &copy; {new Date().getFullYear()} QuizWhiz. All rights reserved
            @Divyanshu.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
