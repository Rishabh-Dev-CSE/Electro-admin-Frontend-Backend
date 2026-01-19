// import React, { useState } from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";

// const Navbar = () => {
//   const [open, setOpen] = useState(false);
//   const navigate = useNavigate();
//   const { pathname } = useLocation();

//   const links = [
//     { name: "Home", path: "/" },
//     // { name: "Dashboard", path: "/dashboard" },
//     { name: "Patients", path: "/patients" },
//     { name: "OCR Documents", path: "/ocr" },
//     { name: "Investigations", path: "/investigations" },
//     { name: "Discharge Summary", path: "/discharge-summary" },
//     { name: "Doctor Access", path: "/sharing" },
//     { name: "Contact", path: "/contact" },
//   ];

//   return (
//     <header className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md border-b shadow-sm">
//       <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-8 py-4">

//         {/* LOGO */}
//         <div
//           onClick={() => navigate("/")}
//           className="flex items-center gap-3 cursor-pointer select-none"
//         >
//           <img src="/med-logo.png" alt="DocPad" className="w-9 h-9 rounded-md" />
//           <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 text-transparent bg-clip-text">
//             DocPad
//           </h1>
//         </div>

//         {/* DESKTOP NAV */}
//         <nav className="hidden md:flex items-center gap-8 text-[15px] font-medium">
//           {links.map((l) => (
//             <Link
//               key={l.path}
//               to={l.path}
//               className={`relative transition ${
//                 pathname === l.path ? "text-blue-600 font-semibold" : "text-gray-700"
//               }`}
//             >
//               {l.name}
//               <span
//                 className={`absolute left-0 -bottom-[3px] h-[2px] bg-blue-600 transition-all duration-300 ${
//                   pathname === l.path ? "w-full" : "w-0 group-hover:w-full"
//                 }`}
//               />
//             </Link>
//           ))}
//         </nav>

//         {/* AUTH BUTTONS DESKTOP */}
//         <div className="hidden md:flex items-center gap-3">
//           <button
//             onClick={() => navigate("/auth/login")}
//             className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md font-medium hover:bg-blue-50 transition"
//           >
//             Login
//           </button>
//           <button
//             onClick={() => navigate("/auth/signup")}
//             className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition"
//           >
//             Sign Up
//           </button>
//         </div>

//         {/* MOBILE MENU BUTTON */}
//         <button onClick={() => setOpen(!open)} className="md:hidden flex flex-col gap-[6px]">
//           <span className={`block w-6 h-[2px] bg-gray-900 transition ${open && "rotate-45 translate-y-[6px]"}`} />
//           <span className={`block w-6 h-[2px] bg-gray-900 transition ${open && "opacity-0"}`} />
//           <span className={`block w-6 h-[2px] bg-gray-900 transition ${open && "-rotate-45 -translate-y-[6px]"}`} />
//         </button>
//       </div>

//       {/* MOBILE NAV */}
//       {open && (
//         <div className="md:hidden bg-white shadow-lg border-t px-6 py-5 space-y-4 animate-fadeDown">
//           {links.map((l) => (
//             <Link
//               key={l.path}
//               to={l.path}
//               onClick={() => setOpen(false)}
//               className={`block text-base font-medium transition ${
//                 pathname === l.path ? "text-blue-600" : "text-gray-800 hover:text-blue-600"
//               }`}
//             >
//               {l.name}
//             </Link>
//           ))}

//           <div className="pt-3 space-y-3">
//             <button
//               onClick={() => { setOpen(false); navigate("/auth/login"); }}
//               className="w-full py-2 border border-blue-600 text-blue-600 rounded-md font-medium hover:bg-blue-50 transition"
//             >
//               Login
//             </button>
//             <button
//               onClick={() => { setOpen(false); navigate("/auth/signup"); }}
//               className="w-full py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition"
//             >
//               Sign Up
//             </button>
//           </div>
//         </div>
//       )}

//       {/* MOBILE DROPDOWN ANIMATION */}
//       <style>{`
//         .animate-fadeDown {
//           animation: fadeDown 0.3s ease forwards;
//         }
//         @keyframes fadeDown {
//           from { opacity: 0; transform: translateY(-5px); }
//           to   { opacity: 1; transform: translateY(0); }
//         }
//       `}</style>
//     </header>
//   );
// };

// export default Navbar;

// ===========================Recommended ======================
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { auth, logout } from "../../pages/auth/firebase/firebase"; 

// NAVIGATION PER-ROLE
const navItems = {
  admin: [
    { name: "Dashboard", path: "/doctor/admin/dashboard" },
    { name: "Patients", path: "/doctor/admin/patients" },
    { name: "OCR Documents", path: "/doctor/admin/ocr-documents" },
    { name: "Investigations", path: "/doctor/admin/investigations" },
    { name: "Discharge Summary", path: "/doctor/admin/discharge-summary" },
    { name: "Doctor Access", path: "/doctor/admin/staff-access" },
    { name: "Audit Logs", path: "/doctor/admin/logs" }
  ],
  doctor: [
    { name: "Dashboard", path: "/doctor/admin/dashboard" },
    { name: "Patients", path: "/doctor/admin/patients" },
    { name: "OCR", path: "/doctor/admin/ocr-documents" },
    { name: "Investigations", path: "/doctor/admin/investigations" },
    { name: "Discharge Summary", path: "/doctor/admin/discharge-summary" }
  ],
  viewer: [
    { name: "Dashboard", path: "/viewer/dashboard" },
    { name: "Shared Patients", path: "/viewer/patients" }
  ],
  public: [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" }
  ]
};

const Navbar = () => {

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdown, setDropdown] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // GET FIREBASE USER
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsub();
  }, []);

  const role = user ? "doctor" : "public";       // Auto detect
  const navLinks = navItems[role] || [];

  const handleLogout = async () => {
    await logout();
    localStorage.clear();
    navigate("/auth/login");
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/90
     backdrop-blur-xl border-b border-gray-200 shadow-sm">

      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* LOGO */}
        <div 
          onClick={() => navigate("/")}
          className="flex items-center gap-2 cursor-pointer select-none"
        >
          <img src="/med-logo.png" alt="logo" className="w-9 h-9 rounded-md"/>
          <h1 className="text-xl font-bold bg-gradient-to-r 
          from-blue-600 to-cyan-500 text-transparent bg-clip-text">
            DocPad EMR
          </h1>
        </div>

        {/* DESKTOP LINKS */}
        <nav className="hidden md:flex items-center gap-8 text-gray-700 font-medium">
          {navLinks.map((link,i)=>(
            <Link 
              key={i} 
              to={link.path}
              className={`relative group hover:text-blue-600 transition ${
                location.pathname === link.path && "text-blue-600 font-semibold"
              }`}
            >
              {link.name}
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-blue-600 transition-all duration-300 group-hover:w-full"/>
            </Link>
          ))}
        </nav>

        {/* RIGHT AUTH */}
        <div className="hidden md:flex items-center">

          {/* if logged in → show profile */}
          {user ? (
            <div 
              onMouseEnter={()=>setDropdown(true)} 
              onMouseLeave={()=>setDropdown(false)}
              className="relative cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <img 
                  src={user.photoURL || "/avatar.png"} 
                  alt="" 
                  className="w-9 h-9 rounded-full border"
                />
                <span className="font-semibold text-gray-800">
                  {user.displayName || user.email}
                </span>
              </div>

              {/* DROPDOWN */}
              {dropdown && (
                <div className="absolute right-0 mt-3 w-44 bg-white shadow-xl 
                rounded-lg p-2 border animate-fade">

                  <button 
                    onClick={()=>navigate("/doctor/admin/dashboard")}
                    className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md">
                    Dashboard
                  </button>

                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 hover:bg-red-50 text-red-600 rounded-md">
                    Logout
                  </button>

                </div>
              )}
            </div>
          ) 
          : (
            <div className="flex gap-3">
              <button 
                onClick={()=>navigate("/auth/login")}
                className="px-5 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">
                Login
              </button>
              <button 
                onClick={()=>navigate("/auth/signup")}
                className="px-5 py-2 rounded-md border border-blue-500 text-blue-600 hover:bg-blue-50">
                Sign Up
              </button>
            </div>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button 
          className="md:hidden flex flex-col w-6 h-5 justify-between"
          onClick={()=>setIsMobileOpen(!isMobileOpen)}
        >
          <span className={`block h-[2px] bg-black transition ${isMobileOpen?"rotate-45 translate-y-2":""}`}/>
          <span className={`block h-[2px] bg-black transition ${isMobileOpen?"opacity-0":""}`}/>
          <span className={`block h-[2px] bg-black transition ${isMobileOpen?"-rotate-45 -translate-y-2":""}`}/>
        </button>

      </div>

      {/* MOBILE NAVIGATION */}
      {isMobileOpen && (
        <div className="md:hidden px-6 py-4 bg-white border-t shadow space-y-4">

          {navLinks.map((link,i)=>(
            <Link 
              key={i}
              to={link.path}
              onClick={()=>setIsMobileOpen(false)}
              className="block text-gray-700 font-medium hover:text-blue-600"
            >
              {link.name}
            </Link>
          ))}

          {/* Auth Mobile */}
          <div className="pt-4">
            {user ? (
              <>
                <button 
                  onClick={()=>navigate("/doctor/admin/dashboard")}
                  className="w-full py-2 rounded-md bg-blue-600 text-white mb-2">
                  Dashboard
                </button>

                <button 
                  onClick={handleLogout}
                  className="w-full py-2 rounded-md bg-red-500 text-white">
                  Logout
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={()=>navigate("/auth/login")}
                  className="w-full py-2 rounded-md bg-blue-600 text-white mb-2">
                  Login
                </button>
                <button 
                  onClick={()=>navigate("/auth/signup")}
                  className="w-full py-2 rounded-md border border-blue-500 text-blue-600">
                  Sign Up
                </button>
              </>
            )}
          </div>

        </div>
      )}

    </header>
  );
};

export default Navbar;
