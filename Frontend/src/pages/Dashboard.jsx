import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ArrowLoader from '../Animations/ArrowLoader'
import { Outlet } from 'react-router-dom'
import Header_Dash from '../components/Header_Dash'
import Profile_Nav from '../components/Profile_Nav'
import { fetchExpenses } from '../Slices/ExpenseSlice'
import { autopayAll } from '../Slices/AutopaySlice'
import { fetchAllGoals } from '../Slices/GoalSlice'

const Dashboard = () => {
  const { theme } = useSelector(state => state.theme);
  const dispatch = useDispatch()
  useEffect(() => {
    const fetchExp = async () => {
      dispatch(fetchExpenses());
      dispatch(fetchAllGoals())
      dispatch(autopayAll());
    }
    fetchExp()
  }, [])

  return (
    <div className={`w-full min-h-screen transition-all duration-500 ${!theme ? "bg-dark-background text-dark-text" : "bg-light-background text-light-text"}`}>
      <Header_Dash />
      <div className={`transition-all gap-2 min-h-[calc(100vh-64px)] p-2 duration-500 ${!theme ? "bg-dark-background text-dark-text" : "bg-light-background text-light-text"} flex flex-col lg:flex-row w-full`}>
        <Profile_Nav />
        <div className="flex-1 min-h-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Dashboard
