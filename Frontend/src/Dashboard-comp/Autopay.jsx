import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    Plus, Edit3, Trash2, Calendar, DollarSign, Tag, Clock, Sun, Moon, 
    Search, Filter, Download, Upload, RotateCcw, RotateCw, CheckSquare,
    Square, Eye, EyeOff, AlertCircle, TrendingUp, PieChart, BarChart3
} from 'lucide-react';
import { BiRupee } from 'react-icons/bi';
import { addAutopayReducer, autopayAll, deleteAutopayReducer, updateAutopayReducer } from '../Slices/AutopaySlice';
import { addAutopay, editAutopay, removeAutopay } from '../API/Autopay.api';
import useFormFieldTracking from '../Custom/useFormFieldTracking'
import { addExpense } from '../API/Expense.api';
import { addExpenses } from '../Slices/ExpenseSlice';

const SkeletonLoader = ({ count = 1, height = 'h-4', width = 'w-full' }) => (
    <div className="animate-pulse">
        {Array(count).fill(0).map((_, index) => (
            <div key={index} className={`bg-gray-300 rounded ${height} ${width} mb-2`}></div>
        ))}
    </div>
);

// Enhanced Animation Variants
const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
        opacity: 1, 
        y: 0,
        transition: { 
            duration: 0.6,
            staggerChildren: 0.1 
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
};

const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: { 
        opacity: 1, 
        scale: 1, 
        y: 0,
        transition: { 
            type: "spring",
            stiffness: 300,
            damping: 25 
        }
    },
    exit: { 
        opacity: 0, 
        scale: 0.8, 
        y: 50,
        transition: { duration: 0.2 }
    }
};

const AutopayModule = () => {
    const { theme } = useSelector(state => state.theme);
    const dispatch = useDispatch();
    const autopays = useSelector(state => state.autopay.autopays);

    // State management
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAutopay, setEditingAutopay] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [sortBy, setSortBy] = useState('name');
    const [selectedItems, setSelectedItems] = useState([]);
    const [showBulkActions, setShowBulkActions] = useState(false);
    const [undoStack, setUndoStack] = useState([]);
    const [redoStack, setRedoStack] = useState([]);
    const [viewMode, setViewMode] = useState('table');
    const [minDate, setMinDate] = useState(new Date().toISOString());

    const initialFormData = {
        name: '',
        amount: '',
        duration: 'Monthly',
        category: '',
        nextDate: '',
        status: 'Active'
    };

    const {
        formData,
        updateField,
        getChangedData,
        resetTracking,
        hasChanges
    } = useFormFieldTracking(initialFormData);

    const categories = ['Entertainment', 'Health', 'Food', 'Utilities', 'Transportation', 'Shopping', 'Other'];
    const durations = ['Daily', 'Weekly', 'Monthly', 'Yearly'];

    const themeClasses = {
        light: {
            bg: 'bg-gray-50',
            cardBg: 'bg-white',
            text: 'text-gray-900',
            textSecondary: 'text-gray-600',
            border: 'border-gray-200',
            input: 'bg-white border-gray-300 text-gray-900 focus:border-blue-500',
            button: 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl',
            buttonSecondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900',
            buttonDanger: 'bg-red-600 hover:bg-red-700 text-white'
        },
        dark: {
            bg: 'bg-gray-900',
            cardBg: 'bg-gray-800',
            text: 'text-white',
            textSecondary: 'text-gray-300',
            border: 'border-gray-700',
            input: 'bg-gray-700 border-gray-600 text-white focus:border-blue-400',
            button: 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg hover:shadow-xl',
            buttonSecondary: 'bg-gray-700 hover:bg-gray-600 text-white',
            buttonDanger: 'bg-red-600 hover:bg-red-500 text-white'
        }
    };

    const currentTheme = themeClasses[theme ? 'light' : 'dark'];

    const displayAutopays = useMemo(() => autopays.length > 0 ? autopays : [], [autopays]);

    const filteredAutopays = useMemo(() => {
        return displayAutopays
            .filter(autopay => {
                const matchesSearch = autopay.name.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesCategory = filterCategory === 'all' || autopay.category === filterCategory;
                const matchesStatus = filterStatus === 'all' || autopay.status === filterStatus;
                return matchesSearch && matchesCategory && matchesStatus;
            })
            .sort((a, b) => {
                if (sortBy === 'name') return a.name.localeCompare(b.name);
                if (sortBy === 'amount') return b.amount - a.amount;
                if (sortBy === 'nextDate') return new Date(a.nextDate) - new Date(b.nextDate);
                return 0;
            });
    }, [displayAutopays, searchTerm, filterCategory, filterStatus, sortBy]);

    const totalMonthlyAmount = useMemo(() => {
        return displayAutopays
            .filter(autopay => autopay.status === 'Active')
            .reduce((sum, autopay) => {
                const multiplier = autopay.duration === 'Daily' ? 30 :
                    autopay.duration === 'Weekly' ? 4 :
                        autopay.duration === 'Monthly' ? 1 : 1 / 12;
                return sum + (autopay.amount * multiplier);
            }, 0);
    }, [displayAutopays]);

    const analytics = useMemo(() => {
        const categoryTotals = {};
        const statusCounts = { Active: 0, Paused: 0 };
        
        displayAutopays.forEach(autopay => {
            categoryTotals[autopay.category] = (categoryTotals[autopay.category] || 0) + autopay.amount;
            statusCounts[autopay.status]++;
        });

        return { categoryTotals, statusCounts };
    }, [displayAutopays]);

    useEffect(() => {
        const minDate = new Date();
        setMinDate(minDate.toISOString().split('T')[0]);        
    }, []);

    useEffect(() => {
        try {
            const compDate = new Date(minDate)
            displayAutopays.map(async (autopay) => {
                if(autopay.status === 'Paused'){
                    return;
                }
                const current = new Date(autopay.nextDate);
                if(current <= compDate){
                    const res = await addExpense({
                        amount : autopay.amount,
                        category : autopay.category,
                        note : "This is auto pay",
                        date : compDate,
                    })
                    let nextDate = new Date();
                    if(autopay.duration === 'Monthly'){
                        nextDate.setMonth(compDate.getMonth() + 1);                    
                    } else if (autopay.duration === 'Weekly'){
                        nextDate.setDate(compDate.getDate() + 7);
                    } else if (autopay.duration === 'Daily'){
                        next.setDate(compDate.getDate() + 1);
                    } else if(autopay.duration === 'Yearly'){
                        nextDate.setFullYear(compDate.getFullYear() + 1);
                    }
                    const resAutopay = await editAutopay(autopay._id, {
                        nextDate
                    })
                    console.log(res.data.data);
                    await dispatch(updateAutopayReducer(resAutopay.data.data));
                    await dispatch(addExpenses(res.data.data));
                }
            })
        } catch (error) {
            console.log(error);
            
        }
        
    },[])

    // Form submission with change tracking
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (editingAutopay) {
                // Only send changed fields for updates
                const changedData = getChangedData();
                if (Object.keys(changedData).length === 0) {
                    toast.info('No changes detected');
                    return;
                }
                
                const res = await editAutopay(editingAutopay._id, changedData);
                // console.log(res);
                
                await dispatch(updateAutopayReducer(res.data.data))
                
                toast.success('Autopay updated successfully!');
            } else {
                const autopayData = {
                    ...formData,
                    amount: parseFloat(formData.amount)
                };
                const res = await addAutopay(autopayData);
                await dispatch(addAutopayReducer(res.data.data));
                toast.success('Autopay added successfully!');
            }
            
            resetForm();
        } catch (error) {
            toast.error('Operation failed. Please try again.');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        resetTracking(initialFormData);
        setEditingAutopay(null);
        setIsModalOpen(false);
    };

    const handleEdit = (autopay) => {    
            
        const editableData = {
            name: autopay.name,
            amount: autopay.amount.toString(),
            duration: autopay.duration,
            category: autopay.category,
            nextDate: autopay.nextDate.split('T')[0],
            status: autopay.status
        };
        
        resetTracking(editableData);
        setEditingAutopay(autopay);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            removeAutopay(id).then((res) => console.log(res)
            );
            await dispatch(deleteAutopayReducer(id));
            toast.success('Autopay deleted successfully!');
        } catch (error) {
            toast.error('Delete failed. Please try again.');
        }
    };

    const handleBulkDelete = async () => {
        try {
            await Promise.all(selectedItems.map(id => removeAutopay(id)));
            selectedItems.forEach(id => dispatch(deleteAutopayReducer(id)));
            setSelectedItems([]);
            setShowBulkActions(false);
            toast.success(`${selectedItems.length} autopays deleted successfully!`);
        } catch (error) {
            toast.error('Bulk delete failed. Please try again.');
        }
    };

    const exportData = () => {
        const csvContent = [
            'Name,Amount,Duration,Category,Next Date,Status',
            ...filteredAutopays.map(item => 
                `${item.name},${item.amount},${item.duration},${item.category},${item.nextDate},${item.status}`
            )
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'autopays.csv';
        a.click();
        
        toast.success('Data exported successfully!');
    };

    const toggleSelectAll = () => {
        if (selectedItems.length === filteredAutopays.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(filteredAutopays.map(item => item._id));
        }
    };

    const toggleItemSelection = (id) => {
        setSelectedItems(prev => 
            prev.includes(id) 
                ? prev.filter(item => item !== id)
                : [...prev, id]
        );
    };

    useEffect(() => {
        setShowBulkActions(selectedItems.length > 0);
    }, [selectedItems]);

    return (
        <motion.div 
            className={`w-full flex flex-col gap-4 rounded-xl pt-4 transition-all duration-500 lg:h-[640px] overflow-auto ${theme ? 'bg-light-background text-dark' : 'bg-dark-surface text-light'}`}
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <div className=" px-4 space-y-6">
                {/* Header Section */}
                <motion.div 
                    className={`${currentTheme.cardBg} rounded-2xl shadow-xl border ${currentTheme.border} p-8`}
                    variants={itemVariants}
                >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div>
                            <motion.h1 
                                className={`text-4xl font-bold mb-2 ${currentTheme.text}`}
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                Autopay Management
                            </motion.h1>
                            <p className={`text-lg ${currentTheme.textSecondary}`}>
                                Manage your recurring payments with advanced controls
                            </p>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-3">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsModalOpen(true)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl ${currentTheme.button} font-medium transition-all duration-200`}
                            >
                                <Plus size={20} />
                                Add Autopay
                            </motion.button>
                            
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={exportData}
                                className={`p-3 rounded-xl ${currentTheme.buttonSecondary} transition-all duration-200`}
                            >
                                <Download size={20} />
                            </motion.button>
                            
                        </div>
                    </div>
                </motion.div>

                {/* Analytics Cards */}
                <motion.div 
                    className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6"
                    variants={itemVariants}
                >
                    {[
                        { 
                            title: 'Monthly Total', 
                            value: `₹${totalMonthlyAmount.toFixed(2)}`, 
                            icon: BiRupee, 
                            color: 'blue',
                            
                        },
                        { 
                            title: 'Active Autopays', 
                            value: displayAutopays.filter(a => a.status === 'Active').length, 
                            icon: Calendar, 
                            color: 'green',
                        },
                        { 
                            title: 'Categories', 
                            value: new Set(displayAutopays.map(a => a.category)).size, 
                            icon: Tag, 
                            color: 'purple',
                        }
                    ].map((stat, index) => (
                        <motion.div
                            key={index}
                            className={`${currentTheme.cardBg} rounded-2xl shadow-lg border ${currentTheme.border} p-6 hover:shadow-xl transition-all duration-300`}
                            // whileHover={{ y: -4, scale: 1.02 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className={`text-sm font-medium ${currentTheme.textSecondary} mb-1`}>
                                        {stat.title}
                                    </p>
                                    <p className={`text-3xl font-bold ${currentTheme.text}`}>
                                        {stat.value}
                                    </p>
                                    <span className={`text-xs text-${stat.color}-600 font-medium`}>
                                        {stat.change}
                                    </span>
                                </div>
                                <div className={`p-4 bg-${stat.color}-100 dark:bg-${stat.color}-900/30 rounded-xl`}>
                                    <stat.icon className={`text-${stat.color}-600`} size={24} />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Search and Filter Section */}
                <motion.div 
                    className={`${currentTheme.cardBg} rounded-2xl shadow-lg border ${currentTheme.border} p-6`}
                    variants={itemVariants}
                >
                    <div className="flex flex-col lg:flex-row gap-4 mb-4">
                        <div className="relative flex-1">
                            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${currentTheme.textSecondary}`} size={20} />
                            <input
                                type="text"
                                placeholder="Search autopays..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={`w-full pl-10 pr-4 py-3 rounded-xl border ${currentTheme.input} transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:outline-none`}
                            />
                        </div>
                        
                        <div className="flex gap-3 flex-col md:flex-row">
                            <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                                className={`px-4  py-3 rounded-xl border ${currentTheme.input} focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200`}
                            >
                                <option value="all" className=''>All Categories</option>
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                            
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className={`px-4 py-3 rounded-xl border ${currentTheme.input} focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200`}
                            >
                                <option value="all">All Status</option>
                                <option value="Active">Active</option>
                                <option value="Paused">Paused</option>
                            </select>
                            
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className={`px-4 py-3 rounded-xl border ${currentTheme.input} focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200`}
                            >
                                <option value="name">Sort by Name</option>
                                <option value="amount">Sort by Amount</option>
                                <option value="nextDate">Sort by Date</option>
                            </select>
                        </div>
                    </div>

                    {/* View Mode Toggle */}
                    <div className="flex gap-2">
                        {['table', 'card', 'analytics'].map((mode) => (
                            <motion.button
                                key={mode}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setViewMode(mode)}
                                className={`px-4 py-2 rounded-lg capitalize transition-all duration-200 ${
                                    viewMode === mode 
                                        ? currentTheme.button 
                                        : currentTheme.buttonSecondary
                                }`}
                            >
                                {mode}
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                {/* Bulk Actions */}
                <AnimatePresence>
                    {showBulkActions && (
                        <motion.div
                            className={`${currentTheme.cardBg} rounded-2xl shadow-lg border ${currentTheme.border} p-4`}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                        >
                            <div className="flex items-center justify-between">
                                <span className={currentTheme.text}>
                                    {selectedItems.length} items selected
                                </span>
                                <div className="flex gap-2">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleBulkDelete}
                                        className={`px-4 py-2 rounded-lg ${currentTheme.buttonDanger} transition-all duration-200`}
                                    >
                                        Delete Selected
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setSelectedItems([])}
                                        className={`px-4 py-2 rounded-lg ${currentTheme.buttonSecondary} transition-all duration-200`}
                                    >
                                        Clear Selection
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Data Display */}
                <motion.div 
                    className={`${currentTheme.cardBg} rounded-2xl shadow-lg border ${currentTheme.border} overflow-hidden`}
                    variants={itemVariants}
                >
                    {loading ? (
                        <div className="p-6">
                            <SkeletonLoader count={5} height="h-12" />
                        </div>
                    ) : viewMode === 'table' ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className={`${currentTheme.bg} sticky top-0 z-10`}>
                                    <tr>
                                        <th className="px-6 py-4 text-left">
                                            <motion.button
                                                // whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={toggleSelectAll}
                                                className={currentTheme.textSecondary}
                                            >
                                                {selectedItems.length === filteredAutopays.length ? 
                                                    <CheckSquare size={18} /> : 
                                                    <Square size={18} />
                                                }
                                            </motion.button>
                                        </th>
                                        {['Name', 'Amount', 'Duration', 'Category', 'Next Payment', 'Status', 'Actions'].map((header) => (
                                            <th key={header} className={`px-6 py-4 text-left text-sm font-semibold ${currentTheme.textSecondary}`}>
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    <AnimatePresence>
                                        {filteredAutopays.map((autopay, index) => (
                                            <motion.tr
                                                key={autopay._id}
                                                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                transition={{ delay: index * 0.05 }}
                                                // whileHover={{ scale: 1.01 }}
                                            >
                                                <td className="px-6 py-4">
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => toggleItemSelection(autopay._id)}
                                                        className={currentTheme.textSecondary}
                                                    >
                                                        {selectedItems.includes(autopay._id) ? 
                                                            <CheckSquare size={18} /> : 
                                                            <Square size={18} />
                                                        }
                                                    </motion.button>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-medium">{autopay.name}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-semibold text-green-600">₹{autopay.amount}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        autopay.duration === 'Daily' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                                                        autopay.duration === 'Weekly' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                                                        autopay.duration === 'Monthly' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' :
                                                        'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
                                                    }`}>
                                                        {autopay.duration}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                                                        {autopay.category}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className={`${currentTheme.textSecondary} text-sm`}>
                                                        {new Date(autopay.nextDate).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        autopay.status === 'Active' ? 
                                                            'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                                                            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                                                    }`}>
                                                        {autopay.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <motion.button
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => handleEdit(autopay)}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors duration-150"
                                                        >
                                                            <Edit3 size={16} />
                                                        </motion.button>
                                                        <motion.button
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => handleDelete(autopay._id)}
                                                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors duration-150"
                                                        >
                                                            <Trash2 size={16} />
                                                        </motion.button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>
                    ) : viewMode === 'card' ? (
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <AnimatePresence>
                                {filteredAutopays.map((autopay, index) => (
                                    <motion.div
                                        key={autopay._id}
                                        className={`p-6 rounded-xl border ${currentTheme.border} hover:shadow-lg transition-all duration-300`}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ delay: index * 0.1 }}
                                        // whileHover={{ y: -4, scale: 1.02 }}
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <h3 className={`font-semibold text-lg ${currentTheme.text}`}>{autopay.name}</h3>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => toggleItemSelection(autopay._id)}
                                                className={currentTheme.textSecondary}
                                            >
                                                {selectedItems.includes(autopay._id) ? 
                                                    <CheckSquare size={18} /> : 
                                                    <Square size={18} />
                                                }
                                            </motion.button>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className={currentTheme.textSecondary}>Amount</span>
                                                <span className="font-semibold text-green-600">₹{autopay.amount}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className={currentTheme.textSecondary}>Duration</span>
                                                <span className={`px-2 py-1 rounded text-xs ${autopay.duration === 'Monthly' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                                                    {autopay.duration}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className={currentTheme.textSecondary}>Category</span>
                                                <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-800">
                                                    {autopay.category}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className={currentTheme.textSecondary}>Status</span>
                                                <span className={`px-2 py-1 rounded text-xs ${
                                                    autopay.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {autopay.status}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-200">
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => handleEdit(autopay)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                <Edit3 size={16} />
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => handleDelete(autopay._id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    ) : (
                        // Analytics View
                        <div className="p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <motion.div
                                    className="p-6 rounded-xl border border-gray-200 dark:border-gray-700"
                                    // whileHover={{ scale: 1.02 }}
                                >
                                    <h3 className={`text-lg font-semibold mb-4 ${currentTheme.text}`}>Category Distribution</h3>
                                    {Object.entries(analytics.categoryTotals).map(([category, amount]) => (
                                        <div key={category} className="flex justify-between items-center py-2">
                                            <span className={currentTheme.textSecondary}>{category}</span>
                                            <span className="font-medium">₹{amount}</span>
                                        </div>
                                    ))}
                                </motion.div>
                                
                                <motion.div
                                    className="p-6 rounded-xl border border-gray-200 dark:border-gray-700"
                                    // whileHover={{ scale: 1.02 }}
                                >
                                    <h3 className={`text-lg font-semibold mb-4 ${currentTheme.text}`}>Status Overview</h3>
                                    {Object.entries(analytics.statusCounts).map(([status, count]) => (
                                        <div key={status} className="flex justify-between items-center py-2">
                                            <span className={currentTheme.textSecondary}>{status}</span>
                                            <span className="font-medium">{count}</span>
                                        </div>
                                    ))}
                                </motion.div>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Enhanced Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div 
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div 
                            className={`${currentTheme.cardBg} rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto`}
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            <form onSubmit={handleSubmit} className="p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className={`text-2xl font-bold ${currentTheme.text}`}>
                                        {editingAutopay ? 'Edit Autopay' : 'Add New Autopay'}
                                    </h2>
                                    {hasChanges && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="flex items-center gap-2 text-orange-500"
                                        >
                                            <AlertCircle size={16} />
                                            <span className="text-sm">Unsaved changes</span>
                                        </motion.div>
                                    )}
                                </div>
                                
                                <div className="space-y-6">
                                    {[
                                        { name: 'name', label: 'Name', type: 'text', required: true  },
                                        { name: 'amount', label: 'Amount', type: 'number', required: true, step: '0.01', min:100 },
                                        { name: 'nextDate', label: 'Next Payment Date', type: 'date', required: true,min: minDate  }
                                    ].map((field) => (
                                        <motion.div key={field.name} variants={itemVariants}>
                                            <label className={`block text-sm font-medium ${currentTheme.textSecondary} mb-2`}>
                                                {field.label}
                                            </label>
                                            <input
                                                type={field.type}
                                                step={field.step}
                                                value={formData[field.name]}
                                                onChange={(e) => updateField(field.name, e.target.value)}
                                                className={`w-full px-4 py-3 rounded-xl border ${currentTheme.input} focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200`}
                                                required={field.required}
                                                min={field?.min || undefined}
                                            />
                                        </motion.div>
                                    ))}
                                    
                                    {[
                                        { name: 'duration', label: 'Duration', options: durations },
                                        { name: 'category', label: 'Category', options: categories, placeholder: 'Select Category' },
                                        { name: 'status', label: 'Status', options: ['Active', 'Paused'] }
                                    ].map((field) => (
                                        <motion.div key={field.name} variants={itemVariants}>
                                            <label className={`block text-sm font-medium ${currentTheme.textSecondary} mb-2`}>
                                                {field.label}
                                            </label>
                                            <select
                                                value={formData[field.name]}
                                                onChange={(e) => updateField(field.name, e.target.value)}
                                                className={`w-full px-4 py-3 rounded-xl border ${currentTheme.input} focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200`}
                                                required={field.name === 'category'}
                                            >
                                                {field.placeholder && <option value="">{field.placeholder}</option>}
                                                {field.options.map(option => (
                                                    <option key={option} value={option}>{option}</option>
                                                ))}
                                            </select>
                                        </motion.div>
                                    ))}
                                    
                                    <div className="flex gap-4 pt-6">
                                        <motion.button
                                            type="button"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={resetForm}
                                            className={`flex-1 px-6 py-3 rounded-xl ${currentTheme.buttonSecondary} font-medium transition-all duration-200`}
                                        >
                                            Cancel
                                        </motion.button>
                                        <motion.button
                                            type="submit"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            disabled={loading || (!hasChanges && editingAutopay)}
                                            className={`flex-1 px-6 py-3 rounded-xl ${currentTheme.button} font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                                        >
                                            {loading ? (
                                                <div className="flex items-center justify-center gap-2">
                                                    <motion.div
                                                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                    />
                                                    Processing...
                                                </div>
                                            ) : (
                                                `${editingAutopay ? 'Update' : 'Add'} Autopay`
                                            )}
                                        </motion.button>
                                    </div>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toast Container */}
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
        </motion.div>
    );
};

export default AutopayModule;
