import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import { useEmployeeStore } from '../store/employeeStore';

const ForgotPassword = () => {
    const [email, setEmail] = useState(() => localStorage.getItem('email') || '');
    const [otp, setOtp] = useState(() => localStorage.getItem('otp') || '');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showOtp, setShowOtp] = useState(() => localStorage.getItem('showOtp') === 'true');
    const [emailSent, setEmailSent] = useState(() => localStorage.getItem('emailSent') === 'true');
    const [timer, setTimer] = useState(120);

    const {forgotPassword,resetPasswordOtp} = useEmployeeStore();

    useEffect(() => {
        document.title = 'Forgot your password';
    }, []);

    useEffect(() => {
        if (emailSent && timer > 0) {
            const countdown = setInterval(() => setTimer(prev => prev - 1), 1000);
            return () => clearInterval(countdown);
        } else if (timer === 0) {
            setTimer(null);
        }
    }, [emailSent, timer]);

    useEffect(() => {
        localStorage.setItem('email', email);
    }, [email]);

    useEffect(() => {
        localStorage.setItem('otp', otp);
    }, [otp]);

    useEffect(() => {
        localStorage.setItem('emailSent', emailSent);
        localStorage.setItem('showOtp', showOtp);
    }, [emailSent, showOtp]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        try {
            const response = await forgotPassword(email);
            setLoading(false);
            setEmailSent(true);
            setShowOtp(true);
            setTimer(120);
            toast.success(response.message);
        } catch (error) {
            setLoading(false);
            toast.error(error.message || 'An error occurred. Please try again later.');
        }
    };
    
    

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        if(!otp){
            toast.error('OTP is required.');
            setLoading(false);
            return;
        }
    
        if(!newPassword){
            toast.error('New password is required.');
            setLoading(false);
            return;
        }
    
        const minLengthRegex = /^.{8,}$/;
        const uppercaseRegex = /[A-Z]/;
        const lowercaseRegex = /[a-z]/;
        const numberRegex = /\d/;
        const specialCharRegex = /[$@#&!%*?]/;
    
        if(!minLengthRegex.test(newPassword)){
            toast.error('New password must be at least 8 characters long.');
            setLoading(false);
            return;
        }
        if(!uppercaseRegex.test(newPassword)){
            toast.error('New password must contain at least 1 uppercase letter.');
            setLoading(false);
            return;
        }
        if(!lowercaseRegex.test(newPassword)){
            toast.error('New password must contain at least 1 lowercase letter.');
            setLoading(false);
            return;
        }
        if(!numberRegex.test(newPassword)){
            toast.error('New password must contain at least 1 number.');
            setLoading(false);
            return;
        }
        if(!specialCharRegex.test(newPassword)){
            toast.error('New password must contain at least 1 special character (e.g., @, $, #, &, !, %).');
            setLoading(false);
            return;
        }
    
        try {
            const success = await resetPasswordOtp(email,otp, newPassword);
            if(success){
                setLoading(false);
                toast.success('Password reset successfully.');
                clearForm();
            }
        } catch (error) {
            setLoading(false);
            toast.error(error.response?.data?.message || 'An error occurred. Please try again later.');
        }
    };
    

    const clearForm = () => {
        setEmail('');
        setOtp('');
        setNewPassword('');
        setEmailSent(false);
        setShowOtp(false);
        setTimer(null);
        localStorage.removeItem('email');
        localStorage.removeItem('otp');
        localStorage.removeItem('emailSent');
        localStorage.removeItem('showOtp');
        toast.info('Form cleared successfully');
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">Forgot Password</h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-5">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                            required
                            disabled={emailSent}
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading || emailSent} 
                        className="bg-blue-500 w-full text-white p-2 rounded hover:bg-blue-600"
                    >
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>

                {emailSent && !loading && (
                    <button 
                        onClick={handleSubmit} 
                        disabled={timer > 0} 
                        className={`bg-gray-500 w-full text-white p-2 rounded mt-3 ${timer > 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-600'}`}
                    >
                        Resend Email {timer > 0 ? `(${Math.floor(timer / 60)}:${(timer % 60).toString().padStart(2, '0')})` : ''}
                    </button>
                )}
                
                {showOtp && (
                    <form onSubmit={handleOtpSubmit} className="mt-5">
                        <div className="mb-5">
                            <input
                                type="number"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="Enter OTP"
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div className="mb-5">
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter new password"
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                                required
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="bg-green-500 w-full text-white p-2 rounded hover:bg-green-600"
                        >
                            Reset Password
                        </button>
                    </form>
                )}

                <ToastContainer />

                <div className="text-center mt-4">
                    <Link to="/login" className="text-blue-500 hover:underline">
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
