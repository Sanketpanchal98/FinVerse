import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import InputType from '../Partials/InputType'
import { useErrorBoundary } from 'react-error-boundary'
import { passwordUpdate } from '../API/User.api'
import { BsArrowLeft } from 'react-icons/bs';
import { FiAlertCircle } from 'react-icons/fi'
import { BiCheckCircle } from 'react-icons/bi'
import { Link } from 'react-router-dom'

const ResetPass = () => {
    const { theme } = useSelector(state => state.theme);

    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmnewpassword, setConfirmNewPassword] = useState('');
    const [isError, setIserror] = useState('');
    const [isSuccess, setIsSuccess] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const { showBoundary } = useErrorBoundary()

    const validatePasswords = () => {
        if (!oldPassword || !newPassword || !confirmnewpassword) {
            setIserror('All fields are required')
            return false
        }
        
        if (newPassword.length < 6) {
            setIserror('New password must be at least 6 characters long')
            return false
        }
        
        if (confirmnewpassword !== newPassword) {
            setIserror('New passwords do not match')
            return false
        }
        
        if (oldPassword === newPassword) {
            setIserror('New password must be different from old password')
            return false
        }
        
        return true
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSuccess('')
        setIserror('')
        
        if (!validatePasswords()) return
        
        setIsLoading(true)
        
        try {
            const response = await passwordUpdate({oldPassword, newPassword});
            
            if(response.status === 200){
                setIsSuccess(response.data.message || 'Password updated successfully!')
                setOldPassword('')
                setNewPassword('')
                setConfirmNewPassword('')
            }
            
        } catch (error) {
            setIserror(error?.response?.data?.message || 'Failed to update password')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={`w-full h-full rounded-xl p-4 sm:p-6 lg:p-8 ${theme ? "bg-light-surface text-light-text" : "bg-dark-surface text-dark-text"}`}>
            <div className="mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        className='inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors px-4 py-2 rounded-lg text-white text-sm font-medium mb-6'
                        to={'/dashboard/settings'}
                    >
                        <BsArrowLeft size={16} />
                        Go Back
                    </Link>
                    
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-2xl font-bold">Change Password</h1>
                    </div>
                    <p className={`text-sm ${theme ? "text-light-text-secondary" : "text-dark-text-secondary"}`}>
                        Update your password to keep your account secure
                    </p>
                </div>

                {/* Form */}
                <div onSubmit={handleSubmit} className="space-y-6">
                    {/* Old Password */}
                    <div className="relative">
                        <InputType 
                            type={'password'} 
                            isEdit={true} 
                            onChange={setOldPassword} 
                            value={oldPassword} 
                            label='Current Password'
                            placeholder='Enter your current password'
                            required={true}
                        />
                    </div>

                    {/* New Password */}
                    <div className="relative">
                        <InputType 
                            type={'password'} 
                            isEdit={true} 
                            onChange={setNewPassword} 
                            value={newPassword} 
                            label='New Password'
                            placeholder='Enter your new password'
                            required={true}
                        />
                    </div>

                    {/* Confirm Password */}
                    <div className="relative">
                        <InputType 
                            type={'password'} 
                            isEdit={true} 
                            onChange={setConfirmNewPassword} 
                            value={confirmnewpassword}
                            label='Confirm New Password'
                            placeholder='Confirm your new password'
                            required={true}
                        />
                    </div>

                    {/* Error Message */}
                    {isError && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <FiAlertCircle size={16} className="text-red-500" />
                            <span className="text-red-700 text-sm">{isError}</span>
                        </div>
                    )}

                    {/* Success Message */}
                    {isSuccess && (
                        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <BiCheckCircle size={16} className="text-green-500" />
                            <span className="text-green-700 text-sm">{isSuccess}</span>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button 
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                            isLoading 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
                        } text-white`}
                        onClick={handleSubmit}
                    >
                        {isLoading ? 'Updating Password...' : 'Change Password'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ResetPass