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

const SIPChart = ({ sip, interest, years, returnAmt, typeSIP }) => {
//   const sipData = generateSipChartData(sip, interest, years);

//   const labels = sipData.map((d) => `Month ${d.month}`);
//   const amounts = sipData.map((d) => d.amount);
    const labels = ['invested', 'return']
    const amt = sip*years*12;
    const dataSet = (typeSIP == 'one-time') ? [sip,returnAmt-sip] : [amt, returnAmt-amt]
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
      y: {
        ticks: {
          callback: (val) => `₹${val.toLocaleString()}`,
        },
      },
    },
  };

  return (
    <div className="w-9/12 max-w-4xl mx-auto">
      <Pie data={data} options={options}/>
    </div>
  );
};

export default SIPChart;
