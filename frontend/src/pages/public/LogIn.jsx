import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

import { Link } from "react-router-dom";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import jjmLogo from '../../assets/jjmlogo.jpg';

const LogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verified,setVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated ,error, csrfToken} = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const result = await login(email,password,verified, csrfToken);
        if(!result){
            if(error){
                console.log("Error message:", error);
                if(error.toLowerCase().includes("not verified")){
                    toast.warn("Your account is not verified. Please verify your account first!");
                }else{
                    toast.error("Username or password incorrect!");
                }
            }
            return;
        }else{
            toast.success("Logged in successfully! Your account is verified.");
        }
    } catch (error) {
        console.error("Login error:", error);
        toast.error("An error occurred during login. Please try again later.");
    }
};

  useEffect(() => {
    document.title ='Login';
    if(isAuthenticated){
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="hero bg-base-200 min-h-screen">
      <ToastContainer />
      <div className="hero-content flex flex-col lg:flex-row-reverse w-full px-4 md:px-8">
        <div className="text-center lg:text-left lg:w-1/2">
          <div className="flex justify-center py-6">
            <img
              src={jjmLogo}
              alt="Manufacturing Logo"
              className="w-32 h-32 object-contain"
            />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold">Login to HR3</h1>
          <p className="py-6">
            Welcome to JJM Manufacturing! Basta Best Quality and Best Brand JJM na yan!
          </p>
        </div>
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <form className="card-body" onSubmit={handleLogin}>
            <div className="form-control">
              <label className="label">
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="input input-bordered w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="input input-bordered w-full"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                </div>
            </div>
            <div className="form-control mt-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2 ml-1"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                />
                <span className="label-text">Show Password</span>
              </label>
            </div>
            <div className="form-control mt-6">
              <button className="btn btn-primary">Login</button>
            </div>
            <span className="text-center underline"><Link to="/forgot-password">Forgot password?</Link></span>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
