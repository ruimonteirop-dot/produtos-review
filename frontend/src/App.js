import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";
import Landing from "./pages/Landing";
import AdminLogin from "./pages/AdminLogin";
import AdminPanel from "./pages/AdminPanel";
import ReviewPage from "./pages/ReviewPage";
import { AuthProvider, RequireAdmin } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="bottom-center" richColors />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/reviews/:slug" element={<ReviewPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<RequireAdmin><AdminPanel /></RequireAdmin>} />
        </Routes>
      </BrowserRouter>
      {/* Vercel Web Analytics: sem cookies; não conta as visitas ao painel /admin */}
      <Analytics beforeSend={(e) => (new URL(e.url).pathname.startsWith("/admin") ? null : e)} />
    </AuthProvider>
  );
}

export default App;
