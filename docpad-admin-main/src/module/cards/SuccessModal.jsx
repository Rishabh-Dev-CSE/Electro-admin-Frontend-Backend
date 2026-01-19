import React from "react";
import { Check } from "lucide-react";

function SuccessModal({ open, message, buttonText, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div className="bg-[#0d1117] border border-gray-700 w-full max-w-sm px-8 py-8 rounded-2xl shadow-xl text-center">
        
        <div className="w-14 h-14 rounded-full mx-auto flex items-center justify-center bg-green-500/10 mb-4">
          <Check className="text-green-500" size={32} />
        </div>

        <h2 className="text-white text-xl font-semibold mb-2">Success</h2>

        <p className="text-gray-400 text-sm mb-6">{message}</p>

        <button
          onClick={onClose}
          className="w-full py-2 rounded-lg text-white font-medium bg-[#6366f1] hover:bg-[#575be8] transition"
        >
          {buttonText}
        </button>

      </div>
    </div>
  );
}

export default SuccessModal;
