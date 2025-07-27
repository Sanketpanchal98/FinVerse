// src/components/ExpensesData.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addExpense, deleteExpense } from '../API/Expense.api';
import { addExpenses, removeExpenses } from '../Slices/ExpenseSlice';
import { toast, ToastContainer } from 'react-toastify';

const ExpensesData = () => {
  const dispatch = useDispatch();

  const [addexp, setAddexp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [maxDate, setMaxDate] = useState(new Date().toISOString())
  
  // Form components
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');
  
  // Redux states 
  const theme = useSelector((state) => state.theme.theme);
  const expenses = useSelector((state) => state.expense.expenses);
  

  // Form handling
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const data = {
        amount: parseFloat(amount),
        category,
        note,
        date: currentDate
      };
      
      const res = await addExpense(data);
      await dispatch(addExpenses(res.data.data));
      toast.success('Expense Added Successfully')
      // Reset form
      setAmount('');
      setCategory('');
      setNote('');
      setAddexp(true); // Hide form after successful submission
    } catch (error) {
      console.error('Error adding expense:', error);
      toast.error('Adding Expense Failed')
      // Handle error (you can add toast notification here)
    } finally {
      setLoading(false);
    }
  };

  // Delete expense handler
  const handleDeleteExpense = async (expenseId) => {
    setDeleteLoading(expenseId);

    try {
      await deleteExpense(expenseId);
      dispatch(removeExpenses(expenseId));
      toast.success('Expense Deleted Successfully')
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast.error('Expense deletion failed')
    } finally {
      setDeleteLoading(null);
    }
  };

  // Handling the date parsing
  const [currentDate, setCurrDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  // Category icons mapping
  const getCategoryIcon = (category) => {
    const icons = {
      Food: '🍔',
      Travel: '🚗',
      Rent: '🏠',
      EMI: '💳',
      Shopping: '🛍️',
      Entertainment: '🎬',
      Health: '🏥',
      Utilities: '⚡',
      Other: '📝'
    };
    return icons[category] || '📝';
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-IN', { 
        day: '2-digit', 
        month: 'short',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };
  
  return (
    <div className={`w-full flex flex-col gap-6 transition-all duration-500 lg:h-[640px] overflow-auto ${theme ? 'bg-light-background text-dark' : 'bg-dark-background text-light'}`}>
      {/* Add Expense Form */}
      <div className={`w-full rounded-2xl shadow-lg p-4 sm:p-6 border transition-all duration-300 hover:shadow-xl ${theme ? 'bg-white text-[#0F172A] border-gray-100 hover:border-green-200' : 'bg-[#1E293B] text-white border-slate-700 hover:border-slate-600'}`}>
        <div className='flex justify-between items-center h-12 sm:h-14 px-2 sm:px-4'>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
              <i className="ri-add-line text-white text-lg"></i>
            </div>
            <h2 className="text-lg sm:text-xl font-bold">Add New Expense</h2>
          </div>
          <button
            className={`transition-all duration-300 p-2 rounded-xl hover:scale-105 ${theme ? 'hover:bg-gray-100' : 'hover:bg-gray-700'} ${!addexp ? "rotate-180" : "rotate-0"}`}
            onClick={() => setAddexp(prev => !prev)}
            aria-label={addexp ? "Show form" : "Hide form"}
          >
            <i className="ri-arrow-up-wide-line text-xl sm:text-2xl"></i>
          </button>
        </div>
        
        <form className={`flex flex-col gap-4 sm:gap-5 overflow-hidden transition-all duration-500 ease-in-out 
          ${addexp ? "max-h-0 opacity-0" : "max-h-[600px] opacity-100"}`}
          onSubmit={handleSubmit}
        >
          {/* Amount Input */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">Amount *</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg font-medium">₹</span>
              <input
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={`pl-10 pr-4 py-4 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all text-lg font-medium ${theme ? 'focus:ring-green-100 border-gray-200 bg-gray-50 text-dark focus:border-green-500 focus:bg-white' : 'focus:ring-green-900 border-slate-600 bg-slate-800 text-white focus:border-green-400 focus:bg-slate-700'}`}
                required
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {/* Category and Date Row */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 block mb-2">Category *</label>
              <select 
                value={category}
                className={`w-full p-4 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all text-base ${theme ? 'border-gray-200 bg-gray-50 text-dark focus:border-green-500 focus:bg-white focus:ring-green-100' : 'focus:ring-green-900 border-slate-600 bg-slate-800 text-white focus:border-green-400 focus:bg-slate-700'}`}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Choose Category</option>
                <option value="Food">🍔 Food & Dining</option>
                <option value="Travel">🚗 Travel & Transport</option>
                <option value="Rent">🏠 Rent & Housing</option>
                <option value="EMI">💳 EMI & Loans</option>
                <option value="Shopping">🛍️ Shopping</option>
                <option value="Entertainment">🎬 Entertainment</option>
                <option value="Health">🏥 Healthcare</option>
                <option value="Utilities">⚡ Utilities</option>
                <option value="Other">📝 Other</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 block mb-2">Date *</label>
              <input
                type="date"
                value={currentDate}
                className={`w-full p-4 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all text-base ${theme ? 'border-gray-200 bg-gray-50 text-dark focus:border-green-500 focus:bg-white focus:ring-green-100 ' : 'focus:ring-green-900 border-slate-600 bg-slate-800 text-white focus:border-green-400 focus:bg-slate-700'}`}
                onChange={(e) => setCurrDate(e.target.value)}
                required
                max={maxDate.split('T')[0]}
              />
            </div>
          </div>

          {/* Note Input */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">Note (Optional)</label>
            <textarea
              rows="3"
              placeholder="Add a note about this expense..."
              value={note}
              className={`p-4 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all resize-none text-base ${theme ? 'border-gray-200 bg-gray-50 text-dark focus:border-green-500 focus:bg-white focus:ring-green-100 ' : 'focus:ring-green-900 border-slate-600 bg-slate-800 text-white focus:border-green-400 focus:bg-slate-700'}`}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-8 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all font-semibold text-base shadow-lg hover:shadow-xl active:transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <i className="ri-loader-4-line mr-2 animate-spin"></i>
                Adding...
              </>
            ) : (
              <>
                <i className="ri-add-line mr-2"></i>
                Add Expense
              </>
            )}
          </button>
        </form>
      </div>

      {/* Previous Expenses */}
      <div className={`w-full rounded-2xl shadow-lg p-4 sm:p-6 border transition-all duration-300 hover:shadow-xl ${theme ? 'bg-white text-[#0F172A] border-gray-100' : 'bg-[#1E293B] text-white border-slate-700'}`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            <i className="ri-history-line text-white text-lg"></i>
          </div>
          <h2 className="text-lg sm:text-xl font-bold">Recent Expenses</h2>
        </div>

        {/* Expenses List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {expenses.length === 0 ? (
            <div className={`text-center py-12 ${theme ? 'text-gray-500' : 'text-gray-400'}`}>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                <i className="ri-receipt-line text-2xl"></i>
              </div>
              <p className="text-lg font-medium">No expenses yet</p>
              <p className="text-sm">Add your first expense above to get started</p>
            </div>
          ) : (
            expenses.map((expense) => (
              <div
                key={expense._id}
                className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-md group ${theme ? 'border-gray-100 bg-gray-50 hover:bg-gray-100' : 'border-slate-600 bg-slate-800 hover:bg-slate-700'}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="text-2xl">
                      {getCategoryIcon(expense.category)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-base">{expense.category}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${theme ? 'bg-blue-100 text-blue-700' : 'bg-blue-900/30 text-blue-300'}`}>
                          {formatDate(expense.date)}
                        </span>
                      </div>
                      {expense.note && (
                        <p className={`text-sm ${theme ? 'text-gray-600' : 'text-gray-400'}`}>
                          {expense.note}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-lg text-red-500">
                      -{formatCurrency(expense.amount)}
                    </span>
                    <button
                      onClick={() => handleDeleteExpense(expense._id)}
                      disabled={deleteLoading === expense._id}
                      className={`p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100 ${theme ? 'hover:bg-red-50 text-red-500 hover:text-red-700' : 'hover:bg-red-900/30 text-red-400 hover:text-red-300'} disabled:opacity-50`}
                      title="Delete expense"
                    >
                      {deleteLoading === expense._id ? (
                        <i className="ri-loader-4-line animate-spin text-sm"></i>
                      ) : (
                        <i className="ri-delete-bin-line text-sm"></i>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* {expenses.length > 0 && (
          <div className="mt-6 text-center">
            <button 
              className={`px-6 py-3 rounded-xl text-sm font-medium transition-all border ${theme ? 'border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300' : 'border-slate-600 text-gray-400 hover:bg-slate-700 hover:border-slate-500'}`}
              onClick={() => {
                // TODO: Implement load more functionality
                
              }}
            >
              <i className="ri-refresh-line mr-2"></i>
              Load More
            </button>
          </div>
        )} */}
      </div>

      {/* AI Suggestions - Enhanced */}
      {/* <div className={`w-full rounded-2xl shadow-lg p-4 sm:p-6 border transition-all duration-300 hover:shadow-xl ${theme ? 'bg-white text-[#0F172A] border-gray-100' : 'bg-[#1E293B] text-white border-slate-700'}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center">
            <span className="text-lg">💡</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold">Smart Insights</h2>
        </div>
        <p className={`text-sm mb-6 ${theme ? 'text-gray-600' : 'text-gray-300'}`}>
          AI-powered spending analysis and recommendations
        </p>
        
        <div className="grid gap-4">
          <div className={`p-4 rounded-xl border-l-4 border-orange-400 transition-all hover:shadow-md ${theme ? 'bg-gradient-to-r from-orange-50 to-amber-50 text-orange-800' : 'bg-gradient-to-r from-orange-900/20 to-amber-900/20 text-orange-300'}`}>
            <div className="flex items-center gap-3">
              <i className="ri-restaurant-line text-xl"></i>
              <div className="flex-1">
                <p className="text-sm font-semibold">Dining Out Alert</p>
                <p className="text-xs opacity-80 mt-1">You've spent 23% more on dining this month</p>
              </div>
              <i className="ri-arrow-right-s-line text-lg opacity-60"></i>
            </div>
          </div>
          
          <div className={`p-4 rounded-xl border-l-4 border-blue-400 transition-all hover:shadow-md ${theme ? 'bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-800' : 'bg-gradient-to-r from-blue-900/20 to-cyan-900/20 text-blue-300'}`}>
            <div className="flex items-center gap-3">
              <i className="ri-car-line text-xl"></i>
              <div className="flex-1">
                <p className="text-sm font-semibold">Travel Budget</p>
                <p className="text-xs opacity-80 mt-1">₹1,200 over your travel budget this month</p>
              </div>
              <i className="ri-arrow-right-s-line text-lg opacity-60"></i>
            </div>
          </div>
          
          <div className={`p-4 rounded-xl border-l-4 border-green-400 transition-all hover:shadow-md ${theme ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-800' : 'bg-gradient-to-r from-green-900/20 to-emerald-900/20 text-green-300'}`}>
            <div className="flex items-center gap-3">
              <i className="ri-trophy-line text-xl"></i>
              <div className="flex-1">
                <p className="text-sm font-semibold">Great Progress!</p>
                <p className="text-xs opacity-80 mt-1">You're saving 15% more than last month</p>
              </div>
              <i className="ri-arrow-right-s-line text-lg opacity-60"></i>
            </div>
          </div>
        </div>
        
        <button className={`w-full mt-6 py-3 px-4 rounded-xl text-sm font-semibold transition-all border ${theme ? 'border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:shadow-md' : 'border-slate-600 text-gray-300 hover:bg-slate-700 hover:border-slate-500 hover:shadow-md'}`}>
          <i className="ri-bar-chart-line mr-2"></i>
          View Detailed Analytics
          <i className="ri-arrow-right-line ml-2"></i>
        </button>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={theme ? "light" : "dark"}
          toastClassName="backdrop-blur-sm"
        />

      </div> */}
    </div>
  );
};

export default ExpensesData;