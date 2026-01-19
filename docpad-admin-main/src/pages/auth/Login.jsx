import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../navbar/navbar";
import { AuthContext } from "../../module/content/AuthContext";
import { signInWithGoogle } from "./firebase/firebase";  // <-- GOOGLE LOGIN IMPORT

const BASE_URL = "http://127.0.0.1:8000";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // Handle normal login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/api/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // 🔥 REQUIRED for cookies
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return alert(data.error || "Invalid Credentials");
      }

      // ✅ Save access token
      localStorage.setItem("access", data.access);

      // ✅ Save user properly
      const userData = {
        id: data.user.id,
        username: data.user.username,
        is_staff: data.user.is_staff,
      };

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      navigate("/admin");
    } catch (err) {
      console.error(err);
      alert("Network Error");
    } finally {
      setLoading(false);
    }
  };


  // Google Login Integration
  const handleGoogleLogin = async () => {
    try {
      const user = await signInWithGoogle();
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/admin");
    } catch {
      alert("Google Login Failed");
    }
  };

  return (
    <>


      <div className="min-h-screen flex items-center justify-center 
          bg-gradient-to-br from-[#00152E] via-[#002B57] to-[#01396B] relative overflow-hidden">

        <div className="absolute top-[-12rem] left-[-12rem] w-[430px] h-[430px] bg-blue-600/30 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-12rem] right-[-12rem] w-[430px] h-[430px] bg-cyan-600/30 rounded-full blur-[150px]" />

        <div className="relative w-full max-w-md px-8 py-10 bg-white/10 backdrop-blur-lg 
                        rounded-3xl border border-white/20 shadow-xl">

          <h2 className="text-3xl font-bold text-white text-center mb-6">Login</h2>

          <form onSubmit={handleLogin} className="flex flex-col space-y-6">

            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username / Email"
              className="px-4 py-3 bg-white/10 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-400"
              required
            />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="px-4 py-3 bg-white/10 rounded-xl text-white outline-none focus:ring-2 focus:ring-purple-400"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className={`py-3 rounded-xl text-lg font-semibold bg-gradient-to-r 
                from-blue-600 to-purple-600 text-white transition ${loading ? "opacity-60 cursor-not-allowed" : "hover:scale-[1.03]"
                }`}
            >
              {loading ? "Authenticating..." : "Login"}
            </button>
          </form>

          <div className="flex items-center my-6 gap-4">
            <div className="flex-1 h-[1px] bg-white/20"></div>
            <span className="text-gray-300 text-sm">OR</span>
            <div className="flex-1 h-[1px] bg-white/20"></div>
          </div>

          {/* FIREBASE BUTTON */}
          <button
            onClick={handleGoogleLogin}
            className="w-full py-3 rounded-xl bg-white text-gray-900 font-semibold 
                      hover:bg-gray-200 transition flex items-center justify-center gap-3"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5" />
            Continue with Google
          </button>

          <p className="text-center text-gray-300 mt-6 text-sm">
            New User? <Link to="/auth/signup" className="text-blue-400 underline">Create Account</Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;
