// SAME GLASS UI + GOOGLE AUTH
import { useState } from "react";
import { Link } from "react-router-dom";
import { signInWithGoogle } from "./firebase/firebase";
import SuccessModal from "../../module/cards/SuccessModal";

function Signup() {
  const [name, setName] = useState("");
  const [hospital, setHospital] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSignup = (e) => {
    e.preventDefault();
    setSuccess(true);
  };

  const googleSignup = async () => {
    try {
      const user = await signInWithGoogle();
      localStorage.setItem("user", JSON.stringify(user));
      setSuccess(true);
    } catch {
      alert("Google Signup Failed");
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

          <h2 className="text-3xl font-bold text-white text-center mb-6">Create Account</h2>

          <form className="flex flex-col space-y-6" onSubmit={handleSignup}>

            <input type="text" required placeholder="Full Name"
              value={name} onChange={(e)=>setName(e.target.value)}
              className="px-4 py-3 bg-white/10 rounded-xl text-white outline-none"
            />

            <input type="email" required placeholder="Email Address"
              value={email} onChange={(e)=>setEmail(e.target.value)}
              className="px-4 py-3 bg-white/10 rounded-xl text-white outline-none"
            />

            <input type="text" required placeholder="Hospital / Clinic Name"
              value={hospital} onChange={(e)=>setHospital(e.target.value)}
              className="px-4 py-3 bg-white/10 rounded-xl text-white outline-none"
            />

            <select required value={role} onChange={(e)=>setRole(e.target.value)}
              className="px-4 py-3 bg-white/10 rounded-xl text-white outline-none"
            >
              <option>Select Role</option>
              <option value="doctor">Doctor</option>
              <option value="staff">Medical Staff</option>
              <option value="admin">Hospital Admin</option>
              <option value="patient">Patient Access</option>
            </select>

            <input type="password" required placeholder="Create Password"
              value={password} onChange={(e)=>setPassword(e.target.value)}
              className="px-4 py-3 bg-white/10 rounded-xl text-white outline-none"
            />

            <button className="py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:scale-[1.03] transition">Sign Up</button>
          </form>

          <div className="flex items-center my-6 gap-4">
            <div className="flex-1 h-[1px] bg-white/20"></div>
            <span className="text-gray-300 text-sm">OR</span>
            <div className="flex-1 h-[1px] bg-white/20"></div>
          </div>

          <button onClick={googleSignup}
            className="w-full py-3 rounded-xl bg-white font-semibold text-gray-800 hover:bg-gray-200 transition flex items-center justify-center gap-3"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5" />
            Sign Up with Google
          </button>

          <p className="text-center text-gray-200 mt-6">
            Already have an account? <Link to="/auth/login" className="text-blue-300 underline">Login</Link>
          </p>

          <SuccessModal open={success} message="Account Created Successfully!" onClose={()=>setSuccess(false)} />
        </div>
      </div>
    </>
  );
}

export default Signup;
