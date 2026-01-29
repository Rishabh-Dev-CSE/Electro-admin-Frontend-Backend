import React from "react";
import { Check, X } from "lucide-react";

export default function SuccessErrorCard({
  type = "success",
  title,
  message,
  buttonText,
  onClick,
}) {
  const isError = type === "error";

  

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* 🔹 BLUR + DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

      {/* 🔹 CARD (NO BLUR) */}
      <div className="relative w-[300px] rounded-2xl bg-white shadow-2xl p-6 text-center">

        {/* Icon */}
        <div
          className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${
            isError ? "bg-red-500" : "bg-blue-600"
          }`}
        >
          {isError ? (
            <X size={26} className="text-white" />
          ) : (
            <Check size={26} className="text-white" />
          )}
        </div>

        {/* Title */}
        <h2
          className={`text-lg font-semibold ${
            isError ? "text-red-600" : "text-blue-600"
          }`}
        >
          {title || (isError ? "Error" : "Success")}
        </h2>

        {/* Message */}
        <p className="mt-2 text-sm text-gray-500">
          {message || "Lorem ipsum dolor sit amet, consectetur adipiscing elit."}
        </p>

        {/* Button */}
        <button
          onClick={onClick}
          className={`mt-5 w-full rounded-lg py-2 text-sm font-medium text-white ${
            isError
              ? "bg-red-500 hover:bg-red-600"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {buttonText || (isError ? "Try again" : "Continue")}
        </button>
      </div>

    </div>
  );
}
