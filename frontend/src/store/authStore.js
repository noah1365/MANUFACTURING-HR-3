import {create} from 'zustand'
import axios from 'axios'

 const API_URL = process.env.NODE_ENV === "production" 
? "https://backend-hr3.jjm-manufacturing.com/api/auth" 
: "http://localhost:7687/api/auth";

//  const API_URL = "https://backend-hr3.jjm-manufacturing.com/api/auth";

axios.defaults.withCredentials = true;

export const useAuthStore = create((set)=>({
    user:null,
    isAuthenticated:false,
    isCheckingAuth:true,
    message:null,
    error:null,

    login: async (email,password) => {
        try {
            const response = await axios.post(`${API_URL}/login`,{email,password});
            set({
                isAuthenticated:true,
                user:response.data.user,
                message:response.data.message,
                error:null,
            });
            return true;
        } catch (error) {
            set({
                isAuthenticated:false,
                user:null,
                error:error.response?.data?.message || "Error in logging in!"
            });
            return false;
        }
    },

    checkAuth: async () => {
        set({isCheckingAuth:true,error:null});
        try {
        const response = await axios.get(`${API_URL}/check-auth`);
        set({
            user:response.data.user,
            isAuthenticated:true,
            isCheckingAuth:false,
        });
        } catch (error) {
        set({
            user:null,
            isAuthenticated:false,
            isCheckingAuth:false,
            error: error.response?.data?.message || "Error checking authentication",
        }) 
        }
    },

    logout: async () => {
        try {
          await axios.post(`${API_URL}/logout`);
          set({
            user: null,
            isAuthenticated: false,
            error: null,
          });
        } catch (error) {
          set({
            error: error.response?.data?.message || "Error logging out",
          });
        }
      },
      fetchUsers: async () => {
        try {
          const response = await axios.get(`${API_URL}/users`);  
          set({
            users: response.data.users,
            error: null,
          });
        } catch (error) {
          set({
            error: error.response?.data?.message || "Error fetching users",
            users: [],
          });
        }
      },


}));
