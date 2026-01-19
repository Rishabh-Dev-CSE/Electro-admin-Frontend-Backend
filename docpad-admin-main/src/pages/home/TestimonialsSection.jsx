import React from "react";

const testimonials = [
  {
    name: "Amit Verma",
    role: "Owner, SpiceVilla Restaurant",
    comment:
      "QraMg completely changed how our restaurant works. Customers place orders themselves, and our staff workload has reduced drastically.",
    image: "https://i.pravatar.cc/150?img=12",
  },
  {
    name: "Priya Mehta",
    role: "Manager, Cafe Bliss",
    comment:
      "We no longer worry about printing new menus. I just update it in the dashboard, and it's live instantly for all tables.",
    image: "https://i.pravatar.cc/150?img=45",
  },
  {
    name: "Rohit Sharma",
    role: "Owner, UrbanTadka",
    comment:
      "The live order and payment system made billing super smooth. QraMg is now the digital backbone of our restaurant.",
    image: "https://i.pravatar.cc/150?img=32",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="w-full bg-gray-50 py-20 px-6 bg-gradient-to-b from-[#F9FAFB] via-white to-[#EFF6FF]">
      <div className="max-w-6xl mx-auto text-center">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          What Our Clients Say
        </h2>
        <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
          Real restaurant owners share their experience with QraMg — how it’s helping them save time and serve better.
        </p>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-8 flex flex-col items-center text-center"
            >
              <img
                src={t.image}
                alt={t.name}
                className="w-20 h-20 rounded-full mb-4 object-cover shadow-md"
              />
              <p className="text-gray-700 italic mb-4 leading-relaxed">
                “{t.comment}”
              </p>
              <h4 className="text-lg font-semibold text-gray-800">
                {t.name}
              </h4>
              <p className="text-gray-500 text-sm">{t.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
