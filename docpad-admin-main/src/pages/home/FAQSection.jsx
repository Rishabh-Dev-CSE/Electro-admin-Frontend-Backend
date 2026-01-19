import React, { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

const faqs = [
  {
    question: "What is QraMg?",
    answer:
      "QraMg is a SaaS platform that helps restaurants manage digital QR menus, table-based ordering, and live kitchen dashboards — all in one place.",
  },
  {
    question: "Can multiple restaurants use QraMg?",
    answer:
      "Yes! QraMg is built as a multi-restaurant SaaS system. Each restaurant can create its own account, customize menus, tables, and payment options.",
  },
  {
    question: "Do customers need to install any app?",
    answer:
      "No. Customers simply scan the table’s QR code using their phone camera, and the menu opens instantly in the browser.",
  },
  {
    question: "How does the payment work?",
    answer:
      "QraMg integrates with Razorpay for secure online payments. Each restaurant connects its own Razorpay account to receive direct payments.",
  },
  {
    question: "Is it easy to set up?",
    answer:
      "Absolutely! Once you sign up, you can add your restaurant details, menu, and tables in just a few minutes — no technical knowledge required.",
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full bg-white py-20 px-6 bg-gradient-to-b from-[#F9FAFB] via-white to-[#EFF6FF]">
      <div className="max-w-5xl mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find quick answers to common questions about how QraMg works.
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
            >
              <button
                className="w-full flex justify-between items-center text-left px-6 py-4 focus:outline-none"
                onClick={() => toggleFAQ(index)}
              >
                <span className="text-gray-800 font-medium text-lg">
                  {faq.question}
                </span>
                <FiChevronDown
                  className={`text-gray-500 text-xl transform transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openIndex === index && (
                <div className="px-6 pb-4 text-gray-600 text-sm leading-relaxed border-t border-gray-100">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
