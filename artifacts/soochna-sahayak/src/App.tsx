import { useEffect } from "react";
import HomePage from "./app/page";
import "./app/globals.css";

export default function App() {
  useEffect(() => {
    const link1 = document.createElement("link");
    link1.rel = "preconnect";
    link1.href = "https://fonts.googleapis.com";
    document.head.appendChild(link1);

    const link2 = document.createElement("link");
    link2.rel = "preconnect";
    link2.href = "https://fonts.gstatic.com";
    link2.crossOrigin = "anonymous";
    document.head.appendChild(link2);

    const link3 = document.createElement("link");
    link3.rel = "stylesheet";
    link3.href =
      "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Lora:ital,wght@0,400..700;1,400..700&family=JetBrains+Mono:wght@100..800&family=Noto+Sans+Devanagari:wght@400;500;700&family=Noto+Serif+Devanagari:wght@400;700&display=swap";
    document.head.appendChild(link3);

    document.documentElement.lang = "hi";
    document.title = "Soochna Sahayak — Smart Office Assistant";

    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);

    const loadScript = (src: string, onload?: () => void) => {
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
      const w = window as any;
      if (typeof w.showPanel === "function") w.showPanel = w.showPanel;
      if (typeof w.showHomeScreen === "function")
        w.showHomeScreen = w.showHomeScreen;
      if (typeof w.toggleSound === "function") w.toggleSound = w.toggleSound;
    });

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
  }, []);

  return <HomePage />;
}
