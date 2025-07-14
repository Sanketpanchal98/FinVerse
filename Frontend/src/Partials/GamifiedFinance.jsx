import React from "react";
import { useSelector } from "react-redux";

export function GamifiedFinance() {
  const theme = useSelector((state) => state.theme.theme);

  return (
    <section className={`py-16 px-6 md:px-20 transition-all duration-500 ${
      theme ? "bg-[#f0fdf4] text-light-text" : "bg-[#111827] text-dark-text"
    }`}>
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-bold">Turn Finance Into a Game</h2>
        <p className="text-lg mt-3 text-gray-400">Track goals, unlock achievements, and build streaks that reward better money habits.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
        <div className="bg-green-100 dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <h3 className="text-2xl font-bold mb-2 text-green-600">7-Day Streak</h3>
          <p className="text-sm text-gray-500">You've logged expenses every day this week. Keep it going!</p>
        </div>
        <div className="bg-green-100 dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <h3 className="text-2xl font-bold mb-2 text-green-600">₹5,000 Saved</h3>
          <p className="text-sm text-gray-500">You're 50% to your savings goal this month. Great job!</p>
        </div>
        <div className="bg-green-100 dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <h3 className="text-2xl font-bold mb-2 text-green-600">No Spend Weekend</h3>
          <p className="text-sm text-gray-500">You avoided impulse buys for 2 days straight. Gold badge earned.</p>
        </div>
      </div>
    </section>
  );
}
