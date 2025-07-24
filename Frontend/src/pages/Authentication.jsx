import { useState, useEffect } from "react";
import { userLogin, userRegister } from "../API/User.api";
import ArrowLoader from "../Animations/ArrowLoader";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../Slices/AuthSlice";
import { toast, ToastContainer } from "react-toastify";
import { Navigate, useNavigate } from "react-router-dom";
import { useErrorBoundary } from "react-error-boundary";

const Authentication = () => {
  const [error, setError] = useState();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setLoading] = useState(false)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
        name: name,
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

  return isLoading ? <ArrowLoader /> : (
    <div className="flex h-screen w-full overflow-hidden font-sans bg-[#ecf0f1] md:flex-row flex-col ">
      {/* Left Side */}
      <ToastContainer />
      <div className="md:flex hidden relative md:w-1/2 w-full h-1/2 md:h-full flex flex-col justify-center items-center bg-[#2c3e50] text-white px-10 py-16 transition-all duration-700">
        <h1 className="text-4xl font-bold mb-4 text-center">
          Start Your Journey
        </h1>
        <p className="text-lg mb-6 text-center max-w-sm">
          Your financial freedom begins with one decision—start today, control tomorrow.
        </p>
        <button
          onClick={toggleForm}
          className="mt-4 px-6 py-2 bg-white text-[#2c3e50] font-semibold rounded-md hover:bg-gray-100 transition"
        >
          {isLogin ? "Register" : "Login"}
        </button>
      </div>

      {/* Right Side */}

      <div className="md:w-1/2 w-full h-full flex md:flex-row flex-col items-center justify-center p-10 bg-white overflow-hidden gap-4">
        {isLogin ? (
          <div className="w-full h-full flex flex-col justify-center items-center gap-4">
            {/* Logo for mobile */}
            <div className="text-4xl font-bold w-full -mt-20 flex gap-2">
              <img src="public\Logo\FinVerse_New.png" alt="" className="w-12 rounded-full" />
              <h1><span className="text-green-400">Fin</span>Verse</h1>
            </div>
            <h2 className="text-2xl font-bold mb-6 text-[#2c3e50] text-start flex md:justify-center w-full mt-4">
              Login
            </h2>

            <form
              className="space-y-5 w-full flex justify-center flex-col items-center"
              onSubmit={(e) => submitForm(e)}
            >
              {/* Username */}
              <div className="relative w-full">
                <input
                  type="text"
                  id="username"
                  placeholder=" "
                  value={name}
                  className={`peer w-full bg-transparent placeholder:text-transparent text-slate-700 text-sm border border-slate-200 rounded-xl px-6 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-md focus:shadow`}
                  onChange={(e) => setName(e.target.value)}
                />
                <label
                  htmlFor="username"
                  className="absolute cursor-text bg-white px-1 left-6 top-4 text-slate-500 text-sm transition-all transform origin-left 
                    peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-500
                    peer-focus:-top-2 peer-focus:left-6 peer-focus:text-xs peer-focus:text-slate-400 peer-focus:scale-90
                    peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-6 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-400 peer-[:not(:placeholder-shown)]:scale-90"
                >
                  Email or Username
                </label>
              </div>

              {/* Password */}
              <div className="relative w-full">
                <input
                  type="password"
                  id="password"
                  placeholder=" "
                  value={password}
                  className="peer w-full bg-transparent placeholder:text-transparent text-slate-700 text-sm border border-slate-200 rounded-xl px-6 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-md focus:shadow"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label
                  htmlFor="password"
                  className="absolute cursor-text bg-white px-1 left-6 top-4 text-slate-500 text-sm transition-all transform origin-left 
                    peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-500
                    peer-focus:-top-2 peer-focus:left-6 peer-focus:text-xs peer-focus:text-slate-400 peer-focus:scale-90
                    peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-6 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-400 peer-[:not(:placeholder-shown)]:scale-90"
                >
                  Password
                </label>
              </div>
            {
              error && <div className="font-semibold text-red-500">{error}</div>
            }
              <button
                type="submit"
                className="w-full bg-[#2c3e50] text-white p-3 rounded-3xl hover:bg-[#34495e]"
              >
                Login
              </button>
            </form>

            {/* Divider and OAuth */}
            <div className="flex gap-2 flex-col w-full justify-center">
              <div className="flex items-center gap-4 my-4">
                <div className="h-px flex-1 bg-slate-300"></div>
                <span className="text-sm text-slate-500">or</span>
                <div className="h-px flex-1 bg-slate-300"></div>
              </div>

              <button className="flex w-full border-2 py-4 px-4 border-slate-300 justify-center rounded-3xl gap-4">
                <img src="public/icon/google.png" alt="Google" className="w-6 rounded-full" />
                <p className="text-slate-600">Continue with Google</p>
              </button>

              <button className="flex w-full border-2 py-4 px-4 border-slate-300 justify-center rounded-3xl gap-4 my-4">
                <img src="public/icon/facebook.png" alt="Facebook" className="w-6 rounded-full" />
                <p className="text-slate-600">Continue with Facebook</p>
              </button>

              <div className="flex gap-2 w-full justify-center md:hidden">
                <h1 className="text-slate-400">Don't have account?</h1>
                <button className="rounded-xl" onClick={() => toggleForm(prev => !prev)}><u>Sign up</u></button>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col justify-center items-center gap-4">
            {/* Logo for mobile */}
            <div className="text-4xl font-bold w-full flex gap-2">
              <img src="public\Logo\FinVerse_New.png" alt="" className="w-12 rounded-full" />
              <h1><span className="text-green-400">Fin</span>Verse</h1>
            </div>
            <h2 className="text-2xl font-bold mb-6 text-[#2c3e50] text-center w-full mt-6 flex md:justify-center justify-right gap-2">
              Register
            </h2>

            <form className="space-y-5 w-full"
              onSubmit={(e) => submitForm(e)}
            >
              {/* Username */}
              <div className="relative w-full">
                <input
                  type="text"
                  id="register-username"
                  placeholder=" "
                  value={name}
                  className="peer w-full bg-transparent placeholder:text-transparent text-slate-700 text-sm border border-slate-200 rounded-xl px-6 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-md focus:shadow"
                  onChange={(e) => setName(e.target.value)}
                />
                <label
                  htmlFor="register-username"
                  className="absolute cursor-text bg-white px-1 left-6 top-4 text-slate-500 text-sm transition-all transform origin-left 
                    peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-500
                    peer-focus:-top-2 peer-focus:left-6 peer-focus:text-xs peer-focus:text-slate-400 peer-focus:scale-90
                    peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-6 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-400 peer-[:not(:placeholder-shown)]:scale-90"
                >
                  Email or Username
                </label>
              </div>

              {/* Email (optional) */}
              <div className="relative w-full">
                <input
                  type="email"
                  id="email"
                  placeholder=" "
                  value={email}
                  required
                  className="peer w-full bg-transparent placeholder:text-transparent text-slate-700 text-sm border border-slate-200 rounded-xl px-6 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-md focus:shadow"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label
                  htmlFor="email"
                  className="absolute cursor-text bg-white px-1 left-6 top-4 text-slate-500 text-sm transition-all transform origin-left 
                    peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-500
                    peer-focus:-top-2 peer-focus:left-6 peer-focus:text-xs peer-focus:text-slate-400 peer-focus:scale-90
                    peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-6 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-400 peer-[:not(:placeholder-shown)]:scale-90"
                >
                  Email
                </label>
              </div>

              {/* Password */}
              <div className="relative w-full">
                <input
                  type="password"
                  id="register-password"
                  placeholder=" "
                  value={password}
                  className="peer w-full bg-transparent placeholder:text-transparent text-slate-700 text-sm border border-slate-200 rounded-xl px-6 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-md focus:shadow"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label
                  htmlFor="register-password"
                  className="absolute cursor-text bg-white px-1 left-6 top-4 text-slate-500 text-sm transition-all transform origin-left 
                    peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-500
                    peer-focus:-top-2 peer-focus:left-6 peer-focus:text-xs peer-focus:text-slate-400 peer-focus:scale-90
                    peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-6 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-400 peer-[:not(:placeholder-shown)]:scale-90"
                >
                  Password
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-[#2c3e50] text-white p-3 rounded-3xl hover:bg-[#34495e]"
              >
                Register
              </button>
            </form>

            {/* Divider and OAuth */}
            <div className="flex gap-2 flex-col w-full justify-center">
              <div className="flex items-center gap-4 my-4">
                <div className="h-px flex-1 bg-slate-300"></div>
                <span className="text-sm text-slate-500">or</span>
                <div className="h-px flex-1 bg-slate-300"></div>
              </div>

              <button className="flex w-full border-2 py-4 px-4 justify-center border-slate-300 rounded-3xl gap-4">
                <img src="public/icon/google.png" alt="Google" className="w-6 rounded-full" />
                <p className="text-slate-600">Continue with Google</p>
              </button>

              <button className="flex w-full border-2 py-4 px-4 border-slate-300 justify-center rounded-3xl gap-4 my-4">
                <img src="public/icon/facebook.png" alt="Facebook" className="w-6 rounded-full" />
                <p className="text-slate-600">Continue with Facebook</p>
              </button>

              <div className="flex gap-2 w-full justify-center md:hidden">
                <h1 className="text-slate-400">Already have account?</h1>
                <button className="rounded-xl" onClick={() => toggleForm(prev => !prev)}><u>Sign in</u></button>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default Authentication;