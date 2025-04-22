import React, { useState } from "react";
import Sidebar from "./Sidebar";
import {
  User,
  Mail,
  Lock,
  Save,
  Camera,
  Eye,
  EyeOff,
  Loader,
} from "lucide-react";
import api from "../utils/api";

const Settings = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [userData, setUserData] = useState({
    name: user?.name,
    email: user?.email,
    gender: user?.gender,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [saveStatus, setSaveStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const updateUser = async () => {
    try {
      setSaveStatus("saving");
      setErrorMessage(null);

      const updateData = {};
      if (userData?.name !== user?.name) {
        updateData.name = userData?.name;
      }
      if (userData?.gender !== user?.gender) {
        updateData.gender = userData?.gender;
      }

      if (Object.keys(updateData).length === 0) {
        setSaveStatus(null);
        return;
      }

      const response = await api.patch(
        `/game/update-user/${user?.email}`,
        updateData
      );

      const { email, gender, name, createdAt } = response.data.user;
      localStorage.setItem(
        "user",
        JSON.stringify({ email, gender, name, joined: createdAt })
      );

      setSaveStatus("success");
      setTimeout(() => setSaveStatus(null), 3000);
      return response.data;
    } catch (error) {
      console.error("Error updating user:", error?.message);
      setSaveStatus("error");
      setErrorMessage(error?.message || "Failed to update profile");
      setTimeout(() => {
        setSaveStatus(null);
        setErrorMessage(null);
      }, 5000);
      throw error;
    }
  };

  const updatePassword = async (payload) => {
    try {
      setSaveStatus("saving");
      setErrorMessage(null);

      const response = await api.put("/auth/update-password", payload);

      setSaveStatus("success");
      setUserData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
      setTimeout(() => setSaveStatus(null), 3000);
      return response.data;
    } catch (error) {
      console.error("Error updating password:", error);
      setSaveStatus("error");
      setErrorMessage(error?.message || "Failed to update password");
      setTimeout(() => {
        setSaveStatus(null);
        setErrorMessage(null);
      }, 5000);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (activeTab === "profile") {
      await updateUser();
    } else if (activeTab === "security") {
      await updatePassword({
        email: userData?.email,
        currentPassword: userData?.currentPassword,
        newPassword: userData?.newPassword,
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const dateModifier = (str) => {
    return new Date(str).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  const getInitials = (fullName) => {
    const names = fullName.trim().split(" ");
    return names
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="contain flex-1 p-6 overflow-y-auto">
        <div className="min-h-screen ">
          {/* Header */}
          <header className="bg-blue-800 text-white py-6 shadow-lg">
            <div className="container mx-auto px-4">
              <h1 className="text-3xl md:text-4xl font-bold text-center">
                Account <span className="text-yellow-400">Settings</span>
              </h1>
              <p className="text-center text-blue-200 mt-2">
                Manage your QuizWhiz profile
              </p>
            </div>
          </header>

          {/* Main Content */}
          <main className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Settings Navigation Tabs */}
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`px-6 py-4 text-sm font-medium flex items-center ${
                    activeTab === "profile"
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <User size={18} className="mr-2" />
                  Profile Information
                </button>
                <button
                  onClick={() => setActiveTab("security")}
                  className={`px-6 py-4 text-sm font-medium flex items-center ${
                    activeTab === "security"
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Lock size={18} className="mr-2" />
                  Security
                </button>
              </div>

              {/* Settings Content */}
              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  {/* Profile Picture Column */}
                  <div className="md:w-1/3 ">
                    <div className="flex flex-col items-center">
                      <div className="relative">
                        <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-6xl font-semibold border-4 border-blue-200">
                          {getInitials(userData?.name)}
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold mt-4">
                        {userData.name}
                      </h3>
                      <p className="text-gray-500 text-sm">Quiz Enthusiast</p>

                      <div className="mt-6 bg-blue-50 p-4 rounded-lg w-full">
                        <h4 className="font-medium text-blue-800 mb-2">
                          Profile Stats
                        </h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Member Since:</span>
                            <span className="font-medium">
                              {dateModifier(user?.joined)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Settings Form Column */}
                  <div className="md:w-2/3">
                    {activeTab === "profile" && (
                      <form onSubmit={handleSubmit}>
                        <h2 className="text-xl font-semibold mb-6">
                          Profile Information
                        </h2>

                        <div className="mb-6">
                          <label
                            htmlFor="name"
                            className="block text-gray-700 font-medium mb-2"
                          >
                            Full Name
                          </label>
                          <div className="relative">
                            <User
                              size={18}
                              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            />
                            <input
                              type="text"
                              id="name"
                              name="name"
                              value={userData.name}
                              onChange={handleInputChange}
                              className="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-colors"
                            />
                          </div>
                        </div>

                        <div className="mb-6">
                          <label
                            htmlFor="email"
                            className="block text-gray-700 font-medium mb-2"
                          >
                            Email Address
                          </label>
                          <div className="relative">
                            <Mail
                              size={18}
                              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            />
                            <input
                              type="email"
                              id="email"
                              name="email"
                              value={userData.email}
                              disabled
                              className="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-100 text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-colors cursor-not-allowed"
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Contact support to change your email address
                          </p>
                        </div>

                        <div className="mb-6">
                          <label
                            htmlFor="gender"
                            className="block text-gray-700 font-medium mb-2"
                          >
                            Gender
                          </label>
                          <select
                            id="gender"
                            name="gender"
                            value={userData.gender}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-colors"
                          >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                            <option value="prefer not to say">
                              Prefer not to say
                            </option>
                          </select>
                        </div>

                        <div className="mt-8">
                          <button
                            type="submit"
                            className="px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-blue-800 font-medium rounded-lg transition-colors shadow-md flex items-center"
                            disabled={
                              (user?.name === userData?.name &&
                                user?.gender === userData?.gender) ||
                              saveStatus === "saving"
                            }
                          >
                            {saveStatus === "saving" ? (
                              <>
                                <Loader
                                  size={18}
                                  className="mr-2 animate-spin"
                                />
                                Saving...
                              </>
                            ) : (
                              <>
                                <Save size={18} className="mr-2" />
                                Save Changes
                              </>
                            )}
                          </button>

                          {saveStatus === "success" && (
                            <p className="text-green-600 mt-2">
                              Profile updated successfully!
                            </p>
                          )}

                          {saveStatus === "error" && (
                            <p className="text-red-600 mt-2">{errorMessage}</p>
                          )}
                        </div>
                      </form>
                    )}

                    {activeTab === "security" && (
                      <form onSubmit={handleSubmit}>
                        <h2 className="text-xl font-semibold mb-6">
                          Change Password
                        </h2>

                        <div className="mb-6">
                          <label
                            htmlFor="currentPassword"
                            className="block text-gray-700 font-medium mb-2"
                          >
                            Current Password
                          </label>
                          <div className="relative">
                            <Lock
                              size={18}
                              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            />
                            <input
                              type={showPassword ? "text" : "password"}
                              id="currentPassword"
                              name="currentPassword"
                              value={userData.currentPassword}
                              onChange={handleInputChange}
                              className="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-colors"
                              placeholder="••••••••"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            >
                              {showPassword ? (
                                <EyeOff size={18} />
                              ) : (
                                <Eye size={18} />
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="mb-6">
                          <label
                            htmlFor="newPassword"
                            className="block text-gray-700 font-medium mb-2"
                          >
                            New Password
                          </label>
                          <div className="relative">
                            <Lock
                              size={18}
                              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            />
                            <input
                              type={showPassword ? "text" : "password"}
                              id="newPassword"
                              name="newPassword"
                              value={userData.newPassword}
                              onChange={handleInputChange}
                              className="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-colors"
                              placeholder="••••••••"
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Password must be at least 8 characters
                          </p>
                        </div>

                        <div className="mb-6">
                          <label
                            htmlFor="confirmPassword"
                            className="block text-gray-700 font-medium mb-2"
                          >
                            Confirm New Password
                          </label>
                          <div className="relative">
                            <Lock
                              size={18}
                              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            />
                            <input
                              type={showPassword ? "text" : "password"}
                              id="confirmPassword"
                              name="confirmPassword"
                              value={userData.confirmPassword}
                              onChange={handleInputChange}
                              className="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-colors"
                              placeholder="••••••••"
                            />
                          </div>
                          <p className="text-xs text-red-600 mt-1">
                            {userData?.confirmPassword &&
                              userData?.newPassword !==
                                userData?.confirmPassword && (
                                <p className="text-xs text-red-600 mt-1">
                                  Confirm Password is different from New
                                  Password
                                </p>
                              )}
                          </p>
                        </div>

                        <div className="mt-8">
                          <button
                            type="submit"
                            className="px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-blue-800 font-medium rounded-lg transition-colors shadow-md flex items-center"
                            disabled={
                              !userData?.currentPassword ||
                              !userData?.newPassword ||
                              !userData?.confirmPassword ||
                              userData?.newPassword !==
                                userData?.confirmPassword ||
                              saveStatus === "saving"
                            }
                          >
                            {saveStatus === "saving" ? (
                              <>
                                <Loader
                                  size={18}
                                  className="mr-2 animate-spin"
                                />
                                Updating...
                              </>
                            ) : (
                              <>
                                <Save size={18} className="mr-2" />
                                Update Password
                              </>
                            )}
                          </button>

                          {saveStatus === "success" && (
                            <p className="text-green-600 mt-2">
                              Password updated successfully!
                            </p>
                          )}

                          {saveStatus === "error" && (
                            <p className="text-red-600 mt-2">{errorMessage}</p>
                          )}
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Settings;
