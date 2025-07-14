// src/components/CustomChartBuilder.jsx
import React, { useEffect, useState } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement, // ✅ Add this
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Colors,
} from 'chart.js';
import CustomDropdown from '../Custom/CustomDropDown';
import PieChart from '../Custom/PieChart';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,  // ✅ Register here
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Colors
);

const ChartVisualization = () => {

    const { expenses } = useSelector((state) => state.expense);
    const theme = useSelector((state) => state.theme.theme);

    const [chartType, setChartType] = useState('bar');
    const [xAxis, setXAxis] = useState('category');

    // const labels = [...new Set(expenses.map((expense) => expense[xAxis]))];
    // // console.log(labels.map((label) => label.split('T')[0]));

    // const dataMap = labels.map((label) => { 

    //     const totalAmount = expenses
    //         .filter((e) => e[xAxis] === label)
    //         .reduce((sum, curr) => {
    //             // console.log(sum)    ;

    //             return sum + curr.amount
    //         }, 0);
    //     return totalAmount;
    // });
    // console.log(dataMap);

    const labels = [...new Set(expenses.map((expense) => expense[xAxis]))]

    const dataMap = labels.map((label) => {
        const totalAmount = expenses
            .filter((e) => e[xAxis] === label)
            .reduce((sum, curr) => sum + Number(curr.amount || 0), 0);
        return totalAmount;
    });


    const maintainedLabels = xAxis === 'date' ? labels.map((label) => label.split('T')[0]) : labels;
    
    const pieData = maintainedLabels.map((label, idx) => ({
        label,
        value: dataMap[idx],
    }));
    
    const chartData = {
        labels : maintainedLabels,
        datasets: [
            {
                label: 'Expense in Rs.',
                data: dataMap,
                backgroundColor: theme ? '#16A34A' : '#22C55E',
                borderColor: theme ? '#16A34A' : '#22C55E',
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                labels: {
                    color: theme ? '#0F172A' : '#F8FAFC',
                },
            },
            title: {
                display: true,
                text: 'Expense Chart',
                color: theme ? '#0F172A' : '#F8FAFC',
                font: {
                    size: 18,
                    weight: 'bold',
                },
            },
        },
        scales: {
            x: {
                ticks: { color: theme ? '#0F172A' : '#F8FAFC' },
                grid: { color: theme ? '#E2E8F0' : '#334155' },

            },
            y: {
                ticks: { color: theme ? '#0F172A' : '#F8FAFC' },
                grid: { color: theme ? '#E2E8F0' : '#334155' },
            },
        },
    };

    const chartComponent = {
        bar: <Bar data={chartData} options={chartOptions} />,
        line: <Line data={chartData} options={chartOptions} />,
        pie: <PieChart data={pieData} />
    };

    return (
        <div className={`w-10/12 p-4 rounded-xl shadow duration-500 transition-all ${theme ? "bg-light-surface" : "bg-dark-surface"}`}>
            <div className={`mb-4 flex gap-4 flex ${theme ? "bg-light-surface text-light-text" : "bg-dark-surface"}`}>
                <CustomDropdown
                    options={[{ cat: "bar", icon: "ri-bar-chart-fill" }, { cat: "pie", icon: "ri-pie-chart-line" }, { cat: "line", icon: "ri-line-chart-line" }]}
                    selected={chartType}
                    setSelected={setChartType}
                />
                <CustomDropdown
                    options={[{ cat: 'category', icon: 'ri-equalizer-line' }, { cat: 'date', icon: 'ri-calendar-line' }]}
                    selected={xAxis}
                    setSelected={setXAxis}
                />
            </div>
            <div className={`w-full flex overflow-hidden ${theme ? "bg-light-surface" : "bg-dark-surface"}`}>
                <div className='w-9/12 overflow-hidden'>
                    {!expenses ? "no data to show" : chartComponent[chartType]}
                </div>
            </div>

        </div>
    );
};

export default ChartVisualization;
