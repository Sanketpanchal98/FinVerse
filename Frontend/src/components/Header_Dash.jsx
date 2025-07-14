import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { userLogout } from '../API/User.api';
import { redirect } from 'react-router-dom';
import { toogleTheme } from '../Slices/ThemeSlice';
import { removeUser } from '../Slices/AuthSlice';

const Header_Dash = () => {
  const user = useSelector((state) => state.user.user);

  const { theme } = useSelector(state => state.theme)

  if (!user) {
    return null; // or a minimal header (like a skeleton)
  }
  const dispatch = useDispatch()

  const handleLogout = async () => {
    await userLogout()
    dispatch(removeUser())
    redirect('/')
  }


  return (
    <div className={`w-full h-16 ${!theme ? "bg-dark-background text-dark-text" : "bg-light-background text-light-text"} flex items-center justify-between px-6`}>
      <h1 className="text-xl font-bold">Welcome, {user.data.name}</h1>
      <div className='w-1/2 flex gap-4 justify-end'>
        <button 
        className="border-2 py-2 px-3 border-slate-300 rounded-xl hover:scale-105 transition-transform"
        onClick={() => dispatch(toogleTheme())}
      >
        {!theme ? (
          <i className="ri-sun-line"></i>
        ) : (
          <i className="ri-moon-fill"></i>
        )}
      </button>
      <button className='bg-red-600 px-4 rounded-2xl font-semibold text-white' onClick={() => handleLogout()}>Log Out</button>
      </div>

    </div>
  );
};

export default Header_Dash
