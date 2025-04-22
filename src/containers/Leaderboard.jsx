import React, { useCallback, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import {
  Medal,
  Trophy,
  Award,
  Clock,
  Search,
  Filter,
  ChevronDown,
} from "lucide-react";
import api from "../utils/api";
import LeaderboardSkeleton from "../skeletons/LeaderboardSkeleton";

const Leaderboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [activeTab, setActiveTab] = useState("all-time");
  const [searchQuery, setSearchQuery] = useState("");
  const [leaderBoardData, setLeaderBoardData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getLeaderboard = useCallback(async (category = null, email = null) => {
    setLoading(true);
    try {
      const params = {};
      if (category) params.category = category;
      if (email) params.email = email;

      const response = await api.get("/game/leaderboard", {
        params,
      });
      const formatLeaderboardWithRank = (data) => {
        const withScores = data.map((player) => ({
          ...player,
          totalScore: player.quizResults?.reduce(
            (sum, q) => sum + (q.score || 0),
            0
          ),
        }));
        const sorted = [...withScores].sort(
          (a, b) => b.totalScore - a.totalScore
        );
        let lastScore = null;
        let lastRank = 0;
        let actualRank = 0;

        const withRanks = sorted.map((player) => {
          actualRank++;
          if (player.totalScore === lastScore) {
            return { ...player, rank: lastRank };
          } else {
            lastScore = player.totalScore;
            lastRank = actualRank;
            return { ...player, rank: lastRank };
          }
        });
        return withRanks;
      };
      const rankedData = formatLeaderboardWithRank(response?.data);
      setLeaderBoardData(rankedData);
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

  const myDetails = leaderBoardData?.find((item) => item?.name === user?.name);

  const topUser = leaderBoardData?.[0];
  const pointsAway = topUser?.totalScore - myDetails?.totalScore;
  // Points away from top
  const totalPlayers = leaderBoardData?.length || 1;
  const percentile = ((myDetails?.rank || 1) / totalPlayers) * 100;
  const topPercentage = 100 - percentile;

  // Quizzes to next rank
  const bestScore = myDetails?.quizResults?.length
    ? Math.max(...myDetails.quizResults.map((q) => q.score || 0))
    : 0;

  useEffect(() => {
    getLeaderboard();
  }, [getLeaderboard]);

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy className="text-yellow-400" size={24} />;
      case 2:
        return <Medal className="text-gray-400" size={24} />;
      case 3:
        return <Medal className="text-amber-700" size={24} />;
      default:
        return (
          <span className="text-gray-500 font-bold w-6 text-center">
            {rank}
          </span>
        );
    }
  };

  const filteredData = leaderBoardData?.filter((player) =>
    player?.name?.toLowerCase()?.includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="contain flex-1 p-6 overflow-y-auto">
        <div className="min-h-screen">
          {/* Header Section */}
          <header className="bg-blue-800 text-white py-6 shadow-lg">
            <div className="container mx-auto px-4">
              <h1 className="text-3xl md:text-4xl font-bold text-center">
                Top Minds of <span className="text-yellow-400">QuizWhiz</span>
              </h1>
              <p className="text-center text-blue-200 mt-2">
                See how you stack up against the best trivia players
              </p>
            </div>
          </header>

          {/* Main Content */}
          {loading ? (
            <LeaderboardSkeleton />
          ) : (
            <main className="container mx-auto px-4 py-8">
              {/* Filters and Search */}
              <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  {/* Time Period Tabs */}
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setActiveTab("all-time")}
                      className={`px-4 py-2 rounded-md transition ${
                        activeTab === "all-time"
                          ? "bg-blue-600 text-white"
                          : "text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      All Time
                    </button>
                    {/* <button
                    onClick={() => setActiveTab("monthly")}
                    className={`px-4 py-2 rounded-md transition ${
                      activeTab === "monthly"
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setActiveTab("weekly")}
                    className={`px-4 py-2 rounded-md transition ${
                      activeTab === "weekly"
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Weekly
                  </button> */}
                  </div>

                  {/* Search Bar */}
                  <div className="relative">
                    <Search
                      size={20}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      placeholder="Search players..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                {/* Category Filter */}
                {/* <div className="mt-4 flex flex-wrap gap-2">
                <div className="relative inline-block">
                  <button className="flex items-center px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
                    <Filter size={16} className="mr-2" />
                    <span>Categories</span>
                    <ChevronDown size={16} className="ml-2" />
                  </button>
                </div>

                <div className="inline-flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    All
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                    Science
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                    History
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                    Entertainment
                  </span>
                </div>
              </div> */}
              </div>

              {/* Leaderboard Table */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
                <div className="p-4 bg-blue-50 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-blue-800 flex items-center">
                    <Trophy size={24} className="mr-2 text-yellow-500" />
                    Leaderboard Rankings
                    <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {activeTab === "all-time"
                        ? "All Time"
                        : activeTab === "monthly"
                        ? "Monthly"
                        : "Weekly"}
                    </span>
                  </h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        {[
                          "Rank",
                          "Player",
                          "Total Score",
                          "Quizzes",
                          "Accuracy",
                        ].map((heading) => (
                          <th
                            key={heading}
                            className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {heading}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredData?.map((player) => (
                        <tr
                          key={player.rank}
                          className={player.rank <= 3 ? "bg-blue-50" : ""}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center justify-center">
                              {getRankIcon(player.rank)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center justify-center">
                              {/* <div className="flex-shrink-0 h-10 w-10">
                              <img
                                className="h-10 w-10 rounded-full"
                                src={player.avatar}
                                alt={player.name}
                              />
                            </div> */}
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {player.name}
                                </div>
                                {player.rank <= 3 && (
                                  <div className="text-xs text-blue-600 flex items-center">
                                    <Award size={12} className="mr-1" />
                                    {player.rank === 1
                                      ? "Quiz Master"
                                      : player.rank === 2
                                      ? "Knowledge Expert"
                                      : "Trivia Pro"}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center justify-center text-sm font-bold text-gray-900">
                              {player?.totalScore}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center justify-center text-sm text-gray-500">
                              {player?.quizResults?.length}
                            </div>
                          </td>
                          <td className="flex items-center justify-center px-6 py-4 whitespace-nowrap">
                            <span
                              className={`w-11 px-2 py-1 flex items-center justify-center text-xs leading-5 font-semibold rounded-full ${
                                player.accuracy >= 90
                                  ? "bg-green-100 text-green-800"
                                  : player.accuracy >= 80
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {player?.quizResults?.length > 0
                                ? player?.quizResults?.reduce(
                                    (sum, item) => sum + (item.accuracy || 0),
                                    0
                                  ) / player?.quizResults?.length
                                : 0}
                              %
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredData?.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No players found matching your search
                  </div>
                )}
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[
                  {
                    title: "Your Rank",
                    icon: <Trophy size={24} />,
                    stat: `#${myDetails?.rank}`,
                    description: `You're in the top ${Math.round(
                      topPercentage
                    )}% of all players!`,
                    color: "bg-blue-100 text-blue-800",
                  },
                  {
                    title: "Your Total Score",
                    icon: <Award size={24} />,
                    stat: myDetails?.totalScore,
                    description:
                      pointsAway > 0
                        ? `${pointsAway} points away from #1`
                        : "You're at the top!",
                    color: "bg-yellow-100 text-yellow-800",
                  },
                  {
                    title: "Your Best Quiz Score",
                    icon: <Clock size={24} />,
                    stat: bestScore,
                    description: "Keep aiming to beat your high score!",
                    color: "bg-green-100 text-green-800",
                  },
                ].map(({ title, icon, stat, description, color }, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-md p-6"
                  >
                    <div className="flex items-center">
                      <div className={`p-3 rounded-full ${color} mr-4`}>
                        {icon}
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">{title}</div>
                        <div className="text-2xl font-bold text-gray-900">
                          {stat}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 text-sm text-gray-500">
                      {description}
                    </div>
                  </div>
                ))}
              </div>
            </main>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
