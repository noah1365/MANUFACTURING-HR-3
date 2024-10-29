import bcrypt from "bcryptjs";

import { useEffect, useState } from "react";

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useEmployeeStore } from "../../store/employeeStore";

import defaultimage from '../../assets/defaultimage.png';

const Profile = () => {
  const { fetchData, user, changePassword, changeUserRole } = useEmployeeStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordChangeCooldown, setPasswordChangeCooldown] = useState(false);
  const [remainingCooldownTime, setRemainingCooldownTime] = useState(0);
  const [showPassword,setShowPassword] = useState(false);

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    document.title = "Profile";
    const fetchUserData = async () => {
      try {
        await fetchData();
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error('Failed to load user data. Please try again.');
      }
    };
    fetchUserData();
  }, [fetchData]);

  useEffect(() => {
    if (passwordChangeCooldown) {
      setRemainingCooldownTime(5 * 60);
      const timer = setInterval(() => {
        setRemainingCooldownTime((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setPasswordChangeCooldown(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [passwordChangeCooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(newPassword.trim() !== confirmPassword.trim()){
      toast.error('Passwords do not match. Please try again.');
      return;
    }

    const minLengthRegex = /^.{8,}$/;
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    const numberRegex = /\d/;
    const specialCharRegex = /[$@#&!%*?]/;

    if(!minLengthRegex.test(newPassword)){
      toast.error('New password must be at least 8 characters long.');
      return;
    }
    if(!uppercaseRegex.test(newPassword)){
      toast.error('New password must contain at least 1 uppercase letter.');
      return;
    }
    if(!lowercaseRegex.test(newPassword)){
      toast.error('New password must contain at least 1 lowercase letter.');
      return;
    }
    if(!numberRegex.test(newPassword)){
      toast.error('New password must contain at least 1 number.');
      return;
    }
    if(!specialCharRegex.test(newPassword)){
      toast.error('New password must contain at least 1 special character (e.g., @, $, #, &, !, %).');
      return;
    }
    if(passwordChangeCooldown){
      const minutesLeft = Math.floor(remainingCooldownTime / 60);
      const secondsLeft = remainingCooldownTime % 60;
      toast.error(`You can change your password in ${minutesLeft}m ${secondsLeft}s.`);
      return;
    }

    setIsLoading(true);

    try {
      if(!user || !user.password){
        toast.error('User data is not available. Please refresh and try again.');
        return;
      }

      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if(!isCurrentPasswordValid){
        toast.error('Current password is incorrect. Please try again.');
        return;
      }

      const isOldPassword = await bcrypt.compare(newPassword, user.password);
      if(isOldPassword){
        toast.error('New password cannot be the same as the current password!');
        return;
      }

      const success = await changePassword(currentPassword, newPassword, confirmPassword);
      if(success){
        toast.success('Password changed successfully!');

        setPasswordChangeCooldown(true);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setIsModalOpen(false);
      } else {
        toast.error('Error changing password. Please try again.');
      }
    } catch (error) {
      console.error("Error during password change:", error);
      toast.error('An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  const [newRole, setNewRole] = useState('');

  const handleChangeRole = async (role) => {
    
    if(!user || !user._id){
        toast.error('User data is not available. Please refresh and try again.');
        return;
    }

    if(!role){
        toast.error('Please select a role before changing.');
        return;
    }
    try {
        await changeUserRole(user._id, role);
        toast.success(`Change role to ${role}!`);
        window.location.reload();
    } catch (error) {
        console.error("Error changing user role:", error);

        if(error.response && error.response.data){
            const { message } = error.response.data;

            if(message){
                toast.error(message);
            }else{
                toast.error('Failed to change user role. Please try again.');
            }
        }else{
            toast.error('Failed to change user role. Please try again.');
        }
    }
};

  return (
    <div className="container mx-auto mt-10 p-8 max-w-4xl bg-white shadow-lg border-2 rounded-lg">
      <ToastContainer />
      <div className="flex flex-col items-center mb-6">
      <div>
        {(user?.uniqueRole?.length === 0 || user?.uniqueRole !== 'employee') && (
          <div className="mt-4">      
            <select
              value={newRole}
              onChange={(e) => handleChangeRole(e.target.value)}
              className="border border-gray-300 rounded p-1 w-full mb-2"
            >
              <option disabled value="">Select Role</option>
              <option value="Employee">Employee</option>
              <option value="Manager">Manager</option>
            </select>
          </div>
        )}
      </div>
        <button className="relative group">
          <img
            src={user?.profilePic || defaultimage}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-2 border-gray-300"
          />
          <span className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 rounded-full transition duration-200 flex items-center justify-center">
            <span className="text-white font-medium">Edit</span>
          </span>
        </button>
        <div className="mt-4 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 flex justify-center space-x-2">
            <abbr title="Last name" className="hover:text-blue-600 transition-colors no-underline">
              {user?.lastName || 'N/A'}
            </abbr>
            <abbr title="First name" className="hover:text-blue-600 transition-colors no-underline">
              {user?.firstName || 'N/A'}
            </abbr>
            <abbr title="Middle name" className="hover:text-blue-600 transition-colors no-underline">
              {user?.middleName || 'N/A'}
            </abbr>
          </h2>
          <p className="text-gray-600 mt-1">Position: {user?.position || 'N/A'}</p>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-medium text-gray-700 mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-lg text-gray-700 font-medium">{user?.email || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Phone Number</p>
            <p className="text-lg text-gray-700 font-medium">{user?.phoneNumber || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Gender</p>
            <p className="text-lg text-gray-700 font-medium">{user?.gender || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Birthday</p>
            <p className="text-lg text-gray-700 font-medium">{formatDate(user?.bDate) || "N/A"}</p>
          </div>
        </div>
      </div>
      <hr className="border-t border-gray-300 my-6 w-full mx-auto" />

      <div className="mt-8">
        <h3 className="text-xl font-medium text-gray-700 mb-4">Address</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500">Province</p>
            <p className="text-lg text-gray-700 font-medium">{user?.address?.province || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Municipality</p>
            <p className="text-lg text-gray-700 font-medium">{user?.address?.municipality || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Postal Code</p>
            <p className="text-lg text-gray-700 font-medium">{user?.address?.postalCode || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Street</p>
            <p className="text-lg text-gray-700 font-medium">{user?.address?.street || "N/A"}</p>
          </div>
        </div>
      </div>

      <hr className="border-t border-gray-300 my-6 w-full mx-auto" />
      <h3 className="text-lg font-semibold mb-4">Security</h3>

      <button
        onClick={() => setIsModalOpen(true)}
        className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
      >
        Change Password
      </button>

      {isModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto"style={{ width: '400px' }}> {/* Increased max-width to max-w-xl */}
      <h3 className="text-lg font-semibold mb-4">Change Password</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Current Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="border border-gray-300 rounded-lg p-2 w-full"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword((prev) => !prev)}
              className="absolute right-2 top-2 text-gray-600"
            >
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">New Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="border border-gray-300 rounded-lg p-2 w-full"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword((prev) => !prev)}
              className="absolute right-2 top-2 text-gray-600"
            >
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="border border-gray-300 rounded-lg p-2 w-full"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-2 top-2 text-gray-600"
            >
            </button>
          </div>
        </div>
        <div className="mt-4">
      <button
        type="button"
        onClick={() => setShowPassword(prev => !prev)}
        className="block w-full mb-4 text-blue-600 hover:underline"
      >
        {showPassword ? 'Hide Passwords' : 'Show Passwords'}
      </button>

      <button
        type="submit"
        disabled={isLoading}
        className={`block w-full bg-blue-600 text-white p-2 rounded-lg ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isLoading ? 'Changing...' : 'Change Password'}
      </button>
</div>

      </form>
      <button
        onClick={() => setIsModalOpen(false)}
        className="mt-4 text-gray-600 hover:text-gray-800"
      >
        Cancel
      </button>
    </div>
  </div>
)}

    </div>
  );
};

export default Profile;
