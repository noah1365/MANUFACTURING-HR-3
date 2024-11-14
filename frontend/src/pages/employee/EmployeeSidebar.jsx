import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MdDashboard,MdFeedback } from 'react-icons/md';
import { FaMoneyBillWave, FaStar } from 'react-icons/fa';
import { GiHealthNormal } from 'react-icons/gi';

import jjmLogo from '../../assets/jjmlogo.jpg';
import { useAuthStore } from '../../store/authStore';

const EmployeeSidebar = () => {
  const [activeLink, setActiveLink] = useState(null);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    console.log('User authentication status changed:', isAuthenticated);
  }, [isAuthenticated]);

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  return (
    <div className="flex">
      <div
        className={`flex flex-col bg-white text-black px-4 py-4 border-r-2 
          md:sticky md:top-0 h-screen w-full fixed top-0 left-0 
          md:h-auto md:w-full md:bg-transparent md:shadow-none mt-6 z-50`}
        aria-label="Sidebar"
      >
        <div className="flex items-center gap-2 cursor-pointer mb-8 justify-center" aria-label="Dashboard Logo">
          <Link to="/"><img src={jjmLogo} alt="Dashboard logo" className="w-10 h-10" /></Link>
          <p className="text-xl font-bold">Dashboard</p>
        </div>

        <DashboardLink icon={<MdDashboard />} text="Dashboard" to="/" isActive={activeLink === 'dashboard'} onClick={() => handleLinkClick('dashboard')} />
        <DashboardLink icon={<GiHealthNormal />} text="My Benefits" to="/benefits-overview" isActive={activeLink === 'benefits'} onClick={() => handleLinkClick('benefits')} />
        <DashboardLink icon={<FaStar />} text="My Incentives" to="/incentives-overview" isActive={activeLink === 'incentives'} onClick={() => handleLinkClick('incentives')} />
        <DashboardLink icon={<FaMoneyBillWave />} text="My Salary" to="/my-salary-info" isActive={activeLink === 'salary'} onClick={() => handleLinkClick('salary')} />
        <DashboardLink icon={<MdFeedback />} text="My Feedback" to="/submit-feedbacks" isActive={activeLink === 'feedbacks'} onClick={() => handleLinkClick('feedbacks')} /> {/* New Feedback link */}
      </div>
    </div>
  );
};

const DashboardLink = ({ icon, text, to, isActive, onClick }) => (
  <Link to={to} className={`flex items-center gap-2 p-2 rounded-md hover:bg-gray-200 transition duration-200`} onClick={onClick}>
    <span className={`text-xl transition duration-200 ${isActive ? 'text-blue-500' : 'text-black'}`}>
      {icon}
    </span>
    <span className={`text-sm ${isActive ? 'text-blue-500' : 'text-black'}`}>{text}</span>
  </Link>
);

export default EmployeeSidebar;
