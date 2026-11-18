import axios from "axios";

export const API = process.env.REACT_APP_BACKEND_URL;

export const api = axios.create({ baseURL: `${API}/api`, withCredentials: true });

export const imgSrc = (src) => (src?.startsWith("/api/") ? `${API}${src}` : src || "");

export const errText = (e, fallback = "Algo correu mal. Tenta novamente.") => {
  const d = e?.response?.data?.detail;
  if (typeof d === "string") return d;
  if (Array.isArray(d)) return d.map((x) => x?.msg).filter(Boolean).join(" ") || fallback;
  return fallback;
};
