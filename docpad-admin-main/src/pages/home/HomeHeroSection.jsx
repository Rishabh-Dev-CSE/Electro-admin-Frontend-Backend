import React from "react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full pt-24 pb-24 bg-gradient-to-b from-[#E6F7FF] via-white to-[#E8FFF3] border-b border-gray-200">

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-14 items-center">

        {/* LEFT SIDE */}
        <div className="space-y-6">

          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
            Smart Documentation for Doctors & Hospitals
          </h1>

          <p className="text-lg text-gray-700 leading-relaxed max-w-md">
            Improve care efficiency with DocPad — digital notes, patient vitals,
            past history, investigations, prescriptions, handover records and discharge
            summaries. Designed for medical teams, optimized for accuracy, and accessible securely in real-time.
          </p>

          {/* CTA BUTTONS */}
          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => navigate("/signup")}
              className="px-7 py-3 rounded-lg bg-teal-600 text-white font-semibold shadow-md hover:bg-teal-700 transition-all"
            >
              Try DocPad
            </button>

            <button
              onClick={() => navigate("/demo")}
              className="px-7 py-3 rounded-lg border border-teal-300 text-teal-700 font-semibold hover:border-teal-500 hover:text-teal-600 transition-all"
            >
              Live Preview
            </button>
          </div>

          {/* STATISTICS */}
          <div className="pt-4 grid grid-cols-3 gap-6 text-sm text-gray-700">
            <div className="text-center">
              <h3 className="text-2xl font-extrabold text-teal-600">1000+</h3>
              <p>Patient Records</p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-extrabold text-teal-600">92%</h3>
              <p>Faster Note Entry</p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-extrabold text-teal-600">HIPAA</h3>
              <p>Secure Compliant</p>
            </div>
          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="relative flex justify-center md:justify-end">

          {/* Soft Medical Glows */}
          <div className="absolute w-[420px] h-[420px] bg-teal-200 blur-3xl rounded-full opacity-50 top-0 right-0 -z-10"></div>
          <div className="absolute w-[360px] h-[360px] bg-green-200 blur-3xl rounded-full opacity-50 bottom-0 left-0 -z-10"></div>

          {/* Doctor-Themed Dashboard Display */}
          <img
            src="/hero-docpad-dashboard.png"
            alt="DocPad Medical Dashboard"
            className="w-[90%] sm:w-[90%] max-w-[520px] rounded-2xl shadow-xl border border-gray-100 object-cover"
            loading="lazy"
          />
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
