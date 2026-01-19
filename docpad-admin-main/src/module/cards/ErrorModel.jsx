import React from "react";
import { X } from "lucide-react";

function ErrorModal({ open, message, buttonText, onClose,headingMessage }) {
  return (
    <div
      className={`
        ${open ? "opacity-100 visible" : "opacity-0 invisible"}
        fixed inset-0 flex items-center justify-center 
        bg-black/50 backdrop-blur-sm z-50 
        transition-all duration-300
      `}
    >
      <div
        className={`
          bg-[#0d1117] border border-gray-700 w-full max-w-sm px-8 py-8 
          rounded-2xl shadow-xl text-center transform 
          ${open ? "scale-100 opacity-100" : "scale-90 opacity-0"}
          transition-all duration-300 ease-out
        `}
      >
        <div className="w-14 h-14 rounded-full mx-auto flex items-center justify-center bg-red-500/10 mb-4 animate-pulse">
          <X className="text-red-500" size={32} />
        </div>

        <h2 className="text-white text-xl font-semibold mb-2">{headingMessage || "Failed (Error)" }</h2>

        <p className="text-gray-400 text-sm mb-6">{message}</p>

        <button
          onClick={onClose}
          className="w-full py-2 rounded-lg text-white font-medium bg-red-500 hover:bg-red-600 transition-all duration-300"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}

export default ErrorModal;
