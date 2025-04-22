import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
} from "react-router-dom";
import { useEffect, useState } from "react";
import "./App.css";
import Categories from "./containers/Categories";
import LandingPage from "./containers/LandingPage";
import Leaderboard from "./containers/Leaderboard";
import Login from "./containers/Login";
import Settings from "./containers/Settings";
import Dashboard from "./containers/Dashboard";
import Quiz from "./containers/Quiz";

// Protected route wrapper component
const ProtectedRoute = () => {
  // Check if user is authenticated
  const isAuthenticated = localStorage.getItem("token");
  // If not authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  // If authenticated, render the child routes
  return <Outlet />;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication status on mount and when storage changes
    const checkAuth = () => {
      const hasToken = localStorage.getItem("token");
      setIsAuthenticated(!!hasToken);
    };
    checkAuth();
    // Listen for storage events (if user logs in/out in another tab)
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  const router = createBrowserRouter([
    // Public routes - accessible to all users
    {
      path: "/",
      element: <LandingPage />,
    },
    {
      path: "/login",
      element: <Login setIsAuthenticated={setIsAuthenticated} />,
    },
    {
      path: "/signup",
      element: <Login setIsAuthenticated={setIsAuthenticated} />,
    },
    {
      path: "quiz/:category",
      element: <Quiz isAuthenticated={isAuthenticated} />,
    },
    // Protected routes - require authentication
    {
      element: <ProtectedRoute />,
      children: [
        {
          path: "/dashboard",
          element: <Dashboard />,
        },
        {
          path: "/categories",
          element: <Categories />,
        },
        {
          path: "/leaderboard",
          element: <Leaderboard />,
        },
        {
          path: "/settings",
          element: <Settings />,
        },
        {
          path: "/quiz/:category",
          element: <Quiz isAuthenticated={isAuthenticated} />,
        },
      ],
    },
    // Catch all other routes and redirect to login
    {
      path: "*",
      element: <Navigate to="/login" replace />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;