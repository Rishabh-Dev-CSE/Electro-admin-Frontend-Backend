import { useState } from "react";
import { motion } from "framer-motion";
import { apiPost } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import SuccessErrorCard from "../../components/Success_Error_model";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "",role:"admin" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userauth, setAuth] =useState("");
  const [modal, setModal] = useState({
    open: false,
    type: "",
    message: "",
  });


  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await apiPost("/api/login/", form);
      setAuth(res.user.is_staff)
      localStorage.setItem("access", res.access);
      localStorage.setItem("user", JSON.stringify(res.user));

      setModal({
        open: true,
        type: "success",
        message: res.message || "Login successful",
      });

    } catch (err) {
      setModal({
        open: true,
        type: "error",
        message: err.error || "Invalid credentials",
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-slate-100 to-indigo-100 px-4">
      {modal.open && (
        <SuccessErrorCard
          type={modal.type}
          title={modal.type === "success" ? "Success" : "Error"}
          message={modal.message}
          buttonText={modal.type === "success" ? "Continue" : "Try again"}
          onClick={() => {
            setModal({ open: false, type: "", message: "" });

            if (modal.type === "success") {
              const user = JSON.parse(localStorage.getItem("user"));
              window.location.href  = (user?.is_staff ? "/admin/dashboard" : "/");
            }
          }}
        />
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2"
      >

        {/* ================= LEFT BRAND ================= */}
        <div className="relative hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-indigo-600 to-indigo-800 text-white">

          {/* Decorative blobs */}
          <div className="absolute w-60 h-60 bg-white/10 rounded-full -top-20 -left-20" />
          <div className="absolute w-48 h-48 bg-white/10 rounded-full bottom-10 right-10" />

          <img
            src="/logo.jpeg"
            alt="Logo"
            className="w-20 h-20 object-contain mb-6 bg-white rounded-2xl p-3"
          />
          {/* SVG  */}
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

          <p className="mt-4 text-sm text-indigo-100 max-w-xs text-center">
            Secure inventory & order management system
          </p>
        </div>

        {/* ================= RIGHT LOGIN ================= */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="p-8 sm:p-12 flex flex-col justify-center"
        >

          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Login Admin Dashboard
          </h2>
          <p className="text-sm text-gray-500 mb-8">
            Login to continue to your account
          </p>

          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
              {error}
            </div>
          )}

          {/* USERNAME */}
          <div className="mb-6">
            <label className="text-sm font-medium text-gray-600">
              Username
            </label>
            <input
              name="username"
              onChange={handleChange}
              required
              placeholder="Enter your username"
              className="
                mt-2 w-full px-4 py-3 rounded-xl
                border border-gray-300
                focus:ring-2 focus:ring-indigo-500
                focus:border-indigo-500
                outline-none transition
              "
            />
          </div>

          {/* PASSWORD */}
          <div className="mb-8">
            <label className="text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              required
              placeholder="••••••••"
              className="
                mt-2 w-full px-4 py-3 rounded-xl
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
              w-full py-3 rounded-xl
              bg-indigo-600 text-white font-semibold
              hover:bg-indigo-700
              active:scale-[0.98]
              transition
            "
          >
            {loading ? "Logging in..." : "Log in"}
          </button>

          {/* FOOTER */}
          <p className="text-xs text-gray-500 mt-4 text-center">
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/auth/signup")}
              className="text-indigo-600 cursor-pointer font-medium"
            >
              Signup
            </span>
          </p>

        </motion.form>
      </motion.div>
    </div>
  );
}
