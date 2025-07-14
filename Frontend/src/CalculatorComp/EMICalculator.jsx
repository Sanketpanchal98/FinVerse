import { div } from 'framer-motion/client'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import SIPChart from './PieChart'
import EMIChart from './EMIchart'

const EMICalculator = () => {
    const { theme } = useSelector(state => state.theme)

    // emi formula - [P x R x (1+R)^N] / [(1+R)^N
    //state for loan amount
    const [loanAmt, setLoanAmt] = useState(10000)
    const [rate, setRate] = useState(1.1)
    const [tenure, setTenure] = useState(1)
    const [downPayment, setDownPayment] = useState(0)

    //state for emi
    const [emi, setEmi] = useState(0)

    //function to find the emi
    const emiCalc = () => {
        const P = loanAmt - downPayment
        const annualRate = (rate / 100) / 12
        const effectCompunding = Math.pow((1 + annualRate), tenure * 12)
        const div = effectCompunding - 1
        const N = effectCompunding / div
        const emi = P * annualRate * N;

        setEmi(emi)
    }

    return (
        <div className='w-full h-full p-4 md:p-8 overflow-auto scrollbar-hide'>
            <div className='max-w-4xl mx-auto flex flex-col gap-10'>

                {/* div for loan amount */}
                <div className='flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center'>
                    <h1 className='font-semibold w-full sm:w-2/12'>Loan Amount</h1>
                    <input
                        type="range"
                        className='w-full sm:w-7/12 accent-green-400'
                        max={5000000}
                        min={10000}
                        value={loanAmt}
                        onChange={(e) => setLoanAmt(e.target.value)}
                    />
                    <input
                        type="number"
                        value={loanAmt}
                        className={`w-full sm:w-3/12 remove-arrow border-b-2 rounded-xl px-4 py-2 focus:shadow-green-300 focus:shadow-md focus:outline-none ${theme ? 'bg-light-surface text-light-text' : 'bg-dark-surface text-dark-text'}`}
                        onChange={(e) => setLoanAmt(e.target.value)}
                    />
                </div>

                {/* div for rate of interest */}
                <div className='flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center'>
                    <h1 className='font-semibold w-full sm:w-2/12'>Rate of interest (%)</h1>
                    <input
                        type="range"
                        className='w-full sm:w-7/12 accent-green-400'
                        max={100}
                        min={1}
                        value={rate}
                        onChange={(e) => setRate(e.target.value)}
                    />
                    <input
                        type="number"
                        value={rate}
                        className={`w-full sm:w-3/12 remove-arrow border-b-2 rounded-xl px-4 py-2 focus:shadow-green-300 focus:shadow-md focus:outline-none ${theme ? 'bg-light-surface text-light-text' : 'bg-dark-surface text-dark-text'}`}
                        onChange={(e) => setRate(e.target.value)}
                    />
                </div>

                {/* div for duration */}
                <div className='flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center'>
                    <h1 className='font-semibold w-full sm:w-2/12'>Duration of Loan (Yrs.)</h1>
                    <input
                        type="range"
                        className='w-full sm:w-7/12 accent-green-400'
                        max={100}
                        min={1}
                        value={tenure}
                        onChange={(e) => setTenure(e.target.value)}
                    />
                    <input
                        type="number"
                        value={tenure}
                        className={`w-full sm:w-3/12 border-b-2 rounded-xl px-4 py-2 focus:shadow-green-300 focus:shadow-md focus:outline-none ${theme ? 'bg-light-surface text-light-text' : 'bg-dark-surface text-dark-text'}`}
                        onChange={(e) => setTenure(e.target.value)}
                    />
                </div>

                {/* div for down payment */}
                <div className='flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center'>
                    <h1 className='font-semibold w-full sm:w-2/12'>Down Payment (optional)</h1>
                    <input
                        type="range"
                        className='w-full sm:w-7/12 accent-green-400 outline-none'
                        max={5000000}
                        min={10000}
                        value={downPayment}
                        onChange={(e) => setDownPayment(e.target.value)}
                    />
                    <input
                        type="number"
                        value={downPayment}
                        className={`w-full sm:w-3/12 border-b-2 rounded-xl px-4 py-2 focus:shadow-green-300 focus:shadow-md focus:outline-none ${theme ? 'bg-light-surface text-light-text' : 'bg-dark-surface text-dark-text'}`}
                        onChange={(e) => setDownPayment(e.target.value)}
                    />
                </div>

                {/* calculate button */}
                <button
                    className='bg-green-600 w-full sm:w-2/12 py-2 rounded-xl'
                    onClick={() => emiCalc()}
                >
                    Calculate
                </button>

                {/* EMI Result */}
                {
                    emi > 0 && (
                        <div className='text-lg font-semibold text-green-700'>
                            Estimated EMI (Monthly): ₹{emi.toFixed(2).toLocaleString()}
                        </div>
                    )
                }

                {/* EMI Chart */}
                {
                    emi > 0 && (
                        <EMIChart
                            loanAmt={loanAmt}
                            rate={rate}
                            tenure={tenure}
                            emi={emi}
                            downpayment={downPayment}
                        />
                    )
                }

            </div>
        </div>
    );

}

export default EMICalculator
