import { createContext, useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { api, tokenStore } from "../lib/api";

const AuthCtx = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    if (!tokenStore.get()) { setUser(false); return; }
    api.get("/auth/me").then((r) => setUser(r.data)).catch(() => { tokenStore.set(null); setUser(false); });
  }, []);
  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    tokenStore.set(data.token);
    const { token, ...profile } = data;
    setUser(profile);
  };
  const logout = async () => {
    await api.post("/auth/logout").catch(() => {});
    tokenStore.set(null);
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
