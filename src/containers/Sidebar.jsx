import React, { useState, useEffect } from "react";
import { Home, Grid, Award, Settings, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

// Import the CSS file for mobile styling
import "../App.css";

const Sidebar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const location = useLocation();

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsMenuOpen(false); // Close mobile menu when switching to desktop
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const tabs = [
    { name: "Dashboard", icon: <Home size={20} />, path: "/dashboard" },
    { name: "Categories", icon: <Grid size={20} />, path: "/categories" },
    { name: "Leaderboard", icon: <Award size={20} />, path: "/leaderboard" },
    { name: "Settings", icon: <Settings size={20} />, path: "/settings" },
  ];

  const handleLogout = async () => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (err) {
      console.error("Logout API error:", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {/* Mobile top bar */}
      {isMobile && (
        <div className="mobile-topbar">
          <div className="topbar-logo" onClick={toggleMenu}>
            Q
          </div>
          <div className="topbar-title" onClick={() => navigate("/dashboard")}>
            Quiz<span className="text-yellow-400">Whiz</span>
          </div>
          <div className="topbar-spacer"></div>
        </div>
      )}

      {/* Regular sidebar for desktop / Slide-in sidebar for mobile */}
      <div
        className={`sidebar ${isMobile ? "mobile-sidebar" : ""} ${
          isMenuOpen ? "menu-open" : ""
        }`}
      >
        {!isMobile && (
          <div className="sidebar-header">
            <div className="logo-container">
              <div className="logo">Q</div>
              <span className="logo-text">QuizWhiz</span>
            </div>
          </div>
        )}

        <nav className="sidebar-nav">
          <ul>
            {tabs.map((tab) => (
              <li key={tab.name}>
                <button
                  className={location.pathname === tab.path ? "active" : ""}
                  onClick={() => {
                    navigate(tab.path);
                    if (isMobile) {
                      setIsMenuOpen(false);
                    }
                  }}
                >
                  <span className="icon">{tab.icon}</span>
                  <span className="text">{tab.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="user-section">
          <div className="user-avatar">
            <User size={20} />
          </div>
          <div className="user-info">
            <div className="user-name">{user?.name}</div>
            <div className="logout" onClick={handleLogout}>
              Logout
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for closing sidebar when clicking outside in mobile mode */}
      {isMobile && isMenuOpen && (
        <div className="sidebar-overlay" onClick={toggleMenu}></div>
      )}
    </>
  );
};

export default Sidebar;