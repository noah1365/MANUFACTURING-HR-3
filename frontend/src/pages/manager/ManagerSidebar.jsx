import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MdDashboard, MdPersonAdd } from 'react-icons/md';
import { FaMoneyBillWave, FaStar } from 'react-icons/fa';
import { TbCurrencyPeso } from "react-icons/tb";
import { AiOutlineBarChart,AiOutlineLineChart } from 'react-icons/ai';
import { GiHealthNormal } from 'react-icons/gi';

import jjmLogo from '../../assets/jjmlogo.jpg';
import { useAuthStore } from '../../store/authStore';

const ManagerSidebar = () => {
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
        <DashboardLink icon={<MdPersonAdd />} text="Employee List" to="/employee-list" isActive={activeLink === 'employee'} onClick={() => handleLinkClick('employee')} />
        <DashboardLink icon={<GiHealthNormal />} text="Benefits Administration" to="/benefits-administration" isActive={activeLink === 'benefits'} onClick={() => handleLinkClick('benefits')} />
        <DashboardLink icon={<FaStar />} text="Incentives Management" to="/incentives-management" isActive={activeLink === 'incentives'} onClick={() => handleLinkClick('incentives')} />
        <DashboardLink icon={<FaMoneyBillWave />} text="Compensation Planning" to="/compensation-overview" isActive={activeLink === 'compensation'} onClick={() => handleLinkClick('compensation')} />
        <DashboardLink icon={<TbCurrencyPeso />} text="Payroll Processing" to="/payroll-management" isActive={activeLink === 'payroll'} onClick={() => handleLinkClick('payroll')} />
        <DashboardLink icon={<AiOutlineBarChart />} text="Predictive Analytics" to="/predictive-analytics" isActive={activeLink === 'predictive'} onClick={() => handleLinkClick('predictive')} />
        <DashboardLink icon={<AiOutlineLineChart />} text="Behavioral Analytics" to="/Behavioral-analytics" isActive={activeLink === 'behavioural'} onClick={() => handleLinkClick('behavioral')} />
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

export default ManagerSidebar;
