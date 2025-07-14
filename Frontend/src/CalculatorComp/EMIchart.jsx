import React from 'react';
import { Line, Pie } from 'react-chartjs-2';

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const EMIChart = ({ emi, rate, downpayment, tenure, loanAmt }) => {

    const labels = ['Actual Amount', 'Interest Amount'];
    const dataSet = [loanAmt,(emi*tenure*12)-loanAmt]
    
  const data = {
    labels,
    datasets: [
      {
        label: 'Investment Growth',
        data: dataSet,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
    //   y: {
    //     // ticks: {
    //     //   callback: (val) => `₹${val.toLocaleString()}`,
    //     // },
    //   },
    },
  };

  return (
    <div className="w-9/12 max-w-4xl mx-auto">
      <Pie data={data} options={options}/>
    </div>
  );
};

export default EMIChart;
