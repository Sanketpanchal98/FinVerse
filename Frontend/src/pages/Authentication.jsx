import { useState, useEffect } from "react";
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { userLogin, userRegister } from "../API/User.api";
import ArrowLoader from "../Animations/ArrowLoader";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../Slices/AuthSlice";
import { toast, ToastContainer } from "react-toastify";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useErrorBoundary } from "react-error-boundary";

// const ToastContainer = () => <div></div>;

const Authentication = () => {
  const [error, setError] = useState();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setLoading] = useState(false)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const toggleForm = () => setIsLogin(!isLogin);
  const navigate = useNavigate()
  const {showBoundary} = useErrorBoundary()

  const dispatch = useDispatch()
  const { isAuthenticated, user } = useSelector(state => state.user)
  useEffect(() => {
    if (isAuthenticated) {
      toast.success(`${isLogin ? "Login" : "Registration"} successful!`);
      navigate("/dashboard");
    }
  }, [isAuthenticated]);

  const submitForm = async (e) => {
    e.preventDefault();
    setLoading(true)
    let res;
    try {
      const data = isLogin ? {
        email: email,
        password: password
      }
      : {
        name: name,
        password : password,
        email : email
      }
      
      if (isLogin) {
        res = await userLogin(data)
      } else {        
        res = await userRegister(data)        
      }
    } catch (error) {
      // showBoundary(error).
      setError(error?.response?.data?.message)

    } finally {
      setLoading(false)
    }
    
    dispatch(addUser(res.data))
    return;

    
  }
  const googleAuth = () => {
  window.location.href = import.meta.env.VITE_GOOGLE_AUTH_SERVER;
}


  return isLoading ? <ArrowLoader /> : (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-50 to-green-50 flex">
      <ToastContainer />
      
      {/* Left Side - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800"></div>
        <div className="absolute inset-0 bg-black/10"></div>
        
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white">
          <div className="w-3/4 text-center space-y-6">
            <div className="w-48 h-20 mx-auto gap-3 mb-8 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <img src="\Logo\FinVerse_New.png" alt="" className="rounded-full w-12 h-12"/>
              <div className="text-3xl font-bold">
                <span className="text-green-400">Fin</span>
                <span className="text-white">Verse</span>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Start Your Financial Journey
            </h1>
            
            <p className="text-lg text-blue-100 leading-relaxed">
              Take control of your financial future with smart decisions and expert guidance. Your journey to financial freedom starts here.
            </p>
            
            <div className="pt-6">
              <button
                onClick={toggleForm}
                className="px-8 py-3 bg-white text-blue-700 font-semibold rounded-xl hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {isLogin ? "Create Account" : "Sign In Instead"}
              </button>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        {/* <div className="absolute top-20 right-20 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-green-400/20 rounded-full blur-xl"></div> */}
      </div>

      {/* Right Side - Form Section */}
      <div className="flex-1 lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center gap-3 text-3xl font-bold">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg">
              <img src="\Logo\FinVerse_New.png" alt="" className="rounded-full w-12 h-12"/>
              </div>
              <span className="text-gray-800">
                <span className="text-green-500">Fin</span>Verse
              </span>
            </div>
          </div>

          {/* Form Header */}
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {isLogin ? "Welcome back" : "Create account"}
            </h2>
            <p className="text-gray-600">
              {isLogin 
                ? "Enter your credentials to access your account" 
                : "Fill in your details to get started"
              }
            </p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* Username/Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">
                {isLogin ? "Email" : "Username"}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={isLogin ? email : name}
                  onChange={(e) => isLogin ? setEmail(e.target.value) : setName(e.target.value)}
                  className="w-full focus:outline-none pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  placeholder={isLogin ? "Enter email" : "Choose a username"}
                  required
                />
              </div>
            </div>

            {/* Email Field (Register only) */}
            {!isLogin && (
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
                    className="w-full focus:outline-none pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    placeholder="Enter your email address"
                    required
                  />
                </div>
              </div>
            )}

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 focus:outline-none pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600 font-medium">{error}</p>
              </div>
            )}

            {/* Forgot Password (Login only) */}
            {isLogin && (
              <div className="text-right">
                <Link type="button" className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                to={'/forgot-password'}
                >
                  Forgot password?
                </Link>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={submitForm}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
            >
              {isLogin ? "Sign In" : "Create Account"}
            </button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gradient-to-br from-slate-50 to-blue-50 text-gray-500">
                or continue with
              </span>
            </div>
          </div>

          {/* Google OAuth */}
          <button
            onClick={googleAuth}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 bg-white/50 backdrop-blur-sm group"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="text-gray-700 font-medium group-hover:text-gray-900">
              Continue with Google
            </span>
          </button>

          {/* Toggle Form */}
          <div className="text-center pt-4">
            <p className="text-gray-600">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={toggleForm}
                className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );

};

export default Authentication;