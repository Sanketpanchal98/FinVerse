import React, { useState } from 'react'
import { ArrowLeft, Mail, CheckCircle, AlertCircle, Shield, Eye, EyeOff } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import InputType from '../Partials/InputType';
import { emailUpdate } from '../API/User.api';
import { updateEmail } from '../Slices/AuthSlice';
import { Link } from 'react-router-dom';

const useErrorBoundary = () => ({ showBoundary: () => {} })

const ResetEmail = () => {
    const { theme } = useSelector(state => state.theme);
    const {user} = useSelector(state => state.user)

    const [currentEmail, setCurrentEmail] = useState('')
    const [newEmail, setNewEmail] = useState('')
    const [confirmNewEmail, setConfirmNewEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isError, setIsError] = useState('');
    const [isSuccess, setIsSuccess] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const dispatch = useDispatch()

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    const validateInputs = () => {
        if (!currentEmail || !newEmail || !confirmNewEmail || !password) {
            setIsError('All fields are required')
            return false
        }
        
        if (!emailRegex.test(currentEmail)) {
            setIsError('Please enter a valid current email address')
            return false
        }
        
        if (!emailRegex.test(newEmail)) {
            setIsError('Please enter a valid new email address')
            return false
        }
        
        if (confirmNewEmail !== newEmail) {
            setIsError('New email addresses do not match')
            return false
        }
        
        if (currentEmail === newEmail) {
            setIsError('New email must be different from current email')
            return false
        }
        
        if (password.length < 6) {
            setIsError('Password must be at least 6 characters long')
            return false
        }
        
        return true
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSuccess('')
        setIsError('')
        
        if (!validateInputs()) return
        
        setIsLoading(true)
        
        try {
            const response = await emailUpdate({
                currentEmail,
                newEmail,
                password
            });
            
            if(response.status === 200){
                setIsSuccess(response.data.message || 'Email updated successfully! Please check your new email for verification.')
                // Clear form after success
                setCurrentEmail('')
                setNewEmail('')
                setConfirmNewEmail('')
                setPassword('')
                dispatch(updateEmail(newEmail))
            }
            
        } catch (error) {
            setIsError(error?.response?.data?.message || 'Failed to update email address')
        } finally {
            setIsLoading(false)
        }
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    const isNewEmailValid = newEmail && emailRegex.test(newEmail)
    const isConfirmEmailValid = confirmNewEmail && confirmNewEmail === newEmail
    const isCurrentEmailValid = currentEmail && emailRegex.test(currentEmail)

    return (
        <div className={`w-full min-h-screen p-4 sm:p-6 lg:p-8 ${theme ? "bg-light-surface text-light-text" : "bg-dark-surface text-dark-text"}`}>
            <div className="mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link 
                        className='inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors px-4 py-2 rounded-lg text-white text-sm font-medium mb-6'
                        // onClick={() => console.log('Navigate back')}
                        to={'/dashboard/settings'}
                    >
                        <ArrowLeft size={16} />
                        Go Back
                    </Link>
                    
                    <div className="flex items-center gap-3 mb-2">
                        <Mail className="text-blue-600" size={24} />
                        <h1 className="text-2xl font-bold">Change Email Address</h1>
                    </div>
                    <p className={`text-sm ${theme ? "text-light-text-secondary" : "text-dark-text-secondary"}`}>
                        Update your email address. You'll need to verify your new email.
                    </p>
                </div>

                {/* Security Notice */}
                <div className={`mb-6 p-4 rounded-lg border-l-4 border-blue-500 ${theme ? "bg-blue-50" : "bg-blue-900/20"}`}>
                    <div className="flex items-center gap-2 mb-2">
                        <Shield className="text-blue-600" size={16} />
                        <h3 className="font-semibold text-blue-700">Security Notice</h3>
                    </div>
                    <p className="text-sm text-blue-600">
                        For security, you'll need to enter your current password to change your email address.
                    </p>
                </div>

                {/* Form */}
                <div onSubmit={handleSubmit} className="space-y-6">
                    {/* Current Email */}
                    <div className="relative">
                        <InputType 
                            type="email" 
                            isEdit={true} 
                            onChange={setCurrentEmail} 
                            value={currentEmail} 
                            label='Current Email Address'
                            placeholder='Enter your current email'
                            required={true}
                        />
                        {currentEmail && (
                            <div className="mt-2 flex items-center gap-2">
                                {isCurrentEmailValid ? (
                                    <>
                                        <CheckCircle size={16} className="text-green-500" />
                                        <span className="text-sm text-green-600">Valid email format</span>
                                    </>
                                ) : (
                                    <>
                                        <AlertCircle size={16} className="text-red-500" />
                                        <span className="text-sm text-red-600">Invalid email format</span>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* New Email */}
                    <div className="relative">
                        <InputType 
                            type="email" 
                            isEdit={true} 
                            onChange={setNewEmail} 
                            value={newEmail} 
                            label='New Email Address'
                            placeholder='Enter your new email'
                            required={true}
                        />
                        {newEmail && (
                            <div className="mt-2 flex items-center gap-2">
                                {isNewEmailValid ? (
                                    <>
                                        <CheckCircle size={16} className="text-green-500" />
                                        <span className="text-sm text-green-600">Valid email format</span>
                                    </>
                                ) : (
                                    <>
                                        <AlertCircle size={16} className="text-red-500" />
                                        <span className="text-sm text-red-600">Invalid email format</span>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Confirm New Email */}
                    <div className="relative">
                        <InputType 
                            type="email" 
                            isEdit={true} 
                            onChange={setConfirmNewEmail} 
                            value={confirmNewEmail}
                            label='Confirm New Email Address'
                            placeholder='Confirm your new email'
                            required={true}
                        />
                        {confirmNewEmail && (
                            <div className="mt-2 flex items-center gap-2">
                                {isConfirmEmailValid ? (
                                    <>
                                        <CheckCircle size={16} className="text-green-500" />
                                        <span className="text-sm text-green-600">Email addresses match</span>
                                    </>
                                ) : (
                                    <>
                                        <AlertCircle size={16} className="text-red-500" />
                                        <span className="text-sm text-red-600">Email addresses don't match</span>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Password Confirmation */}
                    <div className="relative">
                        <InputType 
                            type={showPassword ? 'text' : 'password'} 
                            isEdit={true} 
                            onChange={setPassword} 
                            value={password} 
                            label='Current Password'
                            placeholder='Enter your current password'
                            required={true}
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    {/* Error Message */}
                    {isError && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <AlertCircle size={16} className="text-red-500" />
                            <span className="text-red-700 text-sm">{isError}</span>
                        </div>
                    )}

                    {/* Success Message */}
                    {isSuccess && (
                        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <CheckCircle size={16} className="text-green-500" />
                            <span className="text-green-700 text-sm">{isSuccess}</span>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button 
                        type="submit"
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                            isLoading 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
                        } text-white`}
                    >
                        {isLoading ? 'Updating Email...' : 'Change Email Address'}
                    </button>
                </div>

                {/* Important Notes */}
                <div className={`mt-6 p-4 rounded-lg ${theme ? "bg-light-background" : "bg-dark-background"}`}>
                    <h3 className="font-semibold mb-3">Important Notes:</h3>
                    <ul className="text-sm space-y-2">
                        <li className="flex items-start gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                            <span>You'll receive a verification email at your new address</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                            <span>Your old email will remain active until you verify the new one</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                            <span>Check your spam folder if you don't receive the verification email</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                            <span>Contact support if you need help accessing your account</span>
                        </li>
                    </ul>
                </div>

                {/* Email Requirements */}
                <div className={`mt-4 p-4 rounded-lg ${theme ? "bg-light-background" : "bg-dark-background"}`}>
                    <h3 className="font-semibold mb-2">Email Requirements:</h3>
                    <ul className="text-sm space-y-1">
                        <li className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${isCurrentEmailValid ? 'bg-green-500' : 'bg-gray-300'}`} />
                            Valid current email format
                        </li>
                        <li className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${isNewEmailValid ? 'bg-green-500' : 'bg-gray-300'}`} />
                            Valid new email format
                        </li>
                        <li className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${isConfirmEmailValid ? 'bg-green-500' : 'bg-gray-300'}`} />
                            Email addresses match
                        </li>
                        <li className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${currentEmail && newEmail && currentEmail !== newEmail ? 'bg-green-500' : 'bg-gray-300'}`} />
                            New email different from current
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default ResetEmail