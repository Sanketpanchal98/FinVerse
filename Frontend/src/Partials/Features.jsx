import React from "react";
import { useSelector } from "react-redux";
import { FaChartLine, FaPiggyBank, FaRobot, FaShieldAlt } from "react-icons/fa";

const features = [
  {
    icon: <FaChartLine size={30} />,
    title: "Smart Expense Insights",
    description: "Understand where your money goes — auto-categorized expenses reveal hidden patterns and poor habits instantly.",
  },
  {
    icon: <FaPiggyBank size={30} />,
    title: "Goal-Based Budgeting",
    description: "Set financial goals (EMIs, trips, savings) and watch FinVerse allocate every rupee wisely.",
  },
  {
    icon: <FaRobot size={30} />,
    title: "AI-Powered Suggestions",
    description: "AI learns from your spending and nudges you to take smarter actions — save more, waste less.",
  },
  {
    icon: <FaShieldAlt size={30} />,
    title: "Privacy-First Design",
    description: "Your data never leaves your device. Encrypted, secure, and designed with privacy at its core.",
  },
];

export function Features({id}) {
  const theme = useSelector((state) => state.theme.theme);

  return (
    <section
      className={`w-full py-16 px-6 md:px-20 transition-all duration-500 ${
        theme ? "bg-light-background text-light-text" : "bg-dark-background text-dark-text"
      }`}
      id={id}
    >
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">
          Why FinVerse?
        </h2>
        <p className="text-lg md:text-xl max-w-2xl mx-auto text-gray-400">
          It’s not about tracking money. It’s about transforming habits.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`p-6 rounded-2xl shadow-lg transition hover:scale-[1.02] ${
              theme ? "bg-white text-gray-800" : "bg-[#1f2937] text-gray-100"
            }`}
          >
            <div className="mb-4 text-green-400">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
