import React from 'react'
import { useSelector } from 'react-redux'

const FinGoals = () => {

    const { theme } = useSelector(state => state.theme)

    return (
        <div className={`w-10/12 flex flex-col gap-4 transition-all duration-500 ${theme ? 'bg-light-background text-dark' : 'bg-dark-background text-light'}`}>

      <div className={`w-full rounded-xl shadow p-6 ${theme ? 'bg-white text-[#0F172A]' : 'bg-[#1E293B] text-white'}`}>


            this is goals
        </div>
        </div>
    )
}

export default FinGoals
