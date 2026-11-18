import { createContext, useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { api } from "../lib/api";

const AuthCtx = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    api.get("/auth/me").then((r) => setUser(r.data)).catch(() => setUser(false));
  }, []);
  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    setUser(data);
  };
  const logout = async () => {
    await api.post("/auth/logout").catch(() => {});
    setUser(false);
  };
  return <AuthCtx.Provider value={{ user, login, logout }}>{children}</AuthCtx.Provider>;
};

export const useAuth = () => useContext(AuthCtx);

export const RequireAdmin = ({ children }) => {
  const { user } = useAuth();
  if (user === null) return <div data-testid="auth-loading" className="min-h-screen grid place-items-center text-sm text-[var(--muted)]">A carregar…</div>;
  if (!user) return <Navigate to="/admin/login" replace />;
  return children;
};
