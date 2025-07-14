import React from 'react'
import { useSelector } from 'react-redux'

const Autopay = () => {
    const { theme } = useSelector(state => state.theme)

    return (
        <div className={`w-full lg:h-[640px] flex flex-col transition-all duration-500 ${theme ? 'bg-light-background text-dark' : 'bg-dark-background text-light'}`}>

            <div className={`flex-1 min-h-0 mx-2 sm:mx-4`}>
                <div className={`h-full flex flex-col xl:flex-row rounded-xl shadow gap-4 ${theme ? 'bg-white text-[#0F172A]' : 'bg-[#1E293B] text-white'}`}>



                this is goals
                </div>
            </div>

        </div>
    )
}

export default Autopay
