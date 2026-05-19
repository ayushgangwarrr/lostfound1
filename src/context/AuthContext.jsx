import { createContext, useContext, useEffect, useState } from "react";
import { fetchJson } from "../utils/api.js";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const loadProfile = async () => {
    setAuthLoading(true);
    try {
      const data = await fetchJson("/api/auth/profile");
      setUser(data.profile);
    } catch (error) {
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, authLoading, loadProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
