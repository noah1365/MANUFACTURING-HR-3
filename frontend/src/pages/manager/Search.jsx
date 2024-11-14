import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoMdNotificationsOutline } from "react-icons/io";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { useAuthStore } from "../../store/authStore";
import { useEmployeeStore } from "../../store/employeeStore";
import { useNotificationStore } from "../../store/notificationStore";
import io from 'socket.io-client';

// const socketURL = import.meta.env.MODE === "development" 
//     ? "http://localhost:7687" 
//     : "https://backend-hr3.jjm-manufacturing.com"; // Production URL

// const socket = io(socketURL, { withCredentials: true });

const socketURL = import.meta.env.MODE === "development" 
    ? "http://localhost:7687" 
    : window.location.origin;

const socket = io(socketURL, { withCredentials: true });

const Search = ({ onToggleSidebar }) => {
    const { logout } = useAuthStore();
    const { fetchData, user } = useEmployeeStore();
    const { notifications, fetchNotifications, markAsRead } = useNotificationStore();
    const navigate = useNavigate();

    const [showNotifications, setShowNotifications] = useState(false);
    const [viewMode, setViewMode] = useState('unread');
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredRoutes, setFilteredRoutes] = useState([]);

    const managerRoutes = [
      { path: '/dashboard', name: 'Dashboard' },
      { path: '/employee-list', name: 'Employee List' },
      { path: '/benefits-administration', name: 'Benefits Administration' },
      { path: '/benefits-requested', name: 'Benefits Requested' },
      { path: '/deductions-management', name: 'Deductions Management' },
      { path: '/incentives-management', name: 'Incentives Management' },
      { path: '/recognition-programs', name: 'Recognition Programs' },
      { path: '/sales-commissions', name: 'Sales Commissions' },
      { path: '/compensation-overview', name: 'Compensation Overview' },
      { path: '/compensation-planning', name: 'Compensation Planning' },
      { path: '/salary-structure', name: 'Salary Structure' },
      { path: '/market-analysis', name: 'Market Analysis' },
      { path: '/grievance-request', name: 'Grievance Request' },
      { path: '/payroll-management', name: 'Payroll Management' },
      { path: '/attendance', name: 'Attendance Tracking' },
      { path: '/salary-computation', name: 'Salary Computation' },
      { path: '/request-budget', name: 'Budget Request' },
      { path: '/payroll-distribution', name: 'Payroll Distribution' },
      { path: '/generate-reports', name: 'Report Generation' },
      { path: '/payroll-history', name: 'Payroll History' },
      { path: '/predictive-analytics', name: 'Predictive Analytics' },
    ];
    
    const employeeRoutes = [
      { path: '/dashboard', name: 'Dashboard' },
      { path: '/submit-feedbacks', name: 'Create Feedbacks' },
      { path: '/benefits-overview', name: 'Benefits Overview' },
      { path: '/benefits-enrollment', name: 'Benefits Enrollment' },
      { path: '/my-deductions', name: 'My Deductions' },
      { path: '/incentives-overview', name: 'Incentives Overview' },
      { path: '/my-commissions', name: 'My Commissions' },
      { path: '/my-salary-structure', name: 'My Salary Structure' },
      { path: '/incentive-request', name: 'Incentive Request' },
      { path: '/incentive-history', name: 'Incentive History' },
      { path: '/my-salary-info', name: 'My Salary Information' },
      { path: '/salary-request', name: 'Salary Request' },
      { path: '/my-pay-slip', name: 'My Pay Slip' },
      { path: '/my-overtime-bonuses', name: 'My Overtime Bonuses' },
    ];
    
    
    const getRoutesByRole = (role) => {
      if(role === 'Manager'){
        return managerRoutes;
      }else if(role === 'Employee'){
        return employeeRoutes;
      }else{
        return [];
      }
    };
  
    const routes = getRoutesByRole(user?.role);

    useEffect(() => {
        const fetchUserData = async () => {
            await fetchData();
            await fetchNotifications(user?.role);
        };
        fetchUserData();
    }, [fetchData, fetchNotifications, user]);

    useEffect(() => {
        if (searchQuery) {
            setFilteredRoutes(routes.filter(route =>
                route.name.toLowerCase().includes(searchQuery.toLowerCase())
            ));
        } else {
            setFilteredRoutes([]);
        }
    }, [searchQuery]);

    useEffect(() => {
        socket.on('connect', () => {
            console.log('Socket connected:', socket.id);
        });

        socket.on('requestSalaryCreated', (data) => {
            if(user?.role === 'Manager'){
                fetchNotifications(user?.role);
            }
        });

        return () => {
            socket.off('connect');
            socket.off('requestSalaryCreated');
        };
    }, [socket]);

    

    const handleLogout = async () => {
        const confirmed = window.confirm("Are you sure you want to logout?");
        if (confirmed) {
            try {
                await logout();
                navigate('/login');
            } catch (error) {
                console.error('Error logging out:', error);
            }
        }
    };

    const handleToggleSidebar = () => {
        setIsSidebarOpen(prev => !prev);
        onToggleSidebar();
    };

    const handleNotificationToggle = (mode) => {
        setViewMode(mode);
        setSelectedNotification(null);
    };

    const notificationsToDisplay = viewMode === 'unread' 
        ? notifications.filter(notification => !notification.read) 
        : notifications.filter(notification => notification.read);

    return (
        <div className="w-full p-5 bg-base-100 shadow-lg rounded-lg sticky top-0 z-50 border border-gray-300">
            <div className="flex items-center">
                <button onClick={handleToggleSidebar} className="btn btn-ghost">
                    {isSidebarOpen ? <HiOutlineX className="text-xl" /> : <HiOutlineMenu className="text-xl" />}
                </button>
                <div className="flex-grow flex justify-center relative">
                    <input
                        type="text"
                        placeholder="Search routes..."
                        className="input input-bordered w-full max-w-xs"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {filteredRoutes.length > 0 && (
                        <ul className="absolute z-50 bg-base-100 border border-gray-300 rounded-lg mt-12 w-80 max-h-40 overflow-y-auto">
                            {filteredRoutes.map(route => (
                                <li key={route.path}>
                                    <button
                                        onClick={() => {
                                            navigate(route.path);
                                            setSearchQuery('');
                                            setFilteredRoutes([]);
                                        }}
                                        className="block px-2 py-1 text-left hover:bg-gray-200 w-full text-sm"
                                    >
                                        {route.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="flex gap-5 items-center">
                    <div className="relative">
                        <IoMdNotificationsOutline
                            className="text-2xl cursor-pointer"
                            onClick={() => setShowNotifications(!showNotifications)}
                        />
                        {notifications.filter(n => !n.read).length > 0 && (
                            <span className="absolute top-0 right-0 transform -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                                {notifications.filter(n => !n.read).length}
                            </span>
                        )}
                        {showNotifications && (
                            <div className="absolute right-0 mt-2 w-64 max-h-80 overflow-y-auto bg-base-100 border border-gray-300 rounded-lg shadow-lg z-50 p-4">
                                <div className="flex justify-between">
                                    <h3 className="text-sm font-semibold cursor-pointer" onClick={() => handleNotificationToggle('unread')}>
                                        Unread ({notifications.filter(n => !n.read).length})
                                    </h3>
                                    <h3 className="text-sm font-semibold cursor-pointer" onClick={() => handleNotificationToggle('read')}>
                                        Read ({notifications.filter(n => n.read).length})
                                    </h3>
                                </div>
                                <div className="flex flex-col mt-2">
                                    {notificationsToDisplay.length > 0 ? (
                                        notificationsToDisplay.map(notification => (
                                            <p
                                                key={notification._id}
                                                className={`text-sm cursor-pointer p-2 rounded transition duration-200 ease-in-out 
                                                    ${viewMode === 'unread' ? 'font-semibold hover:bg-gray-100' : 'text-gray-500 hover:bg-gray-50'}`}
                                                onClick={() => {
                                                    if (viewMode === 'unread') {
                                                        markAsRead(notification._id);
                                                    }
                                                    setSelectedNotification(notification);
                                                }}
                                            >
                                                {notification.message}
                                            </p>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500">No notifications</p>
                                    )}
                                </div>
                                {selectedNotification && (
                                    <div className="mt-4 p-2 border-t border-gray-200">
                                        <h5 className="font-semibold">Notification Details</h5>
                                        <p>{selectedNotification.message}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="dropdown dropdown-end">
                        <img
                            src={user?.profilePic}
                            tabIndex={0}
                            role="button"
                            alt="profile"
                            className="w-10 h-10 rounded-full border-2 border-neutral-500"
                        />
                        <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 mt-2 shadow border border-gray-300">
                            <li>
                                <Link to={`/settings`} className="text-sm">Settings</Link>
                            </li>
                            <li>
                                <button onClick={handleLogout} className="text-sm">Logout</button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Search;
