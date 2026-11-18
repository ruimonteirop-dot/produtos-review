import axios from "axios";

export const API = process.env.REACT_APP_BACKEND_URL;

export const api = axios.create({ baseURL: `${API}/api`, withCredentials: true });

// O cookie de sessão é bloqueado por muitos browsers (site e API em domínios diferentes),
// por isso o token também é guardado aqui e enviado no cabeçalho Authorization.
const TOKEN_KEY = "myg_admin_token";
export const tokenStore = {
  get: () => { try { return localStorage.getItem(TOKEN_KEY); } catch { return null; } },
  set: (t) => { try { t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY); } catch {} },
};
api.interceptors.request.use((config) => {
  const t = tokenStore.get();
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

export const imgSrc = (src) => (src?.startsWith("/api/") ? `${API}${src}` : src || "");

export const errText = (e, fallback = "Algo correu mal. Tenta novamente.") => {
  const d = e?.response?.data?.detail;
  if (typeof d === "string") return d;
  if (Array.isArray(d)) return d.map((x) => x?.msg).filter(Boolean).join(" ") || fallback;
  return fallback;
};
