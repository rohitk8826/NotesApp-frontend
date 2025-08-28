// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useContext } from "react";

import { AuthProvider, AuthContext } from "./context/AuthContext";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Notes from "./pages/Notes";
import AddNote from "./pages/AddNote"; // ✅ new page
import NoteView from "./pages/NoteView"; // ✅ new page
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

function Home() {
  const { user } = useContext(AuthContext);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-6">
      {/* Hero Section */}
      <div className="grid md:grid-cols-2 gap-10 items-center max-w-5xl w-full">
        {/* Illustration */}
        <div className="flex justify-center">
          <img
            src="illustration.svg"
            alt="Notes illustration"
            className="w-72 md:w-96 drop-shadow-lg"
          />
        </div>

        {/* Text */}
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
            Welcome to <span className="text-indigo-600">MERN Notes</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            A simple, fast, and secure way to create, search, and manage your
            personal notes. Built with the MERN stack.
          </p>

          <div className="flex gap-4 justify-center md:justify-start">
            {user ? (
              <a
                href="/notes"
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
              >
                Go to Notes
              </a>
            ) : (
              <>
                <a
                  href="/signup"
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
                >
                  Get Started
                </a>
                <a
                  href="/login"
                  className="px-6 py-3 border border-indigo-600 text-indigo-600 rounded-lg shadow-sm hover:bg-indigo-50 transition"
                >
                  Login
                </a>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-20 max-w-5xl w-full">
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-indigo-200 transition">
          <h3 className="text-lg font-semibold text-indigo-600">
            🔐 Secure Auth
          </h3>
          <p className="text-gray-600 mt-2">
            Your notes are protected with JWT authentication.
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-indigo-200 transition">
          <h3 className="text-lg font-semibold text-indigo-600">
            ⚡ Fast & Easy
          </h3>
          <p className="text-gray-600 mt-2">
            Create, edit, and delete notes instantly with a clean UI.
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-indigo-200 transition">
          <h3 className="text-lg font-semibold text-indigo-600">
            🔍 Search & Filter
          </h3>
          <p className="text-gray-600 mt-2">
            Quickly find notes with powerful search functionality.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-20 text-gray-400 text-sm">
        © {new Date().getFullYear()} MERN Notes. Built with ❤️ using React &
        Node.js.
      </footer>
    </div>
  );
}

function AppRoutes() {
  const { loading } = useContext(AuthContext);

  if (loading) {
    // Splash while restoring user
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-indigo-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />

        {/* Notes listing */}
        <Route
          path="/notes"
          element={
            <ProtectedRoute>
              <Notes />
            </ProtectedRoute>
          }
        />

        {/* Add note (must be before :id route) */}
        <Route
          path="/notes/new"
          element={
            <ProtectedRoute>
              <AddNote />
            </ProtectedRoute>
          }
        />

        {/* Single note view */}
        <Route
          path="/notes/:id"
          element={
            <ProtectedRoute>
              <NoteView />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />

        {/* Toast notifications */}
        <Toaster
          position="bottom-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#333",
              color: "#fff",
              borderRadius: "8px",
            },
            success: {
              style: { background: "#22c55e", color: "#fff" },
            },
            error: {
              style: { background: "#ef4444", color: "#fff" },
            },
          }}
        />
      </Router>
    </AuthProvider>
  );
}
