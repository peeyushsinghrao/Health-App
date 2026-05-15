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
    loadScript("/web-portal.js");

    // Color-code attendance day selects after web-portal.js renders them
    function colorAttSelects() {
      document.querySelectorAll<HTMLSelectElement>('.att-day-select').forEach((sel) => {
        sel.classList.remove('val-present', 'val-absent', 'val-cl', 'val-dayoff');
        const v = sel.value;
        if (v === 'उपस्थित')             sel.classList.add('val-present');
        else if (v === 'Willful Absence') sel.classList.add('val-absent');
        else if (v === 'CL')              sel.classList.add('val-cl');
        else if (v === 'Day Off')         sel.classList.add('val-dayoff');
      });
    }

    const tbody = document.getElementById('att-tbody');
    let mo: MutationObserver | null = null;
    if (tbody) {
      mo = new MutationObserver(colorAttSelects);
      mo.observe(tbody, { childList: true, subtree: true });
      tbody.addEventListener('change', (e) => {
        const t = e.target as HTMLElement;
        if (t.classList.contains('att-day-select')) colorAttSelects();
      });
    }

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
