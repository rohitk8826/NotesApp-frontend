// src/pages/Login.jsx
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/notes");
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await api.post("/auth/login", { email, password });
      login(data); // ✅ AuthContext now handles token & localStorage
      navigate("/notes");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 border border-indigo-100">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Welcome Back 👋
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold text-white bg-indigo-600 transition ${
              loading ? "opacity-70 cursor-not-allowed" : "hover:bg-indigo-700"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-500">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-indigo-600 font-medium hover:underline cursor-pointer"
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}
