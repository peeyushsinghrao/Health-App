import { useEffect } from "react";
import HomePage from "./app/page";
import "./index.css";

export default function App() {
  useEffect(() => {
    document.documentElement.lang = "hi";
    document.title = "Soochna Sahayak — Smart Office Assistant";

    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);

    const loadScript = (src: string, onload?: () => void) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        onload?.();
        return;
      }
      const s = document.createElement("script");
      s.src = src;
      s.async = true;
      if (onload) s.onload = onload;
      document.head.appendChild(s);
    };

    loadScript(
      "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"
    );
    loadScript(
      "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"
    );
    loadScript("/web-portal.js", () => {
      const h = window.location.hash;
      if (h === '#att') (window as any).showPanel?.('staff-att-panel');
      else if (h === '#plp') (window as any).showPanel?.('plp-panel');
      else if (h === '#yog') (window as any).showPanel?.('yog-panel');
    });

    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js").catch((err) => {
          console.warn("SW registration failed:", err);
        });
      });
    }

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!motionQuery.matches) {
      const reveals = document.querySelectorAll(".reveal, .reveal-stagger");
      if (reveals.length) {
        const io = new IntersectionObserver(
          (entries) => {
            entries.forEach((e) => {
              if (e.isIntersecting) {
                (e.target as HTMLElement).classList.add("visible");
                io.unobserve(e.target);
              }
            });
          },
          { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
        );
        reveals.forEach((el) => io.observe(el));
      }
    }

    return () => {
      mo?.disconnect();
    };
  }, []);

  return <HomePage />;
}
