import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Bell, FileText, Hourglass, Play, Target } from "lucide-react";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import CardSkeleton from "../skeletons/CardSkeleton";
import { categories } from "../constants";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [gameData, setGameData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dailyChallenge, setDailyChallenge] = useState({
    difficulty: "",
    title: "",
    description: "",
  });
  const [timeLeft, setTimeLeft] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const bellRef = useRef(null);

  const randomCategories = useMemo(() => {
    const shuffled = [...categories].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 6);
  }, []);

  const getTodayDateString = () => {
    return new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
  };

  const getRandomCategory = (excludeId) => {
    let filtered = categories.filter(
      (cat) => cat.id !== excludeId && cat.id !== -1
    );
    return filtered[Math.floor(Math.random() * filtered.length)];
  };

  const handleCategorySelect = ({ name, id }) => {
    navigate(`/quiz/${name}`, {
      state: { name, id, from: "dashboard" },
    });
  };

  const stats = [
    {
      title: "Total Games",
      value: gameData?.quizResults?.length,
      icon: "🎮",
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Accuracy",
      value: `${
        gameData?.quizResults?.length > 0
          ? gameData?.quizResults?.reduce(
              (sum, item) => sum + (item.accuracy || 0),
              0
            ) / gameData?.quizResults?.length
          : 0
      }%`,
      icon: "📊",
      color: "bg-orange-50 text-orange-500",
    },
    {
      title: "Total Score",
      value: gameData?.quizResults?.reduce(
        (acc, curr) => acc + (curr?.score || 0),
        0
      ),
      icon: "🏆",
      color: "bg-purple-50 text-purple-600",
    },
  ];

  const getLeaderboard = useCallback(async (category = null, email = null) => {
    setLoading(true);
    try {
      const params = {};
      if (category) params.category = category;
      if (email) params.email = email;

      const response = await api.get("/game/leaderboard", {
        params,
      });
      setGameData(response?.data);
      setLoading(false);
      return response?.data;
    } catch (error) {
      setLoading(false);
      console.error(
        "Error fetching leaderboard:",
        error.response?.data?.message || error.message
      );
      throw error;
    }
  }, []);

  useEffect(() => {
    if (user?.email) {
      getLeaderboard(null, user?.email);
    }
  }, [getLeaderboard, user?.email]);

  useEffect(() => {
    const today = getTodayDateString();
    const storedData = JSON.parse(localStorage.getItem("dailyChallenge"));

    if (storedData && storedData.date === today) {
      setDailyChallenge(storedData.category);
    } else {
      const yesterdayId = storedData?.category?.id;
      const randomCategory = getRandomCategory(yesterdayId);

      const newData = {
        date: today,
        category: {
          ...randomCategory,
          id: randomCategory?.id,
          difficulty: "medium", // you can customize this
          questions: 10,
          points: 150,
          description: randomCategory.caption,
          title: randomCategory.title,
        },
      };

      localStorage.setItem("dailyChallenge", JSON.stringify(newData));
      setDailyChallenge(newData.category);
    }
  }, []);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);

      const diff = midnight - now;
      const h = String(Math.floor(diff / 36e5)).padStart(2, "0");
      const m = String(Math.floor((diff % 36e5) / 6e4)).padStart(2, "0");
      const s = String(Math.floor((diff % 6e4) / 1000)).padStart(2, "0");

      setTimeLeft(`${h}:${m}:${s}`);
    };

    updateCountdown(); // initial call
    const interval = setInterval(updateCountdown, 1000); // tick every sec

    return () => clearInterval(interval); // cleanup
  }, []);

  useEffect(() => {
    const handleClickOrScroll = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setShowTooltip(false);
      }
    };
    document.addEventListener("mousedown", handleClickOrScroll);
    window.addEventListener("scroll", handleClickOrScroll);
    return () => {
      document.removeEventListener("mousedown", handleClickOrScroll);
      window.removeEventListener("scroll", handleClickOrScroll);
    };
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="contain flex-1 p-6 overflow-y-auto">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome back, {user?.name?.split(" ")[0]}!
            </h1>
            <p className="text-gray-600">Ready for today's trivia challenge?</p>
          </div>

          {/* <div className="relative">
            <button className="p-2 bg-white rounded-full shadow">
              <Bell size={20} className="text-gray-500" />
            </button>
            <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-pink-500"></span>
          </div> */}
          <div className="relative" ref={bellRef}>
            <button
              className="p-2 bg-white rounded-full shadow"
              onClick={() => setShowTooltip((prev) => !prev)}
            >
              <Bell size={20} className="text-gray-500" />
              <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-pink-500" />
            </button>

            {showTooltip && (
              <div
                role="tooltip"
                className="m-2 absolute right-full top-1/2 -translate-y-1/2 ml-2 whitespace-nowrap p-3 text-sm font-medium text-white bg-gray-900 rounded shadow opacity-100"
              >
                Try today’s daily challenge!
              </div>
            )}
          </div>
        </header>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[...Array(3)].map((_, idx) => (
              <CardSkeleton key={idx} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-6 mb-8">
            {stats.map((stat) => (
              <div
                key={stat.title}
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
              >
                <div className="flex justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">{stat.title}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center ${stat.color}`}
                  >
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="bg-blue-600 rounded-lg p-6 text-white shadow-md mb-2">
          <div className="flex flex-wrap justify-end items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center">
                <span className="text-yellow-300 text-lg font-bold mr-2">
                  DAILY CHALLENGE
                </span>
                <span className="bg-yellow-300 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {dailyChallenge?.difficulty}
                </span>
              </div>
              <h2 className="text-2xl font-bold mt-2">
                {dailyChallenge?.title}
                {dailyChallenge?.name && (
                  <span className="text-xl font-semibold text-yellow-100 ml-2">
                    ({dailyChallenge?.name})
                  </span>
                )}
              </h2>

              <p className="mt-1 text-blue-100">
                {dailyChallenge?.description}
              </p>

              <div className="flex mt-4 items-center">
                <div className="flex items-center mr-6">
                  <Hourglass className="mr-1" />
                  <span>{timeLeft}</span>
                </div>
                <div className="flex items-center mr-6">
                  <FileText className="mr-1" />
                  {dailyChallenge?.questions} Q
                </div>
                <div className="flex items-center">
                  <Target className="mr-1" /> {dailyChallenge?.points} P
                </div>
              </div>
            </div>

            <div className="flex">
              <button
                className="bg-white text-blue-600 font-bold py-3 px-6 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2"
                onClick={() => {
                  navigate(`/quiz/${dailyChallenge?.name}`, {
                    state: {
                      name: dailyChallenge?.name,
                      id: dailyChallenge?.id,
                      from: "dashboard",
                    },
                  });
                }}
              >
                <Play size={20} className="text-yellow-500" />
                <span>PLAY NOW</span>
              </button>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Popular Categories
          </h2>
          <div>
            <div className="grid grid-cols-3 gap-6">
              {randomCategories?.map((category) => (
                <div
                  key={category.name}
                  className="bg-blue-50 p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center"
                  onClick={() =>
                    handleCategorySelect({
                      name: category.name,
                      id: category.id,
                    })
                  }
                >
                  <div
                    className={`h-20 w-20 rounded-full cursor-pointer bg-orange-50 flex items-center justify-center text-4xl mb-4 animate-bounce-in-out`}
                  >
                    {category.icon}
                  </div>
                  <h3 className="font-bold text-gray-800">{category.name}</h3>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-6">
              <button
                onClick={() => navigate("/categories")}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Explore More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
