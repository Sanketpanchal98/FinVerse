import React, { useEffect, useState } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement, 
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Colors,
} from 'chart.js';
import { BarChart3, TrendingUp, Calendar, Grid3x3, RefreshCw, Download, Settings, Maximize2 } from 'lucide-react';
import CustomDropdown from '../Custom/CustomDropDown';
import PieChart from '../Custom/PieChart';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement, 
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
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Data processing
    const labels = [...new Set(expenses.map((expense) => expense[xAxis]))];
    
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
        labels: maintainedLabels,
        datasets: [
            {
                label: 'Expense in Rs.',
                data: dataMap,
                backgroundColor: theme ? '#3B82F6' : '#60A5FA',
                borderColor: theme ? '#2563EB' : '#3B82F6',
                borderWidth: 2,
                borderRadius: 4,
                hoverBackgroundColor: theme ? '#2563EB' : '#3B82F6',
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: theme ? '#374151' : '#D1D5DB',
                    font: {
                        size: 12,
                        weight: '500'
                    }
                },
                position: 'top',
            },
            title: {
                display: true,
                text: `Expense Analysis by ${xAxis.charAt(0).toUpperCase() + xAxis.slice(1)}`,
                color: theme ? '#111827' : '#F9FAFB',
                font: {
                    size: 16,
                    weight: 'bold',
                },
                padding: 20
            },
            tooltip: {
                backgroundColor: theme ? '#374151' : '#1F2937',
                titleColor: '#F9FAFB',
                bodyColor: '#F9FAFB',
                borderColor: theme ? '#6B7280' : '#4B5563',
                borderWidth: 1,
                cornerRadius: 8,
                displayColors: false,
                callbacks: {
                    label: function(context) {
                        return `₹${context.parsed.y.toLocaleString()}`;
                    }
                }
            }
        },
        scales: {
            x: {
                ticks: { 
                    color: theme ? '#374151' : '#D1D5DB',
                    font: { size: 11 }
                },
                grid: { 
                    color: theme ? '#E5E7EB' : '#374151',
                    lineWidth: 0.5
                },
                border: {
                    color: theme ? '#D1D5DB' : '#4B5563'
                }
            },
            y: {
                ticks: { 
                    color: theme ? '#374151' : '#D1D5DB',
                    font: { size: 11 },
                    callback: function(value) {
                        return '₹' + value.toLocaleString();
                    }
                },
                grid: { 
                    color: theme ? '#E5E7EB' : '#374151',
                    lineWidth: 0.5
                },
                border: {
                    color: theme ? '#D1D5DB' : '#4B5563'
                }
            },
        },
    };

    const chartComponent = {
        bar: <Bar data={chartData} options={chartOptions} />,
        line: <Line data={chartData} options={chartOptions} />,
        pie: <PieChart data={pieData} />
    };

    const totalExpenses = expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0);

    return (
        <div className={`w-full flex flex-col gap-4 transition-all duration-500 lg:h-[640px] overflow-auto ${theme ? 'bg-light-background text-dark' : 'bg-dark-background text-light'}`}>
      {/* Add Expense Form */}
      <div className={`w-full rounded-xl shadow p-4 sm:p-6 ${theme ? 'bg-white text-[#0F172A]' : 'bg-[#1E293B] text-white'}`}>
                
                {/* Header Section */}
                <div className={`p-4 sm:p-6 border-b ${theme ? "border-gray-200" : "border-gray-700"}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h2 className={`text-xl sm:text-2xl font-bold ${theme ? "text-gray-900" : "text-gray-100"}`}>
                                Expense Analytics
                            </h2>
                            <p className={`text-sm mt-1 ${theme ? "text-gray-600" : "text-gray-400"}`}>
                                Total: ₹{totalExpenses.toLocaleString()} • {expenses.length} transactions
                            </p>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setIsFullscreen(!isFullscreen)}
                                className={`p-2 rounded-lg transition-colors ${
                                    theme 
                                        ? "hover:bg-gray-100 text-gray-600" 
                                        : "hover:bg-gray-700 text-gray-400"
                                }`}
                                title="Toggle fullscreen"
                            >
                                <Maximize2 size={16} />
                            </button>
                            {/* <button
                                className={`p-2 rounded-lg transition-colors ${
                                    theme 
                                        ? "hover:bg-gray-100 text-gray-600" 
                                        : "hover:bg-gray-700 text-gray-400"
                                }`}
                                title="Download chart"
                            >
                                <Download size={16} />
                            </button>
                            <button
                                className={`p-2 rounded-lg transition-colors ${
                                    theme 
                                        ? "hover:bg-gray-100 text-gray-600" 
                                        : "hover:bg-gray-700 text-gray-400"
                                }`}
                                title="Refresh data"
                            >
                                <RefreshCw size={16} />
                            </button> */}
                        </div>
                    </div>
                </div>

                {/* Controls Section */}
                <div className={`p-4 sm:p-6 border-b ${theme ? "border-gray-200" : "border-gray-700"}`}>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <CustomDropdown
                            options={[
                                { cat: "bar", icon: "ri-bar-chart-fill" }, 
                                { cat: "pie", icon: "ri-pie-chart-line" }, 
                                { cat: "line", icon: "ri-line-chart-line" }
                            ]}
                            selected={chartType}
                            setSelected={setChartType}
                            label="Chart Type"
                        />
                        <CustomDropdown
                            options={[
                                { cat: 'category', icon: 'ri-equalizer-line' }, 
                                { cat: 'date', icon: 'ri-calendar-line' }
                            ]}
                            selected={xAxis}
                            setSelected={setXAxis}
                            label="Group By"
                        />
                    </div>
                </div>

                {/* Chart Section */}
                <div className="flex-1 overflow-hidden">
                    <div className={`h-full ${
                        // Only add y-scroll on desktop (lg and up)
                        'lg:overflow-y-auto overflow-x-hidden'
                    }`}>
                        <div className="p-4 sm:p-6">
                            {!expenses || expenses.length === 0 ? (
                                <div className={`flex flex-col items-center justify-center h-64 rounded-lg border-2 border-dashed ${
                                    theme ? "border-gray-300 bg-gray-50" : "border-gray-600 bg-gray-800"
                                }`}>
                                    <BarChart3 size={48} className={theme ? "text-gray-400" : "text-gray-600"} />
                                    <p className={`mt-4 text-lg font-medium ${theme ? "text-gray-600" : "text-gray-400"}`}>
                                        No data to display
                                    </p>
                                    <p className={`mt-2 text-sm ${theme ? "text-gray-500" : "text-gray-500"}`}>
                                        Add some expenses to see your analytics
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {/* Stats Cards */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div className={`p-4 rounded-lg border ${theme ? "bg-white border-gray-200" : "bg-gray-800 border-gray-700"}`}>
                                            <div className="flex items-center gap-2">
                                                <div className={`p-2 rounded-lg ${theme ? "bg-blue-50" : "bg-blue-900/20"}`}>
                                                    <BarChart3 size={16} className="text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className={`text-xs font-medium ${theme ? "text-gray-600" : "text-gray-400"}`}>
                                                        Total Expenses
                                                    </p>
                                                    <p className={`text-lg font-bold ${theme ? "text-gray-900" : "text-gray-100"}`}>
                                                        ₹{totalExpenses.toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className={`p-4 rounded-lg border ${theme ? "bg-white border-gray-200" : "bg-gray-800 border-gray-700"}`}>
                                            <div className="flex items-center gap-2">
                                                <div className={`p-2 rounded-lg ${theme ? "bg-green-50" : "bg-green-900/20"}`}>
                                                    <TrendingUp size={16} className="text-green-600" />
                                                </div>
                                                <div>
                                                    <p className={`text-xs font-medium ${theme ? "text-gray-600" : "text-gray-400"}`}>
                                                        Average
                                                    </p>
                                                    <p className={`text-lg font-bold ${theme ? "text-gray-900" : "text-gray-100"}`}>
                                                        ₹{Math.round(totalExpenses / expenses.length).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className={`p-4 rounded-lg border ${theme ? "bg-white border-gray-200" : "bg-gray-800 border-gray-700"}`}>
                                            <div className="flex items-center gap-2">
                                                <div className={`p-2 rounded-lg ${theme ? "bg-purple-50" : "bg-purple-900/20"}`}>
                                                    <Grid3x3 size={16} className="text-purple-600" />
                                                </div>
                                                <div>
                                                    <p className={`text-xs font-medium ${theme ? "text-gray-600" : "text-gray-400"}`}>
                                                        Categories
                                                    </p>
                                                    <p className={`text-lg font-bold ${theme ? "text-gray-900" : "text-gray-100"}`}>
                                                        {[...new Set(expenses.map(e => e.category))].length}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className={`p-4 rounded-lg border ${theme ? "bg-white border-gray-200" : "bg-gray-800 border-gray-700"}`}>
                                            <div className="flex items-center gap-2">
                                                <div className={`p-2 rounded-lg ${theme ? "bg-orange-50" : "bg-orange-900/20"}`}>
                                                    <Calendar size={16} className="text-orange-600" />
                                                </div>
                                                <div>
                                                    <p className={`text-xs font-medium ${theme ? "text-gray-600" : "text-gray-400"}`}>
                                                        Transactions
                                                    </p>
                                                    <p className={`text-lg font-bold ${theme ? "text-gray-900" : "text-gray-100"}`}>
                                                        {expenses.length}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Chart Container */}
                                    <div className={`p-4 sm:p-6 rounded-xl border shadow-sm ${
                                        theme ? "bg-white border-gray-200" : "bg-gray-800 border-gray-700"
                                    }`}>
                                        <div className="w-full h-64 sm:h-80 lg:h-96">
                                            {chartComponent[chartType]}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChartVisualization;