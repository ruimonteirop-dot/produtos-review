import { useEffect } from "react";
import Lenis from "lenis";

export const scrollToId = (id) => {
  const el = document.getElementById(id);
  if (!el) { window.location.href = `/#${id}`; return; }
  if (window.__lenis) window.__lenis.scrollTo(el, { offset: -80, duration: 1.4 });
  else el.scrollIntoView({ behavior: "smooth" });
};

export const SmoothScroll = () => {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    window.__lenis = lenis;
    let id;
    const raf = (t) => {
      lenis.raf(t);
      id = requestAnimationFrame(raf);
    };
    id = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(id);
      lenis.destroy();
      window.__lenis = null;
    };
  }, []);
  return null;
};
