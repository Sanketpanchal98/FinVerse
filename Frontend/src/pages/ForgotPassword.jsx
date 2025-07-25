import React, { useState } from 'react';
import { Mail, Lock, ArrowLeft, CheckCircle, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Mock components - replace with your actual components
const ArrowLoader = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

const ToastContainer = () => <div></div>;

const ForgotPassword = () => {
  const [currentStep, setCurrentStep] = useState('request'); // 'request', 'verify', 'reset', 'success'
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
    const navigate = useNavigate()
  // Backend integration points
  const requestPasswordReset = async (email) => {
    setIsLoading(true);
    setError('');
    
    try {
      // TODO: Replace with your actual API call
      const response = await axios.post(import.meta.env.VITE_SEND_OTP_API_URL, {email : email}, {
        withCredentials : true
      })
      console.log(response);
      
      
      if (response.status === 200) {
        setCurrentStep('verify');
        startResendTimer();
      } else {
        setError('Failed to send reset email');
      }
    } catch (err) {
        console.log(err);
        
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (email, otp) => {
    setIsLoading(true);
    setError('');
    
    try {
      // TODO: Replace with your actual API call
      const response = await fetch(import.meta.env.VITE_VERIFY_OTP_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });
      
      if (response.status === 200) {
        setCurrentStep('reset');
      } else {
        setError('Invalid or expired OTP');
      }
    } catch (err) {
        
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email, otp, newPassword) => {
    setIsLoading(true);
    setError('');
    
    try {
      // TODO: Replace with your actual API call
      const response = await fetch(import.meta.env.VITE_RESET_PASSWORD_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, newPassword }),
      });
      
      
      if (response.status === 200) {
        setCurrentStep('success');
      } else {
        setError('Failed to reset password');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const startResendTimer = () => {
    setResendTimer(60);
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleRequestSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    requestPasswordReset(email);
  };

  const handleVerifySubmit = (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      setError('Please enter the verification code');
      return;
    }
    verifyOTP(email, otp);
  };

  const handleResetSubmit = (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    resetPassword(email, otp, newPassword);
  };

  const handleResendOTP = () => {
    if (resendTimer === 0) {
      requestPasswordReset(email);
    }
  };

  const goBack = () => {
    if (currentStep === 'verify') {
      setCurrentStep('request');
    } else if (currentStep === 'reset') {
      setCurrentStep('verify');
    }
    setError('');
  };

  const goToLogin = () => {
    // TODO: Navigate to login page
    console.log('Navigate to login page');
  };

  if (isLoading) return <ArrowLoader />;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-blue-50 flex">
      <ToastContainer />
      
      {/* Left Side - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800"></div>
        <div className="absolute inset-0 bg-black/10"></div>
        
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white">
          <div className="max-w-md text-center space-y-6">
            <div className="w-20 h-20 mx-auto mb-8 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <div className="text-3xl font-bold">
                <span className="text-green-400">Fin</span>
                <span className="text-white">Verse</span>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              {currentStep === 'request' && 'Reset Your Password'}
              {currentStep === 'verify' && 'Check Your Email'}
              {currentStep === 'reset' && 'Create New Password'}
              {currentStep === 'success' && 'Password Updated!'}
            </h1>
            
            <p className="text-lg text-blue-100 leading-relaxed">
              {currentStep === 'request' && 'Enter your email address and we\'ll send you a verification code to reset your password.'}
              {currentStep === 'verify' && 'We\'ve sent a 6-digit verification code to your email. Enter it below to continue.'}
              {currentStep === 'reset' && 'Choose a strong password to secure your FinVerse account.'}
              {currentStep === 'success' && 'Your password has been successfully updated. You can now sign in with your new password.'}
            </p>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-green-400/20 rounded-full blur-xl"></div>
      </div>

      {/* Right Side - Form Section */}
      <div className="flex-1 lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center gap-3 text-3xl font-bold">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white text-lg">
                FV
              </div>
              <span className="text-gray-800">
                <span className="text-green-500">Fin</span>Verse
              </span>
            </div>
          </div>

          {/* Back Button */}
          {(currentStep === 'verify' || currentStep === 'reset') && (
            <button
              onClick={goBack}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          )}

          {/* Request Password Reset Form */}
          {currentStep === 'request' && (
            <>
              <div className="text-center lg:text-left">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Forgot Password?
                </h2>
                <p className="text-gray-600">
                  No worries! Enter your email address and we'll send you a verification code.
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 block">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                      placeholder="Enter your email address"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600 font-medium">{error}</p>
                  </div>
                )}

                <button
                  onClick={handleRequestSubmit}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                >
                  Send Verification Code
                </button>

                <div className="text-center pt-4">
                  <p className="text-gray-600">
                    Remember your password?{' '}
                    <button
                      onClick={goToLogin}
                      className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
                    >
                      Sign in
                    </button>
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Verify OTP Form */}
          {currentStep === 'verify' && (
            <>
              <div className="text-center lg:text-left">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Enter Verification Code
                </h2>
                <p className="text-gray-600">
                  We've sent a 6-digit code to <span className="font-semibold text-gray-800">{email}</span>
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 block">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm text-center text-2xl font-mono letter-spacing-wide"
                    placeholder="000000"
                    maxLength="6"
                    required
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600 font-medium">{error}</p>
                  </div>
                )}

                <button
                  onClick={handleVerifySubmit}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                >
                  Verify Code
                </button>

                <div className="text-center">
                  <p className="text-gray-600 text-sm mb-2">
                    Didn't receive the code?
                  </p>
                  <button
                    onClick={handleResendOTP}
                    disabled={resendTimer > 0}
                    className={`text-sm font-medium ${
                      resendTimer > 0
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-blue-600 hover:text-blue-700 hover:underline'
                    } transition-colors`}
                  >
                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Reset Password Form */}
          {currentStep === 'reset' && (
            <>
              <div className="text-center lg:text-left">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Create New Password
                </h2>
                <p className="text-gray-600">
                  Choose a strong password to secure your account
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 block">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                      placeholder="Enter new password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 block">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                      placeholder="Confirm new password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-700">
                    <strong>Password requirements:</strong> At least 8 characters long with a mix of letters, numbers, and symbols.
                  </p>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600 font-medium">{error}</p>
                  </div>
                )}

                <button
                  onClick={handleResetSubmit}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                >
                  Update Password
                </button>
              </div>
            </>
          )}

          {/* Success State */}
          {currentStep === 'success' && (
            <>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Password Updated Successfully!
                </h2>
                <p className="text-gray-600 mb-8">
                  Your password has been changed. You can now sign in with your new password.
                </p>
                
                <button
                  onClick={goToLogin}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                >
                  Sign In Now
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;