import { useEffect, useState } from "react";

export default function NotFound() {
  const [sec, setSec] = useState(100);

  useEffect(() => {
    if (sec === 0) window.location.href = "/";
    const t = setTimeout(() => setSec(sec - 1), 1000);
    return () => clearTimeout(t);
  }, [sec]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-sky-100 via-white to-sky-50 dark:from-[#060b14] dark:via-[#020617] dark:to-black">

      {/* SVG AIR DISTORTION */}
      <svg className="absolute w-0 h-0">
        <filter id="air">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.01"
            numOctaves="3"
            seed="2"
          >
            <animate
              attributeName="baseFrequency"
              dur="20s"
              values="0.01;0.02;0.01"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" scale="30" />
        </filter>
      </svg>

      {/* CLOUD LAYERS */}
      <div className="absolute inset-0 pointer-events-none">
        <span className="cloud xl">☁️</span>
        <span className="cloud lg">☁️</span>
        <span className="cloud md">☁️</span>
        <span className="cloud sm">☁️</span>
      </div>

      {/* WIND LINES */}
      <div className="absolute inset-0 overflow-hidden">
        <span className="wind w1" />
        <span className="wind w2" />
        <span className="wind w3" />
      </div>

      {/* MAIN CONTENT */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">

        <h1
          className="text-[140px] md:text-[180px] font-black tracking-[0.2em]
          text-sky-500 dark:text-sky-400 animate-float"
          style={{ filter: "url(#air)" }}
        >
          404
        </h1>

        <p className="mt-2 text-xl font-semibold text-gray-700 dark:text-gray-200">
          This page evaporated 🌬️
        </p>

        <p className="mt-2 text-gray-500 dark:text-gray-400 max-w-md">
          Looks like the wind carried this page away.
          <br />
          Returning home in{" "}
          <span className="font-bold text-sky-500">{sec}s</span>
        </p>

        <div className="mt-8 flex gap-4 flex-wrap justify-center">
          <button
            onClick={() => window.history.back()}
            className="px-7 py-2.5 rounded-full bg-sky-500 text-white
            shadow-xl hover:bg-sky-600 hover:scale-105 transition"
          >
            Go Back
          </button>

          <button
            onClick={() => (window.location.href = "/admin")}
            className="px-7 py-2.5 rounded-full border border-sky-400
            text-sky-500 dark:text-sky-300
            hover:bg-sky-100 dark:hover:bg-slate-800 transition"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
