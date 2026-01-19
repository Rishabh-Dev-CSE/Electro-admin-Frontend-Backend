import React from "react";
import { motion } from "framer-motion";
import { FaShieldAlt, FaFileMedical, FaHistory, FaUserMd, FaMicroscope } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const benefits = [
  { icon: <FaFileMedical className="w-7 h-7 text-teal-600" />, title: "Complete Patient Records",
    text: "One platform for demographics, visits, prescriptions, notes & investigations — structured, searchable & synced live." },

  { icon: <FaHistory className="w-7 h-7 text-blue-600" />, title: "Medical History Timeline",
    text: "Track symptoms, diagnosis, chronic issues & treatment progress with timeline-based clinical visibility." },

  { icon: <FaMicroscope className="w-7 h-7 text-indigo-600" />, title: "OCR-Powered Lab Parsing",
    text: "Upload reports — AI reads them, extracts values, highlights abnormal ranges & adds to patient chart instantly." },

  { icon: <FaShieldAlt className="w-7 h-7 text-yellow-500" />, title: "Data Ownership & Control",
    text: "Stored inside your secure cloud — full compliance, encryption, audit logs & zero external exposure." },

  { icon: <FaUserMd className="w-7 h-7 text-rose-600" />, title: "Clinical Team Sharing",
    text: "Share files with consultants, maintain read/write permissions & track doctor-to-doctor access." },
];

const WhyUseDocPad = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full py-28 px-6 relative overflow-hidden bg-gradient-to-r from-[#EAF9FF] via-white to-[#EEFFF7]">

      {/* Liquid morphing background shapes */}
      <motion.div 
        animate={{ scale: [1.1,1.3,1.1], x:[0,40,0], y:[0,-30,0] }}
        transition={{ duration: 10, repeat: Infinity, ease:"easeInOut" }}
        className="absolute -top-32 -left-24 w-[420px] h-[420px] bg-teal-200/35 blur-[110px] rounded-full"
      />

      <motion.div
        animate={{ scale:[1,1.25,1], x:[0,-50,0], y:[0,40,0] }}
        transition={{ duration: 12, repeat: Infinity, ease:"easeInOut" }}
        className="absolute bottom-0 right-0 w-[480px] h-[480px] bg-blue-200/40 blur-[140px] rounded-full"
      />

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 relative z-10 items-start">

        {/* LEFT CONTENT */}
        <motion.div
          initial={{ opacity:0, x:-50 }}
          whileInView={{ opacity:1, x:0 }}
          transition={{ duration:1 }}
          viewport={{ once:true }}
          className="lg:w-1/2"
        >

          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-snug">
            Why Hospitals & Doctors<br/>Choose <span className="text-teal-600">DocPad</span>
          </h2>

          <p className="text-gray-600 text-lg mt-5 leading-relaxed max-w-lg">
            Move beyond registers, files & disconnected systems. DocPad unifies patient care,
            accelerates documentation, and makes medical information instantly accessible.
          </p>

          {/* Animated Benefit Blocks */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={{ visible:{ transition:{ staggerChildren:0.15 } } }}
            viewport={{ once:true }}
            className="mt-10 space-y-6"
          >
            {benefits.map((b,i)=>(
              <motion.div
                key={i}
                variants={{
                  hidden:{ opacity:0, x:-40 },
                  visible:{ opacity:1, x:0, transition:{ duration:0.6 } }
                }}
                whileHover={{ scale:1.03, x:8 }}
                className="group flex gap-4 items-start bg-white/60 backdrop-blur-md p-4 rounded-xl shadow-md border border-teal-200/40 hover:border-teal-600 transition-all duration-400"
              >
                <div className="p-3 rounded-lg bg-white shadow-inner group-hover:shadow-lg transition-all">
                  {b.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-teal-700 transition-colors">
                    {b.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{b.text}</p>
                </div>

                {/* Left Glow Stripe */}
                <div className="absolute left-0 top-0 h-full w-1 rounded-full bg-transparent group-hover:bg-teal-600 transition-all" />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* RIGHT IMAGE DISPLAY PANEL */}
        <motion.div
          initial={{ opacity:0, scale:0.9 }}
          whileInView={{ opacity:1, scale:1 }}
          transition={{ duration:1 }}
          viewport={{ once:true }}
          className="lg:w-1/2 flex justify-center"
        >
          <div className="relative">
            
            {/* Animated ring aura */}
            <motion.div
              animate={{ scale:[0.95,1.1,0.95], opacity:[0.5,1,0.5] }}
              transition={{ duration:6, repeat:Infinity, ease:"easeInOut" }}
              className="absolute inset-0 rounded-2xl bg-gradient-to-r from-teal-300 to-blue-300 blur-xl -z-10"
            />

            <img
              src="/medical-docpad-whyuse.png"
              alt="DocPad Illustration"
              className="rounded-2xl shadow-2xl border border-white/60 w-full max-w-lg"
            />
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default WhyUseDocPad;
