import { restoreTextDirection } from 'chart.js/helpers';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import PieChart from './PieChart';

const ReturnCalculator = () => {
    const { theme } = useSelector(state => state.theme);

    const [typeSIP, setTypeSIP] = useState('monthly');
    const [sip, setSIP] = useState(25000);
    const [duration, setDuration] = useState(1);
    const [interest, setIntereset] = useState('');
    const [returnAmt, setReturnAmt] = useState(0);

    const monthlySipCalc = () => {
        const monthlyRate = (interest / 100) / 12;
        const months = duration * 12;
        const factor = Math.pow(1 + monthlyRate, months);
        const futureValue = sip * ((factor - 1) / monthlyRate) * (1 + monthlyRate);
        setReturnAmt(futureValue);
    };

    const oneTimeSipCalc = () => {
        const res = (sip * Math.pow((1 + (interest/100)),duration ))
        setReturnAmt(res)
    }

    return (
        <div className='w-full h-full p-4 md:p-8 overflow-auto scrollbar-hide '>
            <div className='max-w-4xl mx-auto flex flex-col gap-10'>

                {/* SIP Type Selector */}
                <div className='flex justify-center '>
                    <ul className='flex flex-wrap transition-all duration-400 rounded-xl shadow-sm'>
                        <li
                            className={`px-4 shadow-md hover:shadow-green-300 py-2 text-sm sm:text-base cursor-pointer rounded-l-xl transition-all duration-400 ${typeSIP === 'monthly' ? 'bg-green-200 text-green-900' : 'bg-white text-black'}`}
                            onClick={() => setTypeSIP('monthly')}
                        >
                            Monthly SIP
                        </li>
                        <li
                            className={`px-4 shadow-md hover:shadow-green-300 py-2 text-sm sm:text-base cursor-pointer rounded-r-xl ${typeSIP === 'one-time' ? 'bg-green-200 text-green-900' : 'bg-white text-black'}`}
                            onClick={() => setTypeSIP('one-time')}
                        >
                            One-Time
                        </li>
                    </ul>
                </div>

                {/* Investment Input Section */}
                <section className='flex flex-col gap-4'>
                    <label className='text-sm sm:text-base font-medium'>Investment Amount (Rs.)</label>
                    <input
                        type="number"
                        value={sip}
                        className={`remove-arrow w-full sm:w-60 border-2 rounded-xl px-4 py-2 focus:border-green-300 focus:outline-none ${theme ? 'bg-light-surface text-light-text' : 'bg-dark-surface text-dark-text'}`}
                        onChange={(e) => setSIP(e.target.value)}
                    />
                    <input
                        type="range"
                        onChange={(e) => setSIP(e.target.value)}
                        max={50000}
                        min={0}
                        step={500}
                        value={sip}
                        className='accent-green-400 w-full'
                    />
                </section>

                {/* Duration and Interest Section */}
                <div className='flex flex-col md:flex-row gap-4 md:gap-8'>
                    <div className='flex flex-col flex-1'>
                        <label className='text-sm sm:text-base font-medium'>Duration (in years)</label>
                        <input
                            type="number"
                            className={`remove-arrow w-full border-2 rounded-xl px-4 py-2 focus:border-green-300 focus:outline-none ${theme ? 'bg-light-surface text-light-text' : 'bg-dark-surface text-dark-text'}`}
                            placeholder='e.g., 5'
                            onChange={(e) => setDuration(e.target.value)}
                        />
                    </div>

                    <div className='flex flex-col flex-1'>
                        <label className='text-sm sm:text-base font-medium'>Expected Annual Return (%)</label>
                        <input
                            type="number"
                            className={`remove-arrow w-full border-2 rounded-xl px-4 py-2 focus:border-green-300 focus:outline-none ${theme ? 'bg-light-surface text-light-text' : 'bg-dark-surface text-dark-text'}`}
                            placeholder='e.g., 12'
                            onChange={(e) => setIntereset(e.target.value)}
                        />
                    </div>
                </div>

                {/* Calculate Button */}
                <button
                    onClick={typeSIP == 'monthly' ? monthlySipCalc : oneTimeSipCalc}
                    className='self-start bg-green-500 text-white px-6 py-2 rounded-xl shadow hover:bg-green-600 transition'
                >
                    Calculate
                </button>

                {/* Result Display */}
                {
                    returnAmt > 0 && (
                        <div className='text-lg font-semibold text-green-700'>
                            Estimated Return: ₹{returnAmt.toFixed(2).toLocaleString()}
                        </div>
                    )
                }

                {
                    returnAmt > 0 && (<PieChart sip={sip} years={duration} interest={interest} returnAmt={returnAmt} typeSIP={typeSIP}/>)
                }

            </div>
        </div>
    );
};

export default ReturnCalculator;
