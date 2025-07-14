import React from "react";
import { useSelector } from "react-redux";
import { FaUserGraduate, FaBriefcase, FaHome } from "react-icons/fa";

const scenarios = [
  {
    icon: <FaUserGraduate size={28} />,
    title: "For Students",
    description: "Track hostel fees, split bills, and save smartly without needing Excel sheets or confusion.",
  },
  {
    icon: <FaBriefcase size={28} />,
    title: "For Professionals",
    description: "Analyze salary flow, control weekend spending, and finally make that SIP commitment.",
  },
  {
    icon: <FaHome size={28} />,
    title: "For Families",
    description: "Manage groceries, EMIs, and children’s education expenses all in one simple dashboard.",
  },
];

export function RealLifeScenarios() {
  const theme = useSelector((state) => state.theme.theme);

  return (
    <section className={`py-16 px-6 md:px-20 transition-all duration-500 ${
      theme ? "bg-light-background text-light-text" : "bg-dark-background text-dark-text"
    }`}>
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-bold">Fits Your Life</h2>
        <p className="text-lg mt-3 text-gray-400">Whether you're a student, working pro, or managing a household — FinVerse adapts to you.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {scenarios.map((item, i) => (
          <div key={i} className={`p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 ${
            theme ? "bg-white text-gray-800" : "bg-[#1f2937] text-gray-100"
          }`}>
            <div className="mb-4 text-green-400">{item.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
            <p className="text-sm text-gray-400">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
