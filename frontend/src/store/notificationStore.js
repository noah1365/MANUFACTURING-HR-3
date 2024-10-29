import { create } from 'zustand';
import axios from 'axios';

const API_URL = process.env.NODE_ENV === "production"
? `https://backend-hr3.jjm-manufacturing.com/api/notification`
: "http://localhost:7687/api/notification";

axios.defaults.withCredentials = true;

export const useNotificationStore = create((set) => ({
    notifications: [],
    loading: false,
    error: null,

    fetchNotifications: async (userRole) => {
        try {
            let response;
    
            response = await axios.get(`${API_URL}/get-notifications`);
    
            const unread = response.data.filter(notification => !notification.read);
            const read = response.data.filter(notification => notification.read);
    
            set({
                notifications: response.data,
                unreadNotifications: unread,
                readNotifications: read
            });
        } catch (error) {
            console.error('Error fetching notifications:', error);
            set({ notifications: [], error: error.message || 'Failed to fetch notifications' });
        }
    },
        
    markAsRead: async (notificationId) => {
        console.log("Marking notification as read:", notificationId);
        
        set((state) => ({
            notifications: state.notifications.map(notification =>
                notification._id === notificationId ? { ...notification, read: true } : notification
            ),
        }));
    
        try {
            const csrfResponse = await axios.get(`${API_URL}/csrf-token`);
            const csrfToken = csrfResponse.data.csrfToken;
            
            const response = await axios.put(`${API_URL}/mark-as-read/${notificationId}`, {}, {
                headers:{'csrf-token':csrfToken},
            });
            
            console.log("Notification marked as read:", response.data);
        } catch (error) {
            console.error('Error marking notification as read:', error);
            console.error("Error details:", error.response ? error.response.data : error.message);
        }
    }
    
    
}));
