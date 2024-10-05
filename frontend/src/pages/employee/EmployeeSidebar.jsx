import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdDashboard } from 'react-icons/md';
import { GiWallet, GiGears, GiChecklist } from 'react-icons/gi';
import { FaRegUser } from 'react-icons/fa';
import { AiOutlineFileSearch } from 'react-icons/ai';
import { IoIosArrowDown, IoIosArrowUp, IoIosStats } from 'react-icons/io';

import jjmLogo from '../../assets/jjmlogo.jpg';

const EmployeeSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleSidebar = () => {
    setIsCollapsed(prev => {
      const newCollapseState = !prev;
      if (newCollapseState) {
        setOpenDropdown(null); 
      }
      return newCollapseState;
    });
  };

  const toggleDropdown = section => {
    setOpenDropdown(prev => (prev === section ? null : section));
  };

  return (
    <div
      className={`flex flex-col h-screen bg-white text-black px-4 py-4 border-r-2 sticky top-0 max-md:hidden transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-72 lg:w-60'
      }`}
      aria-label="Sidebar"
    >
      {/* Toggle Button */}
      <div className="flex justify-end">
        <button
          onClick={toggleSidebar}
          className={`mb-4 p-1 text-black border border-gray-300 rounded-md hover:bg-gray-200 transition duration-200 ${
            isCollapsed ? 'w-11' : 'w-11 '
          }`}
          aria-expanded={!isCollapsed}
          aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? '▶' : '◀'}
        </button>
      </div>

      {/* Logo */}
      <div
        className="flex items-center gap-2 cursor-pointer mb-8 justify-center"
        aria-label="Dashboard Logo"
      >
        <Link to="/"><img src={jjmLogo} alt="Dashboard logo" className="w-10 h-10" /></Link>
        {!isCollapsed && <p className="text-xl font-bold">Employee Portal</p>}
      </div>

      {/* Dashboard */}
      <div
        className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 transition-all duration-300 p-2 rounded-md mb-4 cursor-pointer"
        aria-label="Dashboard"
      >
        <MdDashboard className="w-5 h-5" />
        {!isCollapsed && <p className="text-sm font-semibold"><Link to="/">Dashboard</Link></p>}
      </div>

      {/* Personal Compensation Information */}
      <div className="mb-2">
        <div
          className="flex gap-2 items-center cursor-pointer text-sm hover:text-blue-500 transition duration-200"
          onClick={() => toggleDropdown('compensation')}
          aria-expanded={openDropdown === 'compensation'}
          aria-controls="compensation-dropdown"
          aria-label="Personal Compensation Information"
        >
          <GiWallet className="w-5 h-5" />
          {!isCollapsed && <span>Personal Compensation Information</span>}
          {!isCollapsed && (
            <div className="ml-auto">
              {openDropdown === 'compensation' ? <IoIosArrowUp size={15} /> : <IoIosArrowDown size={15} />}
            </div>
          )}
        </div>
        <ul
          id="compensation-dropdown"
          className={`pl-6 mt-1 space-y-1 overflow-hidden transition-max-height duration-500 ease-in-out ${
            openDropdown === 'compensation' ? 'max-h-screen' : 'max-h-0'
          }`}
        >
          <li><Link to="/salary-details">Salary Details</Link></li>
          <li><Link to="/compensation-history">Compensation History</Link></li>
        </ul>
      </div>

      {/* Benefits Management */}
      <div className="mb-2">
        <div
          className="flex gap-2 items-center cursor-pointer text-sm hover:text-blue-500 transition duration-200"
          onClick={() => toggleDropdown('benefits')}
          aria-expanded={openDropdown === 'benefits'}
          aria-controls="benefits-dropdown"
          aria-label="Benefits Management"
        >
          <GiGears className="w-5 h-5" />
          {!isCollapsed && <span>Benefits Management</span>}
          {!isCollapsed && (
            <div className="ml-auto">
              {openDropdown === 'benefits' ? <IoIosArrowUp size={15} /> : <IoIosArrowDown size={15} />}
            </div>
          )}
        </div>
        <ul
          id="benefits-dropdown"
          className={`pl-6 mt-1 space-y-1 overflow-hidden transition-max-height duration-500 ease-in-out ${
            openDropdown === 'benefits' ? 'max-h-screen' : 'max-h-0'
          }`}
        >
          <li><Link to="/benefits-overview">Benefits Overview</Link></li>
          <li><Link to="/benefits-enrollment">Benefits Enrollment</Link></li>
          <li><Link to="/claims-management">Claims Management</Link></li>
          <li><Link to="/benefit-statements">Benefit Statements</Link></li>
        </ul>
      </div>

      {/* Payroll Information */}
      <div className="mb-2">
        <div
          className="flex gap-2 items-center cursor-pointer text-sm hover:text-blue-500 transition duration-200"
          onClick={() => toggleDropdown('payroll')}
          aria-expanded={openDropdown === 'payroll'}
          aria-controls="payroll-dropdown"
          aria-label="Payroll Information"
        >
          <GiWallet className="w-5 h-5" />
          {!isCollapsed && <span>Payroll Information</span>}
          {!isCollapsed && (
            <div className="ml-auto">
              {openDropdown === 'payroll' ? <IoIosArrowUp size={15} /> : <IoIosArrowDown size={15} />}
            </div>
          )}
        </div>
        <ul
          id="payroll-dropdown"
          className={`pl-6 mt-1 space-y-1 overflow-hidden transition-max-height duration-500 ease-in-out ${
            openDropdown === 'payroll' ? 'max-h-screen' : 'max-h-0'
          }`}
        >
          <li><Link to="/pay-stubs">Pay Stubs</Link></li>
          <li><Link to="/tax-documents">Tax Documents</Link></li>
          <li><Link to="/direct-deposit">Direct Deposit</Link></li>
        </ul>
      </div>

      {/* Leave Management */}
      <div className="mb-2">
        <div
          className="flex gap-2 items-center cursor-pointer text-sm hover:text-blue-500 transition duration-200"
          onClick={() => toggleDropdown('leave')}
          aria-expanded={openDropdown === 'leave'}
          aria-controls="leave-dropdown"
          aria-label="Leave Management"
        >
          <GiChecklist className="w-5 h-5" />
          {!isCollapsed && <span>Leave Management</span>}
          {!isCollapsed && (
            <div className="ml-auto">
              {openDropdown === 'leave' ? <IoIosArrowUp size={15} /> : <IoIosArrowDown size={15} />}
            </div>
          )}
        </div>
        <ul
          id="leave-dropdown"
          className={`pl-6 mt-1 space-y-1 overflow-hidden transition-max-height duration-500 ease-in-out ${
            openDropdown === 'leave' ? 'max-h-screen' : 'max-h-0'
          }`}
        >
          <li><Link to="/leave-balances">Leave Balances</Link></li>
          <li><Link to="/leave-requests">Leave Requests</Link></li>
          <li><Link to="/leave-history">Leave History</Link></li>
        </ul>
      </div>

      {/* Retirement Plans */}
      <div className="mb-2">
        <div
          className="flex gap-2 items-center cursor-pointer text-sm hover:text-blue-500 transition duration-200"
          onClick={() => toggleDropdown('retirement')}
          aria-expanded={openDropdown === 'retirement'}
          aria-controls="retirement-dropdown"
          aria-label="Retirement Plans"
        >
          <GiGears className="w-5 h-5" />
          {!isCollapsed && <span>Retirement Plans</span>}
          {!isCollapsed && (
            <div className="ml-auto">
              {openDropdown === 'retirement' ? <IoIosArrowUp size={15} /> : <IoIosArrowDown size={15} />}
            </div>
          )}
        </div>
        <ul
          id="retirement-dropdown"
          className={`pl-6 mt-1 space-y-1 overflow-hidden transition-max-height duration-500 ease-in-out ${
            openDropdown === 'retirement' ? 'max-h-screen' : 'max-h-0'
          }`}
        >
          <li><Link to="/retirement-overview">Retirement Plan Overview</Link></li>
          <li><Link to="/beneficiary-info">Beneficiary Information</Link></li>
        </ul>
      </div>

      {/* Compensation Planning Tools */}
      <div className="mb-2">
        <div
          className="flex gap-2 items-center cursor-pointer text-sm hover:text-blue-500 transition duration-200"
          onClick={() => toggleDropdown('compensation-planning')}
          aria-expanded={openDropdown === 'compensation-planning'}
          aria-controls="compensation-planning-dropdown"
          aria-label="Compensation Planning Tools"
        >
          <IoIosStats className="w-5 h-5" />
          {!isCollapsed && <span>Compensation Planning Tools</span>}
          {!isCollapsed && (
            <div className="ml-auto">
              {openDropdown === 'compensation-planning' ? <IoIosArrowUp size={15} /> : <IoIosArrowDown size={15} />}
            </div>
          )}
        </div>
        <ul
          id="compensation-planning-dropdown"
          className={`pl-6 mt-1 space-y-1 overflow-hidden transition-max-height duration-500 ease-in-out ${
            openDropdown === 'compensation-planning' ? 'max-h-screen' : 'max-h-0'
          }`}
        >
          <li><Link to="/salary-projections">Salary Projections</Link></li>
          <li><Link to="/equity-adjustment">Equity Adjustment</Link></li>
        </ul>
      </div>

      {/* Personal Information Management */}
      <div className="mb-2">
        <div
          className="flex gap-2 items-center cursor-pointer text-sm hover:text-blue-500 transition duration-200"
          onClick={() => toggleDropdown('personal-info')}
          aria-expanded={openDropdown === 'personal-info'}
          aria-controls="personal-info-dropdown"
          aria-label="Personal Information Management"
        >
          <FaRegUser className="w-5 h-5" />
          {!isCollapsed && <span>Personal Information Management</span>}
          {!isCollapsed && (
            <div className="ml-auto">
              {openDropdown === 'personal-info' ? <IoIosArrowUp size={15} /> : <IoIosArrowDown size={15} />}
            </div>
          )}
        </div>
        <ul
          id="personal-info-dropdown"
          className={`pl-6 mt-1 space-y-1 overflow-hidden transition-max-height duration-500 ease-in-out ${
            openDropdown === 'personal-info' ? 'max-h-screen' : 'max-h-0'
          }`}
        >
          <li><Link to="/update-info">Update Personal Information</Link></li>
        </ul>
      </div>

      {/* Support and Resources */}
      <div className="mb-2">
        <div
          className="flex gap-2 items-center cursor-pointer text-sm hover:text-blue-500 transition duration-200"
          onClick={() => toggleDropdown('support')}
          aria-expanded={openDropdown === 'support'}
          aria-controls="support-dropdown"
          aria-label="Support and Resources"
        >
          <AiOutlineFileSearch className="w-5 h-5" />
          {!isCollapsed && <span>Support and Resources</span>}
          {!isCollapsed && (
            <div className="ml-auto">
              {openDropdown === 'support' ? <IoIosArrowUp size={15} /> : <IoIosArrowDown size={15} />}
            </div>
          )}
        </div>
        <ul
          id="support-dropdown"
          className={`pl-6 mt-1 space-y-1 overflow-hidden transition-max-height duration-500 ease-in-out ${
            openDropdown === 'support' ? 'max-h-screen' : 'max-h-0'
          }`}
        >
          <li><Link to="/faqs">FAQs</Link></li>
          <li><Link to="/contact-hr">Contact HR</Link></li>
        </ul>
      </div>

      {/* Notifications and Alerts */}
      <div className="mb-2">
        <div
          className="flex gap-2 items-center cursor-pointer text-sm hover:text-blue-500 transition duration-200"
          onClick={() => toggleDropdown('notifications')}
          aria-expanded={openDropdown === 'notifications'}
          aria-controls="notifications-dropdown"
          aria-label="Notifications and Alerts"
        >
          <IoIosStats className="w-5 h-5" />
          {!isCollapsed && <span>Notifications and Alerts</span>}
          {!isCollapsed && (
            <div className="ml-auto">
              {openDropdown === 'notifications' ? <IoIosArrowUp size={15} /> : <IoIosArrowDown size={15} />}
            </div>
          )}
        </div>
        <ul
          id="notifications-dropdown"
          className={`pl-6 mt-1 space-y-1 overflow-hidden transition-max-height duration-500 ease-in-out ${
            openDropdown === 'notifications' ? 'max-h-screen' : 'max-h-0'
          }`}
        >
          <li><Link to="/important-updates">Important Updates</Link></li>
        </ul>
      </div>
    </div>
  );
};

export default EmployeeSidebar;
