import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { useSelector } from "react-redux";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const PieChart = ({ data }) => {
  const theme = useSelector((state) => state.theme.theme);
  const isDark = !theme; 

  const pieData = {
    labels: data.map((item) => item.label),
    datasets: [
      {
        label: "Expense Breakdown",
        data: data.map((item) => item.value),
        backgroundColor: isDark
          ? ["#8B5CF6", "#34D399", "#FBBF24", "#F87171", "#A78BFA"]
          : ["#6366F1", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"],
        borderWidth: 1,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: isDark ? "#F8FAFC" : "#0F172A",
        },
        position: "bottom",
      },
      title: {
        display: true,
        text: "Expenses by Category",
        color: isDark ? "#F8FAFC" : "#0F172A",
        font: {
          size: 18,
          weight: "bold",
        },
      },
    },
  };

  return (
    <div className={`w-full mx-auto p-4 rounded-xl ${theme ? "bg-light-surface text-light-text" : "bg-dark-surface"}`}>
      <Pie data={pieData} options={pieOptions} />
    </div>
  );
};

export default PieChart;
