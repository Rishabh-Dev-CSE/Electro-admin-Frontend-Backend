import React from "react";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-[#F9FDFF] via-white to-[#E7F7FF] border-t border-gray-200 text-gray-700 py-16 px-6">

      {/* ECG Gradient Top Strip */}
      <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-600 animate-[pulseLine_6s_infinite]" />

      {/* Floating soft lights */}
      <div className="absolute -top-20 right-10 w-64 h-64 bg-teal-200/30 blur-3xl rounded-full animate-[float_12s_infinite]" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-cyan-200/25 blur-[120px] rounded-full animate-[float_10s_infinite_reverse]" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 z-10 relative">

        {/* Brand Identity */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <img src="/med-logo.png" alt="DocPad" className="w-11 h-11 rounded-md shadow-sm" />
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              DocPad
            </h2>
          </div>

          <p className="text-sm text-gray-600 max-w-xs leading-relaxed">
            A modern Electronic Medical Records suite simplifying clinical workflows, records,
            prescriptions, investigation charts & discharge notes — all in one secure hospital system.
          </p>
        </div>

        {/* Product Navigation */}
        <div>
          <h3 className="text-gray-900 font-semibold mb-4 text-lg">Platform Tools</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/patients" className="footer-link">Patients</Link></li>
            <li><Link to="/ocr" className="footer-link">OCR Documents</Link></li>
            <li><Link to="/investigations" className="footer-link">Investigations</Link></li>
            <li><Link to="/discharge-summary" className="footer-link">Discharge Summary</Link></li>
            <li><Link to="/sharing" className="footer-link">Doctor Access & Sharing</Link></li>
          </ul>
        </div>

        {/* Help & Info */}
        <div>
          <h3 className="text-gray-900 font-semibold mb-4 text-lg">Support</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/help" className="footer-link">Help Center</Link></li>
            <li><Link to="/faq" className="footer-link">FAQs</Link></li>
            <li><Link to="/privacy" className="footer-link">Privacy Policy</Link></li>
            <li><Link to="/terms" className="footer-link">Terms & Conditions</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-gray-900 font-semibold mb-4 text-lg">Contact & Support</h3>
          <p className="text-sm text-gray-600 mb-5 leading-relaxed">
            support@docpad.io <br />
            New Delhi, India
          </p>

          <div className="flex items-center gap-3">
            {[
              { icon: <FaFacebookF />, color:"hover:bg-blue-600" },
              { icon: <FaInstagram />, color:"hover:bg-pink-600" },
              { icon: <FaTwitter />, color:"hover:bg-sky-500" },
              { icon: <FaLinkedinIn />, color:"hover:bg-blue-700" }
            ].map((s,i)=>(
              <a key={i} href="#" className={`social-icon ${s.color}`}>
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="mt-12 text-center text-sm text-gray-500 border-t border-gray-200 pt-6">
        © {new Date().getFullYear()} <span className="text-teal-600 font-semibold">DocPad EMR</span>. Empowering Digital Healthcare.
      </div>

      {/* Glow footer bed */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-36 bg-gradient-to-t from-teal-200/30 to-transparent blur-xl opacity-70" />

      {/* Styles */}
      <style>{`
        .footer-link {
          color:#475569;
          transition:0.3s;
        }
        .footer-link:hover {
          color:#0284c7;
        }
        .social-icon {
          width:40px; height:40px;
          display:flex; align-items:center; justify-content:center;
          border-radius:50%; font-size:14px;
          background:white;
          border:1px solid rgba(0,0,0,0.08);
          transition:0.4s;
          color:#0f172a;
        }
        .social-icon:hover {
          color:#fff;
          transform:scale(1.15);
          box-shadow:0 8px 20px rgba(0,0,0,0.08);
        }
        @keyframes pulseLine { 
          0%{ opacity:.5 } 50%{ opacity:1 } 100%{ opacity:.5 } 
        }
        @keyframes float {
          0%{ transform:translateY(0) }
          50%{ transform:translateY(-20px) }
          100%{ transform:translateY(0) }
        }
        @keyframes float_10s_infinite_reverse {
          0%{ transform:translateY(15px) }
          50%{ transform:translateY(-15px) }
          100%{ transform:translateY(15px) }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
