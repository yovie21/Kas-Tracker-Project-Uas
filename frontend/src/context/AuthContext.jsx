// src/context/AuthContext.jsx
import React, { createContext, useEffect, useState } from "react";
import API, { setToken as setApiToken } from "../api/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // sync axios header & localStorage whenever token changes
    if (token) {
      setApiToken(token);
      localStorage.setItem("token", token);
    } else {
      setApiToken(null);
      localStorage.removeItem("token");
    }
  }, [token]);

  useEffect(() => {
    // on app start, try to fetch /auth/me if token exists and user is null
    const init = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await API.get("/auth/me");
        setUser(res.data.data);
        localStorage.setItem("user", JSON.stringify(res.data.data));
      } catch (err) {
        console.warn("Auth init failed, clearing token");
        setToken(null);
        setUser(null);
        localStorage.removeItem("user");
        setApiToken(null);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []); // only on mount

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    setApiToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ token, setToken, user, setUser, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
