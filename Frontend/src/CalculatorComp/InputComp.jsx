import React from 'react'
import { useSelector } from 'react-redux'

const InputComp = ({val, setval, heading}) => {

    const { theme } = useSelector(state => state.theme)

    return (
        <div className='flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center'>
            <h1 className='font-semibold w-full sm:w-2/12'>{heading}</h1>
            <input
                type="range"
                className='w-full sm:w-7/12 accent-green-400'
                max={5000000}
                min={10000}
                value={val}
                onChange={(e) => setval(e.target.value)}
            />
            <input
                type="number"
                value={val}
                className={`w-full sm:w-3/12 remove-arrow border-b-2 rounded-xl px-4 py-2 focus:shadow-green-300 focus:shadow-md focus:outline-none ${theme ? 'bg-light-surface text-light-text' : 'bg-dark-surface text-dark-text'}`}
                onChange={(e) => setval(e.target.value)}
            />
        </div>
    )
}

export default InputComp
