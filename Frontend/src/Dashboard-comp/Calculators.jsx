import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import ReturnCalculator from '../CalculatorComp/ReturnCalculator'
import EMICalculator from '../CalculatorComp/EMICalculator'
import TaxCalculator from '../CalculatorComp/TaxCalculator'

const Calculators = () => {
    const { theme } = useSelector(state => state.theme)

    //calculator state
    const [calc, setCalc] = useState('emi');

    const calculators = [
        { 
            key: 'emi', 
            fullName: 'EMI Calculator', 
            shortName: 'EMI',
            icon: 'ri-calculator-line',
            description: 'Calculate loan EMI'
        },
        { 
            key: 'return', 
            fullName: 'Return Calculator', 
            shortName: 'Return',
            icon: 'ri-line-chart-line',
            description: 'Calculate investment returns'
        },
        { 
            key: 'tax', 
            fullName: 'Tax Estimator', 
            shortName: 'Tax',
            icon: 'ri-file-text-line',
            description: 'Estimate tax liability'
        }
    ];

    return (
        <div className={`w-full lg:h-[640px] flex flex-col transition-all duration-500 ${theme ? 'bg-light-background text-dark' : 'bg-dark-background text-light'}`}>
            {/* Main Calculator Section - Flexible Height */}
            {/* <div className={`flex-1 min-h-0 mx-2 sm:mx-4`}> */}
                <div className={`h-full flex flex-col xl:flex-row rounded-xl shadow gap-4 ${theme ? 'bg-white text-[#0F172A]' : 'bg-[#1E293B] text-white'}`}>
                    {/* Navigation Sidebar - Fixed Width */}
                    <div className="xl:w-1/4 w-full xl:h-full p-3 sm:p-4 md:p-6">
                        {/* Desktop/Tablet Navigation */}
                        <ul className='hidden sm:flex xl:flex-col flex-row justify-between xl:justify-start gap-2 sm:gap-4 xl:gap-6 px-1 sm:px-2 py-2'>
                            {calculators.map((calculator) => (
                                <li
                                    key={calculator.key}
                                    className={`transition-all duration-300 text-xs sm:text-sm xl:text-base font-semibold py-3 px-3 sm:px-4 xl:px-5 rounded-xl text-center hover:bg-green-700 hover:text-white cursor-pointer flex-1 xl:flex-none group ${calc === calculator.key ? 'bg-green-700 text-white' : `${theme ? 'hover:bg-green-50' : 'hover:bg-gray-700'}`}`}
                                    onClick={() => setCalc(calculator.key)}
                                >
                                    <div className="flex items-center justify-center xl:justify-start gap-2">
                                        <i className={`${calculator.icon} text-lg`}></i>
                                        <div className="flex flex-col xl:items-start items-center">
                                            <span className="hidden sm:inline xl:hidden">{calculator.shortName}</span>
                                            <span className="hidden xl:inline">{calculator.fullName}</span>
                                            <span className="hidden xl:block text-xs opacity-70 font-normal">{calculator.description}</span>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        {/* Mobile Navigation (Cards) */}
                        <div className="sm:hidden grid grid-cols-1 gap-3">
                            {calculators.map((calculator) => (
                                <div
                                    key={calculator.key}
                                    className={`transition-all duration-300 p-4 rounded-xl cursor-pointer border-2 ${calc === calculator.key 
                                        ? 'bg-green-700 text-white border-green-700' 
                                        : `${theme ? 'bg-gray-50 border-gray-200 hover:border-green-300' : 'bg-gray-800 border-gray-700 hover:border-green-600'}`
                                    }`}
                                    onClick={() => setCalc(calculator.key)}
                                >
                                    <div className="flex items-center gap-3">
                                        <i className={`${calculator.icon} text-2xl`}></i>
                                        <div>
                                            <h3 className="font-semibold text-base">{calculator.fullName}</h3>
                                            <p className="text-sm opacity-70">{calculator.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Calculator Content - Scrollable Area */}
                    <div className="xl:w-3/4 w-full xl:h-full min-h-0 flex-1">
                        <div className={`h-full rounded-lg transition-all duration-300 ${theme ? 'bg-gray-50' : 'bg-gray-900/50'} p-4 sm:p-6 xl:overflow-y-auto xl:max-h-full`}>
                            {calc === 'tax' && <TaxCalculator />}
                            {calc === 'emi' && <EMICalculator />}
                            {calc === 'return' && <ReturnCalculator />}
                        </div>
                    </div>
                </div>
            {/* </div> */}

            {/* Quick Tips Section - Fixed Height on Desktop */}
            {/* <div className={`w-full rounded-xl shadow p-4 sm:p-6 mx-2 sm:mx-4 md:mx-6 lg:mx-10 mb-4 xl:hidden ${theme ? 'bg-white text-[#0F172A]' : 'bg-[#1E293B] text-white'}`}>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <i className="ri-lightbulb-line text-yellow-500"></i>
                    Quick Tips
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className={`p-3 rounded-lg ${theme ? 'bg-blue-50 text-blue-800' : 'bg-blue-900/20 text-blue-300'}`}>
                        <i className="ri-calculator-line text-lg mb-2"></i>
                        <p className="text-sm font-medium">EMI Calculator</p>
                        <p className="text-xs opacity-80">Plan your loan payments effectively</p>
                    </div>
                    <div className={`p-3 rounded-lg ${theme ? 'bg-green-50 text-green-800' : 'bg-green-900/20 text-green-300'}`}>
                        <i className="ri-line-chart-line text-lg mb-2"></i>
                        <p className="text-sm font-medium">Return Calculator</p>
                        <p className="text-xs opacity-80">Estimate your investment growth</p>
                    </div>
                    <div className={`p-3 rounded-lg ${theme ? 'bg-purple-50 text-purple-800' : 'bg-purple-900/20 text-purple-300'}`}>
                        <i className="ri-file-text-line text-lg mb-2"></i>
                        <p className="text-sm font-medium">Tax Estimator</p>
                        <p className="text-xs opacity-80">Calculate your tax liability</p>
                    </div>
                </div>
            </div> */}
        </div>
    );
}

export default Calculators