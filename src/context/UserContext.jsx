import { useCallback, useEffect, useState } from "react";
import { UserContext } from "./user-context.js";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [loginErrorMsg, setLoginErrorMsg] = useState("");
  const [sessionError, setSessionError] = useState("");

  const apiFetch = useCallback(async (path, options = {}) => {
    const response = await fetch(`${API_URL}${path}`, { ...options, credentials: "include" });
    if (response.status === 401) setUser(null);
    return response;
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    async function restoreSession() {
      try {
        const response = await apiFetch("/api/me", { signal: controller.signal });
        if (response.ok) setUser((await response.json()).user);
        else if (response.status !== 401) throw new Error("Unable to restore your session.");
      } catch (error) {
        if (!controller.signal.aborted) setSessionError(error.message);
      } finally {
        if (!controller.signal.aborted) setIsInitializing(false);
      }
    }
    restoreSession();
    return () => controller.abort();
  }, [apiFetch]);

  async function login(email, password) {
    setLoginErrorMsg("");
    setSessionError("");
    try {
      const response = await apiFetch("/api/auth/login", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed.");
      setUser(data.user);
      return true;
    } catch (error) {
      setLoginErrorMsg(error.message);
      return false;
    }
  }

  async function logout() {
    setSessionError("");
    try {
      const response = await apiFetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) throw new Error("Logout failed. Please try again.");
      setUser(null);
      setLoginErrorMsg("");
      return true;
    } catch (error) {
      setSessionError(error.message);
      return false;
    }
  }

  return <UserContext.Provider value={{ user, login, logout, apiFetch,
    isLoggedIn: Boolean(user), isInitializing, loginErrorMsg,
    isLogInError: Boolean(loginErrorMsg), sessionError }}>{children}</UserContext.Provider>;
}
