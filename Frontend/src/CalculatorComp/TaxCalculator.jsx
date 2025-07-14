import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import InputComp from './InputComp';

const TaxCalculator = () => {

  const { theme } = useSelector(state => state.theme)

  //state for calclators
  const [salary, setSalary] = useState(0);
  const [rental, setRental] = useState(0)
  const [capitalGain, setCapitalGain] = useState(0);
  const [buissnessInc, setBuissnessInc] = useState(0)

  const [newTax, setNewTax] = useState(0)
  const [oldTax, setOldTax] = useState(0)

  const applySlabs = (taxableIncome, slabs, rebateLimit = 0) => {
    let tax = 0;

    for (let i = 1; i < slabs.length; i++) {
      const prev = slabs[i - 1].limit;
      const current = slabs[i].limit;
      if (taxableIncome > prev) {
        const incomeInSlab = Math.min(taxableIncome, current) - prev;
        tax += incomeInSlab * slabs[i].rate;
      }
    }

    // Apply 87A rebate
    if (rebateLimit && taxableIncome <= rebateLimit) {
      tax = Math.max(tax - 12500, 0);
    }

    // Add 4% health and education cess
    tax *= 1.04;
    return Math.round(tax);
  };

  const calcTaxOld = (taxableIncome) => {
    const slabs = [
      { limit: 0, rate: 0 },
      { limit: 250000, rate: 0 },
      { limit: 500000, rate: 0.05 },
      { limit: 1000000, rate: 0.2 },
      { limit: Infinity, rate: 0.3 }
    ];
    const tax = applySlabs(taxableIncome, slabs, 500000); // Rebate limit = 5L
    setOldTax(tax)
  };

  const calcTaxNew = (taxableIncome) => {
    const slabs = [
      { limit: 0, rate: 0 },
      { limit: 300000, rate: 0 },
      { limit: 600000, rate: 0.05 },
      { limit: 900000, rate: 0.10 },
      { limit: 1200000, rate: 0.15 },
      { limit: 1500000, rate: 0.20 },
      { limit: Infinity, rate: 0.30 }
    ];
    const tax = applySlabs(taxableIncome, slabs, 700000); // Rebate limit = 7L
    setNewTax(tax)
  };




  return (
    <div className='w-full h-full p-4 md:p-8 overflow-auto scrollbar-hide'>
      <div className='max-w-4xl mx-auto flex flex-col gap-10'>

        {/* div for income */}
        <InputComp val={salary} setval={setSalary} heading={'Salary amount'} />

        {/* div for rental Income */}
        <InputComp val={rental} setval={setRental} heading={'Rental Income'} />

        {/* div for capital gain  */}
        <InputComp val={capitalGain} setval={setCapitalGain} heading={'Capital Gain'} />

        {/* div for buissnessInc */}
        <InputComp val={buissnessInc} setval={setBuissnessInc} heading={'Buissness Income'} />

        {/* button to calculate tax */}
        <div className='w-full flex justify-between'>
          <button
            className='bg-green-500 py-2 px-4 rounded-xl '
            onClick={() => calcTaxNew((Number(salary) + Number(rental) + Number(capitalGain) + Number(buissnessInc)))}
          >Calculate Tax (New Regime)</button>
          <button
            className='bg-green-500 py-2 px-4 rounded-xl '

            onClick={() => calcTaxOld((Number(salary) + Number(rental) + Number(capitalGain) + Number(buissnessInc)))}
          >Calculate Tax (old Regime)</button>
        </div>

        {/* tax results */}
        {
          newTax > 0 && (
            <div className='text-lg font-semibold text-green-700'>
              Estimated Tax (new Regime) : ₹{newTax.toFixed(2).toLocaleString()}
            </div>
            
          )
        }
        {
          oldTax > 0 && (
            <div className='text-lg font-semibold text-green-700'>
              Estimated Tax (Old Regime): ₹{oldTax.toFixed(2).toLocaleString()}
            </div>
          )
        }



      </div>
    </div>
  )
}

export default TaxCalculator
