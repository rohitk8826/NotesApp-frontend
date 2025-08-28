import { useContext, useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { NotebookPen } from "lucide-react"; // ✅ Lucide icon for brand

function MenuToggle({ isOpen, toggle }) {
  return (
    <button
      onClick={toggle}
      aria-label={isOpen ? "Close menu" : "Open menu"}
      className="md:hidden flex flex-col justify-center items-center w-8 h-8 relative z-50"
    >
      <motion.span
        className="absolute h-0.5 w-6 bg-white rounded"
        animate={isOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -6 }}
        transition={{ duration: 0.3 }}
      />
      <motion.span
        className="absolute h-0.5 w-6 bg-white rounded"
        animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.2 }}
      />
      <motion.span
        className="absolute h-0.5 w-6 bg-white rounded"
        animate={isOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: 6 }}
        transition={{ duration: 0.3 }}
      />
    </button>
  );
}

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkClasses = ({ isActive }) =>
    isActive
      ? "text-indigo-400 font-semibold"
      : "text-gray-200 hover:text-indigo-300 transition";

  return (
    <nav className="bg-indigo-700 text-white px-6 py-4 flex items-center justify-between shadow-lg relative">
      {/* ✅ Brand */}
      <div className="flex items-center gap-2">
        <NotebookPen size={24} className="text-white" />
        <NavLink
          to="/"
          className="font-bold text-xl tracking-wide hover:text-indigo-200"
        >
          MERN Notes
        </NavLink>
      </div>

      {/* ✅ Desktop Menu */}
      <div className="hidden md:flex items-center gap-6">
        <NavLink to="/" className={linkClasses}>
          Home
        </NavLink>
        <NavLink to="/notes" className={linkClasses}>
          Notes
        </NavLink>
        {user ? (
          <>
            <span className="text-indigo-100">Hi, {user.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-1.5 rounded-lg transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className={linkClasses}>
              Login
            </NavLink>
            <NavLink
              to="/signup"
              className="bg-white text-indigo-700 px-4 py-1.5 rounded-lg font-semibold hover:bg-indigo-50 transition"
            >
              Sign Up
            </NavLink>
          </>
        )}
      </div>

      {/* ✅ Mobile Menu Toggle */}
      <MenuToggle isOpen={isOpen} toggle={() => setIsOpen(!isOpen)} />

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ✅ Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute top-full left-0 w-full bg-indigo-700 flex flex-col gap-4 p-6 z-50 md:hidden shadow-lg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <NavLink
              to="/"
              className={linkClasses}
              onClick={() => setIsOpen(false)}
            >
              Home
            </NavLink>
            <NavLink
              to="/notes"
              className={linkClasses}
              onClick={() => setIsOpen(false)}
            >
              Notes
            </NavLink>
            {user ? (
              <>
                <span className="text-indigo-100">Hi, {user.name}</span>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="bg-red-500 hover:bg-red-600 px-4 py-1.5 rounded-lg transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={linkClasses}
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </NavLink>
                <NavLink
                  to="/signup"
                  className="bg-white text-indigo-700 px-4 py-1.5 rounded-lg font-semibold hover:bg-indigo-50 transition"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </NavLink>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
