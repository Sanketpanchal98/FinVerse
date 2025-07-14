// src/components/ExpensesData.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addExpense } from '../API/Expense.api';
import { addExpenses } from '../Slices/ExpenseSlice';

const ExpensesData = () => {

  const dispatch = useDispatch()

  const [addexp, setAddexp] = useState(false);
  //form components
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');
  //redux states 
  const theme = useSelector((state) => state.theme.theme);

  //form handling
  const handleSubmit = async (e) => {

    e.preventDefault();
    const data = {
      amount,
      category,
      note,
      date : currentDate
    }
    
    await addExpense(data);
    await dispatch(addExpenses(data));

  }

  //handling the date parsing
  const [currentDate, setCurrDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  })

  return (
    <div className={`w-full flex flex-col gap-4 transition-all duration-500 lg:h-[640px] overflow-auto ${theme ? 'bg-light-background text-dark' : 'bg-dark-background text-light'}`}>
      {/* Add Expense Form */}
      <div className={`w-full rounded-xl shadow p-4 sm:p-6 ${theme ? 'bg-white text-[#0F172A]' : 'bg-[#1E293B] text-white'}`}>
        <div className='flex justify-between items-center h-12 sm:h-14 px-2 sm:px-6'>
          <h2 className="text-lg sm:text-xl font-semibold">Add New Expense</h2>
          <button
            className={`transition-transform duration-300 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${!addexp ? "rotate-180" : "rotate-0"}`}
            onClick={() => setAddexp(prev => !prev)}
            aria-label={addexp ? "Show form" : "Hide form"}
          >
            <i className="ri-arrow-up-wide-line text-xl sm:text-2xl"></i>
          </button>
        </div>
        <form className={`flex flex-col gap-3 sm:gap-4 overflow-hidden transition-all duration-500 ease-in-out 
    ${addexp ? "max-h-0 opacity-0" : "max-h-[500px] opacity-100"}`}
          onSubmit={(e) => handleSubmit(e)}
        >
          {/* Amount Input */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">Amount</label>
            <input
              type="number"
              placeholder="₹ Enter amount"
              onChange={(e) => setAmount(e.target.value)}
              className={`p-3 rounded-xl border-2 focus:outline-none focus:shadow-md focus:shadow-green-400 transition-all text-base ${theme ? 'border-gray-300 bg-light-background text-dark focus:border-green-500' : 'border-slate-700 bg-dark-background text-white focus:border-green-400'}`}
              required
            />
          </div>

          {/* Category and Date Row - Responsive */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-1 text-gray-600 dark:text-gray-300 block">Category</label>
              <select 
                className={`w-full p-3 rounded-xl border-2 focus:outline-none focus:shadow-md focus:shadow-green-400 transition-all text-base ${theme ? 'border-gray-300 bg-light-background text-dark focus:border-green-500' : 'border-slate-700 bg-dark-background text-white focus:border-green-400'}`}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Select Category</option>
                <option value="Food">🍔 Food</option>
                <option value="Travel">🚗 Travel</option>
                <option value="Rent">🏠 Rent</option>
                <option value="EMI">💳 EMI</option>
                <option value="Shopping">🛍️ Shopping</option>
                <option value="Entertainment">🎬 Entertainment</option>
                <option value="Healthcare">🏥 Healthcare</option>
                <option value="Utilities">⚡ Utilities</option>
                <option value="Other">📝 Other</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium mb-1 text-gray-600 dark:text-gray-300 block">Date</label>
              <input
                type="date"
                value={currentDate}
                className={`w-full p-3 rounded-xl border-2 focus:outline-none focus:shadow-md focus:shadow-green-400 transition-all text-base ${theme ? 'border-gray-300 bg-light-background text-dark focus:border-green-500' : 'border-slate-700 bg-dark-background text-white focus:border-green-400'}`}
                onChange={(e) => setCurrDate(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Note Input */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">Note (Optional)</label>
            <textarea
              rows="3"
              placeholder="Add a note about this expense..."
              className={`p-3 rounded-xl border-2 focus:outline-none focus:shadow-md focus:shadow-green-400 transition-all resize-none text-base ${theme ? 'border-gray-300 bg-light-background text-dark focus:border-green-500' : 'border-slate-700 bg-dark-background text-white focus:border-green-400'}`}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-green-600 text-white py-3 px-6 rounded-xl hover:bg-green-700 transition-all font-medium text-base shadow-md hover:shadow-lg active:transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            <i className="ri-add-line mr-2"></i>
            Add Expense
          </button>
        </form>
      </div>

      {/* AI Suggestions */}
      <div className={`w-full rounded-xl shadow p-4 sm:p-6 ${theme ? 'bg-white text-[#0F172A]' : 'bg-[#1E293B] text-white'}`}>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl sm:text-2xl">💡</span>
          <h2 className="text-lg sm:text-xl font-semibold">AI Suggestions</h2>
        </div>
        <p className={`text-sm mb-4 ${theme ? 'text-gray-600' : 'text-gray-300'}`}>
          Based on your recent spending trends:
        </p>
        
        {/* Suggestions List - Responsive Cards */}
        <div className="flex flex-col gap-3">
          <div className={`p-3 rounded-lg border-l-4 border-orange-400 ${theme ? 'bg-orange-50 text-orange-800' : 'bg-orange-900/20 text-orange-300'}`}>
            <div className="flex items-start gap-2">
              <i className="ri-restaurant-line text-lg mt-0.5"></i>
              <div>
                <p className="text-sm font-medium">Dining Out Alert</p>
                <p className="text-xs opacity-80">Try reducing your dining out expenses this week</p>
              </div>
            </div>
          </div>
          
          <div className={`p-3 rounded-lg border-l-4 border-blue-400 ${theme ? 'bg-blue-50 text-blue-800' : 'bg-blue-900/20 text-blue-300'}`}>
            <div className="flex items-start gap-2">
              <i className="ri-car-line text-lg mt-0.5"></i>
              <div>
                <p className="text-sm font-medium">Travel Spending</p>
                <p className="text-xs opacity-80">You spent ₹1,200 more on travel this month</p>
              </div>
            </div>
          </div>
          
          <div className={`p-3 rounded-lg border-l-4 border-green-400 ${theme ? 'bg-green-50 text-green-800' : 'bg-green-900/20 text-green-300'}`}>
            <div className="flex items-start gap-2">
              <i className="ri-shopping-cart-line text-lg mt-0.5"></i>
              <div>
                <p className="text-sm font-medium">Budget Suggestion</p>
                <p className="text-xs opacity-80">Consider setting a budget for groceries</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* View More Button */}
        <button className={`w-full mt-4 py-2 px-4 rounded-lg text-sm font-medium transition-all ${theme ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
          View More Insights
          <i className="ri-arrow-right-line ml-2"></i>
        </button>
      </div>
    </div>
  );
};

export default ExpensesData;