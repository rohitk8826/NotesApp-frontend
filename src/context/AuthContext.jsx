import { createContext, useState, useEffect } from "react";
import { setAuthToken } from "../lib/api"; // ✅ import helper

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ track initial load

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user");
      const savedToken = localStorage.getItem("token");

      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        if (savedToken) setAuthToken(savedToken); // ✅ re-attach token
      }
    } catch (err) {
      console.error("Failed to restore auth state:", err);
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));

    if (userData?.token) {
      localStorage.setItem("token", userData.token);
      setAuthToken(userData.token);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setAuthToken(null); // ✅ clear axios header
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
