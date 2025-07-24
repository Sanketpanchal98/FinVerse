import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Target,
    Plus,
    Calendar,
    DollarSign,
    CheckCircle,
    XCircle,
    Clock,
    TrendingUp,
    Award,
    AlertCircle,
    Edit3,
    Trash2,
    Filter,
    Search,
    PiggyBank,
    Zap,
    RefreshCcw
} from 'lucide-react';
import { addGoal, deleteGoalAPI, updateGoal } from '../API/Goal.api';
import { addGoalReducer, removeGoalReducer, updateGoalReducer } from '../Slices/GoalSlice';

const FinGoals = () => {
    const goals = useSelector(state => state.goal.goals)
    const theme = useSelector((state) => state.theme.theme);
    const dispatch = useDispatch();

    const [showAddGoal, setShowAddGoal] = useState(false);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [updateAmount, setUpdateAmount] = useState(0)
    const [minDate, setMinDate] = useState(new Date().toISOString());    

    const [newGoal, setNewGoal] = useState({
        title: '',
        targetAmount: '',
        category: 'savings',
        deadline: '',
        priority: 'medium'
    });

    // Calculate goal statistics
    const goalStats = {
        total: goals.length,
        achieved: goals.filter(g => g.status === 'achieved').length,
        active: goals.filter(g => g.status === 'active').length,
        expired: goals.filter(g => {
            const deadline = new Date(g.deadline);
            const now = new Date();
            return deadline < now && g.status !== 'achieved';
        }).length
    };

    // Filter goals based on status and search
    const filteredGoals = goals.filter(goal => {
        const matchesStatus = filterStatus === 'all' || goal.status === filterStatus ||
            (filterStatus === 'expired' && new Date(goal.deadline) < new Date() && goal.status !== 'achieved');
        const matchesSearch = goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            goal.category.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const handleAddGoal = async () => {
        if (newGoal.title && newGoal.targetAmount && newGoal.deadline) {
            const goal = {
                ...newGoal,
                targetAmount: parseFloat(newGoal.targetAmount),
                currentAmount: 0,
                status: 'active'
            };
            const res = await addGoal(goal);

            dispatch(addGoalReducer(res.data.data))
            setNewGoal({
                title: '',
                targetAmount: '',
                category: 'savings',
                deadline: '',
                priority: 'medium'
            });
            setShowAddGoal(false);
        }
    };

    const updateGoalProgress = async (goalId, amount) => {
        const goal = goals.filter((goal) => goal._id === goalId)

        const res = await updateGoal({
            currentAmount: Math.min(amount, goal[0].targetAmount),
            status: amount >= goal.targetAmount ? 'achieved' : goal[0].status,
            goalId
        });
        dispatch(updateGoalReducer(res.data.data))
    };

    const deleteGoal = async (goalId) => {
        const res = await deleteGoalAPI(goalId);
        dispatch(removeGoalReducer(goalId))
    };

    const getStatusColor = (goal) => {
        const deadline = new Date(goal.deadline);
        const now = new Date();

        if (goal.status === 'achieved') return 'text-green-600';
        if (deadline < now) return 'text-red-600';
        return 'text-blue-600';
    };

    const getStatusIcon = (goal) => {
        const deadline = new Date(goal.deadline);
        const now = new Date();

        if (goal.status === 'achieved') return <CheckCircle size={20} className="text-green-600" />;
        if (deadline < now) return <XCircle size={20} className="text-red-600" />;
        return <Clock size={20} className="text-blue-600" />;
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'border-red-500 bg-red-50';
            case 'medium': return 'border-yellow-500 bg-yellow-50';
            case 'low': return 'border-green-500 bg-green-50';
            default: return 'border-gray-300 bg-gray-50';
        }
    };

    const calculateProgress = (goal) => {
        return Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
    };

    return (
        <div className={`w-full flex flex-col gap-4 transition-all duration-500 lg:h-[640px] overflow-auto ${theme ? 'bg-light-background text-dark' : 'bg-dark-background text-light'}`}>
            <div className={`w-full rounded-xl shadow p-4 sm:p-6 ${theme ? 'bg-white text-[#0F172A]' : 'bg-[#1E293B] text-white'}`}>

                {/* Header Section */}
                <div className={`p-4 sm:p-6 border-b ${theme ? "border-gray-200" : "border-gray-700"}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h2 className={`text-xl sm:text-2xl font-bold flex items-center gap-2 ${theme ? "text-gray-900" : "text-gray-100"}`}>
                                <Target className="text-blue-600" />
                                Financial Goals
                            </h2>
                            <p className={`text-sm mt-1 ${theme ? "text-gray-600" : "text-gray-400"}`}>
                                Track and achieve your financial objectives • {goalStats.achieved}/{goalStats.total} completed
                            </p>
                        </div>

                        <button
                            onClick={() => setShowAddGoal(!showAddGoal)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all transform hover:scale-105 ${theme
                                ? "bg-blue-600 hover:bg-blue-700 text-white"
                                : "bg-blue-600 hover:bg-blue-700 text-white"
                                }`}
                        >
                            <Plus size={16} />
                            Add Goal
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="p-4 sm:p-6">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                        <div className={`p-4 rounded-lg border ${theme ? "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200" : "bg-gradient-to-br from-blue-900/20 to-blue-800/20 border-blue-700"}`}>
                            <div className="flex items-center gap-2">
                                <div className={`p-2 rounded-lg ${theme ? "bg-blue-100" : "bg-blue-900/30"}`}>
                                    <Target size={16} className="text-blue-600" />
                                </div>
                                <div>
                                    <p className={`text-xs font-medium ${theme ? "text-blue-700" : "text-blue-300"}`}>
                                        Total Goals
                                    </p>
                                    <p className={`text-lg font-bold ${theme ? "text-blue-900" : "text-blue-100"}`}>
                                        {goalStats.total}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className={`p-4 rounded-lg border ${theme ? "bg-gradient-to-br from-green-50 to-green-100 border-green-200" : "bg-gradient-to-br from-green-900/20 to-green-800/20 border-green-700"}`}>
                            <div className="flex items-center gap-2">
                                <div className={`p-2 rounded-lg ${theme ? "bg-green-100" : "bg-green-900/30"}`}>
                                    <Award size={16} className="text-green-600" />
                                </div>
                                <div>
                                    <p className={`text-xs font-medium ${theme ? "text-green-700" : "text-green-300"}`}>
                                        Achieved
                                    </p>
                                    <p className={`text-lg font-bold ${theme ? "text-green-900" : "text-green-100"}`}>
                                        {goalStats.achieved}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className={`p-4 rounded-lg border ${theme ? "bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200" : "bg-gradient-to-br from-yellow-900/20 to-yellow-800/20 border-yellow-700"}`}>
                            <div className="flex items-center gap-2">
                                <div className={`p-2 rounded-lg ${theme ? "bg-yellow-100" : "bg-yellow-900/30"}`}>
                                    <Zap size={16} className="text-yellow-600" />
                                </div>
                                <div>
                                    <p className={`text-xs font-medium ${theme ? "text-yellow-700" : "text-yellow-300"}`}>
                                        Active
                                    </p>
                                    <p className={`text-lg font-bold ${theme ? "text-yellow-900" : "text-yellow-100"}`}>
                                        {goalStats.active}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className={`p-4 rounded-lg border ${theme ? "bg-gradient-to-br from-red-50 to-red-100 border-red-200" : "bg-gradient-to-br from-red-900/20 to-red-800/20 border-red-700"}`}>
                            <div className="flex items-center gap-2">
                                <div className={`p-2 rounded-lg ${theme ? "bg-red-100" : "bg-red-900/30"}`}>
                                    <AlertCircle size={16} className="text-red-600" />
                                </div>
                                <div>
                                    <p className={`text-xs font-medium ${theme ? "text-red-700" : "text-red-300"}`}>
                                        Expired
                                    </p>
                                    <p className={`text-lg font-bold ${theme ? "text-red-900" : "text-red-100"}`}>
                                        {goalStats.expired}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="flex-1 relative">
                            <Search size={16} className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme ? "text-gray-400" : "text-gray-500"}`} />
                            <input
                                type="text"
                                placeholder="Search goals..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-all ${theme
                                    ? "bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                    : "bg-gray-800 border-gray-600 text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-900/50"
                                    }`}
                            />
                        </div>

                        <div className="flex gap-2">
                            {['all', 'active', 'achieved', 'expired'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setFilterStatus(status)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${filterStatus === status
                                        ? "bg-blue-600 text-white"
                                        : theme
                                            ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                        }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Add Goal Form */}
                    {showAddGoal && (
                        <div className={`mb-6 p-4 rounded-lg border-2 border-dashed ${theme ? "border-blue-300 bg-blue-50" : "border-blue-600 bg-blue-900/20"}`}>
                            <h3 className={`text-lg font-bold mb-4 ${theme ? "text-gray-900" : "text-gray-100"}`}>
                                Create New Goal
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="Goal title..."
                                    value={newGoal.title}
                                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                                    className={`p-3 rounded-lg border ${theme ? "bg-white border-gray-300" : "bg-gray-800 border-gray-600 text-white"}`}
                                />
                                <input
                                    type="number"
                                    placeholder="Target amount (₹)"
                                    value={newGoal.targetAmount}
                                    onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
                                    className={`p-3 rounded-lg border ${theme ? "bg-white border-gray-300" : "bg-gray-800 border-gray-600 text-white"}`}
                                />
                                <select
                                    value={newGoal.category}
                                    onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                                    className={`p-3 rounded-lg border ${theme ? "bg-white border-gray-300" : "bg-gray-800 border-gray-600 text-white"}`}
                                >
                                    <option value="savings">Savings</option>
                                    <option value="emergency">Emergency Fund</option>
                                    <option value="food">Food Budget</option>
                                    <option value="entertainment">Entertainment</option>
                                    <option value="investment">Investment</option>
                                </select>
                                <input
                                    type="date"
                                    value={newGoal.deadline}
                                    onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                                    className={`p-3 rounded-lg border ${theme ? "bg-white border-gray-300" : "bg-gray-800 border-gray-600 text-white"}`}
                                    min={minDate.split('T')[0]}
                                />
                                <select
                                    value={newGoal.priority}
                                    onChange={(e) => setNewGoal({ ...newGoal, priority: e.target.value })}
                                    className={`p-3 rounded-lg border ${theme ? "bg-white border-gray-300" : "bg-gray-800 border-gray-600 text-white"}`}
                                >
                                    <option value="low">Low Priority</option>
                                    <option value="medium">Medium Priority</option>
                                    <option value="high">High Priority</option>
                                </select>
                            </div>
                            <div className="flex gap-2 mt-4">
                                <button
                                    onClick={handleAddGoal}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Create Goal
                                </button>
                                <button
                                    onClick={() => setShowAddGoal(false)}
                                    className={`px-4 py-2 rounded-lg transition-colors ${theme ? "bg-gray-200 text-gray-700 hover:bg-gray-300" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Goals List */}
                    <div className="space-y-4">
                        {filteredGoals.length === 0 ? (
                            <div className={`flex flex-col items-center justify-center h-40 rounded-lg border-2 border-dashed ${theme ? "border-gray-300 bg-gray-50" : "border-gray-600 bg-gray-800"
                                }`}>
                                <PiggyBank size={48} className={theme ? "text-gray-400" : "text-gray-600"} />
                                <p className={`mt-4 text-lg font-medium ${theme ? "text-gray-600" : "text-gray-400"}`}>
                                    No goals found
                                </p>
                                <p className={`mt-2 text-sm ${theme ? "text-gray-500" : "text-gray-500"}`}>
                                    {searchTerm ? "Try adjusting your search" : "Create your first financial goal"}
                                </p>
                            </div>
                        ) : (
                            filteredGoals.map((goal) => (
                                <div key={goal._id} className={`p-4 rounded-lg border transition-all hover:shadow-md ${theme ? "bg-white border-gray-200 hover:border-gray-300" : "bg-gray-800 border-gray-700 hover:border-gray-600"
                                    }`}>
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                {getStatusIcon(goal)}
                                                <h3 className={`text-lg font-semibold ${theme ? "text-gray-900" : "text-gray-100"}`}>
                                                    {goal.title}
                                                </h3>
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${theme ? getPriorityColor(goal.priority) : `border-${goal.priority === 'high' ? 'red' : goal.priority === 'medium' ? 'yellow' : 'green'}-500 bg-${goal.priority === 'high' ? 'red' : goal.priority === 'medium' ? 'yellow' : 'green'}-900/20 text-${goal.priority === 'high' ? 'red' : goal.priority === 'medium' ? 'yellow' : 'green'}-400`
                                                    }`}>
                                                    {goal.priority}
                                                </span>
                                            </div>

                                            <div className={`text-sm mb-3 ${theme ? "text-gray-600" : "text-gray-400"}`}>
                                                <div className="flex items-center gap-4 flex-wrap">
                                                    <span className="flex items-center gap-1">
                                                        <DollarSign size={14} />
                                                        ₹{goal.currentAmount.toLocaleString()} / ₹{goal.targetAmount.toLocaleString()}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Calendar size={14} />
                                                        {new Date(goal.deadline).toLocaleDateString()}
                                                    </span>
                                                    <span className="capitalize flex items-center gap-1">
                                                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                                        {goal.category}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Progress Bar */}
                                            <div className={`w-full rounded-full h-3 mb-2 ${theme ? "bg-gray-200" : "bg-gray-700"}`}>
                                                <div
                                                    className={`h-3 rounded-full transition-all duration-500 ${goal.status === 'achieved'
                                                        ? "bg-gradient-to-r from-green-500 to-green-600"
                                                        : "bg-gradient-to-r from-blue-500 to-blue-600"
                                                        }`}
                                                    style={{ width: `${calculateProgress(goal)}%` }}
                                                ></div>
                                            </div>
                                            <p className={`text-sm font-medium ${getStatusColor(goal)}`}>
                                                {calculateProgress(goal).toFixed(1)}% complete
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {goal.status === 'active' && (
                                                <div className={`flex items-center ${theme ? "bg-white border-gray-300" : "bg-gray-700 border-gray-600 text-white"}`}>
                                                    <input
                                                        type="number"
                                                        placeholder="Update amount"
                                                        className={`w-32 remove-arrow p-2 text-sm rounded border ${theme ? "bg-white border-gray-300" : "bg-gray-700 border-gray-600 text-white"}`}
                                                        onChange={(e) => setUpdateAmount(e.target.value)}                                                       

                                                    />
                                                    <i className="px-2 rounded cursor-pointer ri-refresh-line"
                                                    onClick={() =>updateGoalProgress(goal._id, updateAmount)}
                                                    ></i>
                                                </div>
                                            )}
                                            <button
                                                onClick={() => deleteGoal(goal._id)}
                                                className={`p-2 rounded transition-colors ${theme ? "hover:bg-red-50 text-red-600" : "hover:bg-red-900/20 text-red-400"}`}
                                                title="Delete goal"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinGoals;