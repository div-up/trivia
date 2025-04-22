import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const Login = ({ setIsAuthenticated }) => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const [hoverButton, setHoverButton] = useState(null);

  useEffect(() => {
    setIsLogin(location.pathname === "/login");
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 transition-all duration-300">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-800">
            <span className="text-yellow-400">QuizWhiz</span>
          </h1>
          <p className="text-gray-600 mt-2">
            {isLogin
              ? "Log in to continue your quiz journey."
              : "Join the knowledge adventure"}
          </p>
        </div>

        {isLogin ? (
          <LoginForm
            setHoverButton={setHoverButton}
            hoverButton={hoverButton}
            setIsAuthenticated={setIsAuthenticated}
          />
        ) : (
          <SignUp
            setHoverButton={setHoverButton}
            hoverButton={hoverButton}
            setIsAuthenticated={setIsAuthenticated}
          />
        )}

        <div className="text-center mt-6">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              const newPath = isLogin ? "/signup" : "/login";
              navigate(newPath);
            }}
            className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
            onMouseEnter={() => setHoverButton("switch")}
            onMouseLeave={() => setHoverButton(null)}
          >
            {isLogin
              ? "Need an account? Sign up"
              : "Already have an account? Log in"}
          </button>
        </div>
      </div>
    </div>
  );
};

const LoginForm = ({ setHoverButton, hoverButton, setIsAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await api.post(
        "/auth/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setIsAuthenticated(true);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err.response?.data);
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="mb-6">
        <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-colors"
          placeholder="you@example.com"
          required
        />
      </div>

      <div className="mb-6">
        <label
          htmlFor="password"
          className="block text-gray-700 font-medium mb-2"
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-colors"
          placeholder="••••••••"
          required
          minLength="8"
        />
      </div>

      <div className="flex items-center justify-between mb-6"></div>

      <button
        type="submit"
        className={`w-full bg-yellow-400 hover:bg-yellow-300 text-blue-800 font-medium py-3 rounded-lg transition-colors shadow-md flex items-center justify-center ${
          isLoading ? "opacity-70 cursor-not-allowed" : ""
        }`}
        onMouseEnter={() => setHoverButton("login")}
        onMouseLeave={() => setHoverButton(null)}
        disabled={isLoading}
      >
        {isLoading ? (
          "Logging in..."
        ) : (
          <>
            <span>Login</span>
            <ChevronRight
              size={20}
              className={`ml-1 transform transition-transform ${
                hoverButton === "login" ? "translate-x-1" : ""
              }`}
            />
          </>
        )}
      </button>
    </form>
  );
};

const SignUp = ({ setHoverButton, hoverButton, setIsAuthenticated }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await api.post(
        "/auth/register",
        {
          name,
          email,
          password,
        }
      );

      // Store the token in localStorage or context
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setIsAuthenticated(true);
      // Redirect to home or dashboard
      navigate("/dashboard");
    } catch (err) {
      // Handle errors
      console.error("Registration error:", err.response?.data);
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="mb-6">
        <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
          Full Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-colors"
          placeholder="John Doe"
          required
        />
      </div>

      <div className="mb-6">
        <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-colors"
          placeholder="you@example.com"
          required
        />
      </div>

      <div className="mb-6">
        <label
          htmlFor="password"
          className="block text-gray-700 font-medium mb-2"
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-colors"
          placeholder="••••••••"
          minLength="6"
          required
        />
        <p className="text-xs text-gray-500 mt-2">
          Password must be at least 6 characters
        </p>
      </div>

      <div className="mb-6">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="terms"
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            required
          />
          <label htmlFor="terms" className="ml-2 text-gray-600 text-sm">
            I agree to the{" "}
            <a href="#" className="text-blue-600 hover:text-blue-800">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-600 hover:text-blue-800">
              Privacy Policy
            </a>
          </label>
        </div>
      </div>

      <button
        type="submit"
        className={`w-full bg-yellow-400 hover:bg-yellow-300 text-blue-800 font-medium py-3 rounded-lg transition-colors shadow-md flex items-center justify-center ${
          isLoading ? "opacity-70 cursor-not-allowed" : ""
        }`}
        onMouseEnter={() => setHoverButton("signup")}
        onMouseLeave={() => setHoverButton(null)}
        disabled={isLoading}
      >
        {isLoading ? (
          "Creating Account..."
        ) : (
          <>
            <span>Create Account</span>
            <ChevronRight
              size={20}
              className={`ml-1 transform transition-transform ${
                hoverButton === "signup" ? "translate-x-1" : ""
              }`}
            />
          </>
        )}
      </button>
    </form>
  );
};

export default Login;
