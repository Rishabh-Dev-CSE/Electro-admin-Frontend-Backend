import { useState } from "react";
import { apiPost,apiPostForm } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await apiPost("/api/signup/", form);
      alert(res.message)
      if (res.message) {
        navigate("/auth/login");
      }
    } catch (err) {
      setError(err.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-slate-100 to-indigo-100 px-4">

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden grid md:grid-cols-2"
      >

        {/* ================= LEFT BRAND ================= */}
        <div className="relative hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-indigo-700 to-indigo-900 text-white">

          {/* Decorative elements */}
          <div className="absolute w-72 h-72 bg-white/10 rounded-full -top-24 -left-24" />
          <div className="absolute w-56 h-56 bg-white/5 rounded-full bottom-10 right-10" />

          <div className="relative z-10 text-center px-8">
            {/* Replace with your SVG logo */}
            <div className="mb-6 flex justify-center">
              <div className="w-20 h-20 rounded-2xl bg-white p-3 shadow-lg">
                <img
                  src="/logo.jpeg"
                  alt="Parts Arthkarya"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            <h2 className="text-4xl font-bold tracking-wide">
              <svg width="380" height="120" viewBox="0 0 380 120" xmlns="http://www.w3.org/2000/svg">


                <ellipse cx="64" cy="96" rx="40" ry="10" fill="#00000035" />


                <rect x="20" y="20" width="88" height="88" rx="20" fill="url(#chipOuter)" />


                <rect x="30" y="30" width="68" height="68" rx="16" fill="url(#chipInner)" />

                <g stroke="#38BDF8" stroke-width="3" stroke-linecap="round">
                  <line x1="12" y1="36" x2="20" y2="36" />
                  <line x1="12" y1="58" x2="20" y2="58" />
                  <line x1="12" y1="80" x2="20" y2="80" />

                  <line x1="108" y1="36" x2="116" y2="36" />
                  <line x1="108" y1="58" x2="116" y2="58" />
                  <line x1="108" y1="80" x2="116" y2="80" />
                </g>


                <g stroke="#2DD4BF" stroke-width="3" fill="none" stroke-linecap="round">
                  <path d="M54 56 H72 V40">
                    <animate
                      attributeName="stroke-dasharray"
                      from="0,100"
                      to="100,0"
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                  </path>
                  <circle cx="72" cy="38" r="3" fill="#2DD4BF">
                    <animate attributeName="opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite" />
                  </circle>

                  <path d="M54 70 H82 V88">
                    <animate
                      attributeName="stroke-dasharray"
                      from="0,100"
                      to="100,0"
                      dur="1.5s"
                      begin="0.3s"
                      repeatCount="indefinite"
                    />
                  </path>
                  <circle cx="82" cy="90" r="3" fill="#38BDF8">
                    <animate attributeName="opacity" values="0;1;0" dur="1.5s" begin="0.3s" repeatCount="indefinite" />
                  </circle>
                </g>

                <rect x="20" y="20" width="88" height="88" rx="20" fill="url(#chipGlow)">
                  <animate attributeName="opacity" values="0.4;0.7;0.4" dur="2s" repeatCount="indefinite" />
                </rect>

                <text x="140" y="54" font-size="30" font-weight="900" fill="#020617" letter-spacing="1">
                  PARTS
                </text>
                <text x="140" y="84" font-size="30" font-weight="900" fill="url(#textGrad)" letter-spacing="1">
                  ARTHKARYA
                </text>


                <text x="140" y="104" font-size="11" fill="#64748B" letter-spacing="1.2">
                  POWERING ELECTRONICS
                </text>


                <defs>

                  <linearGradient id="chipOuter" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stop-color="#020617" />
                    <stop offset="100%" stop-color="#1E1B4B" />
                  </linearGradient>

                  <linearGradient id="chipInner" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stop-color="#4F46E5" />
                    <stop offset="100%" stop-color="#312E81" />
                  </linearGradient>

                  <radialGradient id="chipGlow">
                    <stop offset="0%" stop-color="#38BDF850" />
                    <stop offset="100%" stop-color="#00000000" />
                  </radialGradient>

                  <linearGradient id="textGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stop-color="#4F46E5" />
                    <stop offset="100%" stop-color="#22D3EE" />
                  </linearGradient>

                </defs>
              </svg>

            </h2>
          </div>

          <div className="absolute bottom-6 text-xs text-indigo-300">
            © 2026 Parts Arthkarya
          </div>
        </div>

        {/* ================= RIGHT SIGNUP FORM ================= */}
        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="px-8 py-8 sm:px-10 sm:py-8 flex flex-col justify-center"
        >

          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            Create Account
          </h2>
          <p className="text-sm text-gray-500 mb-5">
            Electronics workspace access
          </p>

          {error && (
            <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          {/* USERNAME */}
          <div className="mb-4">
            <label className="text-xs font-medium text-gray-600">
              Username
            </label>
            <input
              name="username"
              onChange={handleChange}
              required
              className="
        mt-1 w-full px-3 py-2.5 rounded-lg
        border border-gray-300
        focus:ring-2 focus:ring-indigo-500
        focus:border-indigo-500
        outline-none transition
      "
            />
          </div>

          {/* EMAIL */}
          <div className="mb-4">
            <label className="text-xs font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              className="
        mt-1 w-full px-3 py-2.5 rounded-lg
        border border-gray-300
        focus:ring-2 focus:ring-indigo-500
        focus:border-indigo-500
        outline-none transition
      "
            />
          </div>

          {/* PASSWORD */}
          <div className="mb-6">
            <label className="text-xs font-medium text-gray-600">
              Password
            </label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              required
              className="
        mt-1 w-full px-3 py-2.5 rounded-lg
        border border-gray-300
        focus:ring-2 focus:ring-indigo-500
        focus:border-indigo-500
        outline-none transition
      "
            />
          </div>

          {/* BUTTON */}
          <button
            disabled={loading}
            className="
      w-full py-2.5 rounded-lg
      bg-indigo-600 text-white font-semibold
      hover:bg-indigo-700
      active:scale-[0.98]
      transition
    "
          >
            {loading ? "Creating..." : "Create Account"}
          </button>

          {/* FOOTER */}
          <p className="text-xs text-gray-500 mt-4 text-center">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/auth/login")}
              className="text-indigo-600 cursor-pointer font-medium"
            >
              Log in
            </span>
          </p>

        </motion.form>

      </motion.div>
    </div>
  );
}
