import React from "react";
import { motion } from "framer-motion";
import { FaUserMd, FaNotesMedical, FaFilePrescription, FaStethoscope } from "react-icons/fa";

const features = [
  {
    title: "Patient Records Management",
    icon: <FaStethoscope className="text-teal-600 text-4xl drop-shadow-md" />,
    desc: "One unified file — history, vitals, investigations, notes, treatment timeline and scans securely stored.",
  },
  {
    title: "Clinical Notes & History",
    icon: <FaNotesMedical className="text-indigo-600 text-4xl drop-shadow-md" />,
    desc: "Doctors enter complaints, exams, medications quickly through structured intelligent note templates.",
  },
  {
    title: "OCR Document Extraction",
    icon: <FaFilePrescription className="text-emerald-600 text-4xl drop-shadow-md" />,
    desc: "AI reads prescriptions, lab results, radiology scans and auto-updates patient medical record instantly.",
  },
  {
    title: "Doctor-to-Doctor Handover",
    icon: <FaUserMd className="text-sky-700 text-4xl drop-shadow-md" />,
    desc: "Secure clinical handovers with permissions, audit logs and multi-doctor treatment visibility.",
  },
];

// Animation Variants
const cardVariants = {
  initial: { opacity: 0, scale: 0.9, y: 40 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6 } },
  hover:  { scale: 1.04, rotateX: 3, rotateY: -3, transition: { duration: 0.3 } }
};

const FeaturesSection = () => {
  return (
    <section className="w-full py-24 relative overflow-hidden bg-gradient-to-b from-[#DFFFF6] via-white to-[#E3F3FF]">

      {/* Soft Breathing BG Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-teal-200 via-blue-200 to-indigo-200 blur-[110px] opacity-30 animate-pulse -z-10"></div>

      <div className="max-w-7xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900">
            Core Functions of DocPad System
          </h2>
          <p className="text-gray-700 mt-3 max-w-xl mx-auto leading-relaxed">
            Designed to reduce documentation load, speed clinical work, and centralize patient information.
          </p>
        </motion.div>


        {/* Animated Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              initial="initial"
              whileInView="animate"
              whileHover="hover"
              viewport={{ once: true }}
              className="relative p-8 rounded-2xl border shadow-md backdrop-blur-lg bg-white/70 hover:shadow-2xl transition-all cursor-pointer"
            >
              {/* Neon Gradient Border on Hover */}
              <div className="absolute inset-0 rounded-2xl pointer-events-none border border-transparent hover:border-teal-500/60 transition duration-500"></div>

              <div className="flex items-start gap-5">
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="p-3 bg-white rounded-xl shadow-inner"
                >
                  {feature.icon}
                </motion.div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 text-sm mt-1 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}

        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
