import React from "react";
import { motion } from "framer-motion";
import { FaUserMd, FaStethoscope, FaHeartbeat, FaBrain } from "react-icons/fa";

const doctors = [
  {
    icon: <FaUserMd className="text-blue-600 text-5xl" />,
    title: "General Physician",
    desc: "Primary consultation, medication planning & full clinical evaluation.",
  },
  {
    icon: <FaStethoscope className="text-green-600 text-5xl" />,
    title: "Internal Medicine",
    desc: "Chronic disease care — diabetes, BP, thyroid, asthma, metabolic disorders.",
  },
  {
    icon: <FaHeartbeat className="text-red-500 text-5xl" />,
    title: "Cardiologist",
    desc: "Cardiac risk assessment, ECG review, angiography & heart care follow-ups.",
  },
  {
    icon: <FaBrain className="text-purple-600 text-5xl" />,
    title: "Neurologist",
    desc: "Stroke, seizure, nerve weakness, headache & neurological diagnostics.",
  },
];

// Card animation
const card = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const DoctorsSection = () => {
  return (
    <section className="w-full py-24 px-6 relative overflow-hidden bg-gradient-to-br from-[#EFF7FF] via-white to-[#EAF8FF]">

      {/* Animated light orbs */}
      <motion.div
        animate={{ x:[0,50,0], y:[0,-40,0], opacity:[.4,.7,.4] }}
        transition={{ duration:10, repeat:Infinity }}
        className="absolute top-20 left-10 w-60 h-60 bg-blue-200/40 blur-3xl rounded-full"
      />
      <motion.div
        animate={{ x:[0,-50,0], y:[0,40,0], opacity:[.3,.8,.3] }}
        transition={{ duration:12, repeat:Infinity }}
        className="absolute bottom-20 right-10 w-72 h-72 bg-cyan-200/35 blur-[100px] rounded-full"
      />

      <div className="max-w-7xl mx-auto text-center relative z-10">

        <motion.h2
          initial={{ opacity:0, y:-20 }}
          whileInView={{ opacity:1, y:0 }}
          transition={{ duration:0.8 }}
          viewport={{ once:true }}
          className="text-4xl font-extrabold text-gray-900 tracking-tight"
        >
          Meet Our Medical Panel
        </motion.h2>

        <motion.p
          initial={{ opacity:0 }}
          whileInView={{ opacity:1 }}
          transition={{ duration:1 }}
          viewport={{ once:true }}
          className="text-gray-600 max-w-xl mx-auto mt-4 mb-14 text-lg"
        >
          Clinical insight + digital accuracy = better patient outcomes.
        </motion.p>

        {/* CARD GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {doctors.map((doc, i) => (
            <motion.div
              key={i}
              variants={card}
              initial="initial"
              whileInView="animate"
              viewport={{ once:true }}
              whileHover={{ scale:1.06, y:-6 }}
              className="relative bg-white/70 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-gray-200 hover:border-blue-400 transition-all duration-500 cursor-pointer group"
            >
              {/* Glow Aura */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-60
                              bg-gradient-to-r from-blue-200 via-transparent to-cyan-200
                              blur-2xl transition-all duration-700 rounded-2xl -z-10" />

              <div className="flex flex-col items-center">
                <motion.div
                  animate={{ y:[0,-6,0] }}
                  transition={{ duration:3, repeat:Infinity, ease:"easeInOut" }}
                  className="p-5 bg-white shadow-inner rounded-full"
                >
                  {doc.icon}
                </motion.div>

                <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2 group-hover:text-blue-600 transition">
                  {doc.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">{doc.desc}</p>
              </div>
            </motion.div>
          ))}

        </div>

        <p className="mt-14 text-gray-500 text-sm">
          Experienced specialists powering clinical decisions every day.
        </p>

      </div>
    </section>
  );
};

export default DoctorsSection;
