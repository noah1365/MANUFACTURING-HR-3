import {create} from 'zustand'
import axios from 'axios'

const API_URL = process.env.NODE_ENV === "production"
? `https://backend-hr3.jjm-manufacturing.com/api/employee`
: "http://localhost:7687/api/employee";

//  const API_URL = "https://backend-hr3.jjm-manufacturing.com/api/auth";

axios.defaults.withCredentials = true;

export const useEmployeeStore = create((set)=>({
    user:null,
    isAuthenticated:false,
    isCheckingAuth:true,
    message:null,
    error:null,
    otp: null,
    email: null,
    uniqueRole:null,
    role:[],

      registerUser: async (formData) => {
        try {
          const csrfResponse = await axios.get(`${API_URL}/csrf-token`);
          const csrfToken = csrfResponse.data.csrfToken;

          const response = await axios.post(`${API_URL}/register`, formData,          
            { headers:{ 'csrf-token': csrfToken}});
          set({
            user: response.data.user || null,
            message:response.data.message,
            error: null,
          });
          return true;
        } catch (error) {
          const errorMessage = error.response?.data?.message || "Error registering user";
          set({
              error: errorMessage,
          });
          throw new Error(errorMessage);
      }
      },

      fetchData: async () => {
        try {
          const response = await axios.get(`${API_URL}/fetch`);
          set({
              user: response.data.user || null,
              message: response.data.message,
              error: null,
          });
          return true;
        } catch (error) {
          set({
            user: null,
            message: null,
            error: error.response?.data?.message || "Error in fetching user data!",
        });
        return false;
        }
      },

      changePassword: async (currentPassword,newPassword,confirmPassword) => {
        const csrfResponse = await axios.get(`${API_URL}/csrf-token`);
        const csrfToken = csrfResponse.data.csrfToken;
        try {
          const response = await axios.put(`${API_URL}/change-password`, {
            currentPassword,
            newPassword,
            confirmPassword,
          },          
          { headers:{ 'csrf-token': csrfToken}});
    
          set({
            message: response.data.message || "Password changed successfully.",
            error: null,
          });
    
          return true;
        } catch (error) {
          console.error("Change Password Error:", error);
          const errorMessage = error.response?.data?.errors
            ? error.response.data.errors.join(", ")
            : "Error changing password.";
          set({
            message: null,
            error: errorMessage,
          });
    
          return false;
        }
      },

      verifyAccount: async (token,newPassword,confirmPassword) => {
        const csrfResponse = await axios.get(`${API_URL}/csrf-token`);
        const csrfToken = csrfResponse.data.csrfToken;
        try {
          const response = await axios.put(`${API_URL}/verify-account/${token}`, {
            newPassword,
            confirmPassword,
          },          
          { headers:{ 'csrf-token': csrfToken}});
    
          set({
            message: response.data.message || "Password reset successfully.",
            error: null,
          });
    
          return { status: true, message: response.data.message }
        } catch (error) {
          console.error("Change Password Error:", error);
          const errorMessage = error.response?.data?.message || "Error changing password.";
          set({
            message: null,
            error: errorMessage,
          });
    
          return { status: false, message: errorMessage }
        }
      },

      resendVerification: async (email) => {
        const csrfResponse = await axios.get(`${API_URL}/csrf-token`);
        const csrfToken = csrfResponse.data.csrfToken;
        try {
            const response = await axios.post(`${API_URL}/resend-verification`, {email},          
              { headers:{ 'csrf-token': csrfToken}});
            set({
                message: response.data.message || "Verification email has been sent successfully!",
                error: null,
            });
            return true;
        } catch (error) {
            console.error("Resend Verification Error:", error);
            const errorMessage = error.response?.data?.message || "Error resending verification email.";
            set({
                message: null,
                error: errorMessage,
            });
            return false;
        }
    },

    forgotPassword: async (email) => {
      try {
          console.log('Sending email:', email);
          const csrfResponse = await axios.get(`${API_URL}/csrf-token`);
          const csrfToken = csrfResponse.data.csrfToken;
  
          const response = await axios.post(`${API_URL}/forgot-password`, { email }, {
              headers: { 'csrf-token': csrfToken }
          });
  
          set({
              email,
              message: response.data.message,
              error: null,
              otp: null,
          });
  
          return response.data;
      } catch (error) {
          console.error('Error in forgotPassword:', error);
          const errorMessage = error.response?.data?.message || "Error requesting password reset.";
          set({ error: errorMessage });
          throw new Error(errorMessage);
      }
  },
  
  resetPasswordOtp: async (email,otp, newPassword) => {
      try {
          const csrfResponse = await axios.get(`${API_URL}/csrf-token`);
          const csrfToken = csrfResponse.data.csrfToken;
  
          const response = await axios.post(`${API_URL}/reset-password-otp`, { email,otp, newPassword }, {
              headers: { 'csrf-token': csrfToken }
          });
  
          set({
              message:response.data.message || "Password reset successfully.",
              error:null,
          });
  
          return response.data;
      } catch (error) {
          console.error('Error in resetPasswordOtp:', error);
          const errorMessage = error.response?.data?.message || "Error resetting password.";
          set({error:errorMessage});
          throw new Error(errorMessage);
      }
  },

  changeUserRole: async (id, newRole) => {
    if(!id || !newRole){
        console.error('User ID or new role is undefined or invalid.');
        throw new Error('User ID and role must be provided.');
    }

    const csrfResponse = await axios.get(`${API_URL}/csrf-token`);
    const csrfToken = csrfResponse.data.csrfToken;

    console.log('Changing role for ID:', id, 'to:', newRole);

    try {
        const response = await axios.put(`${API_URL}/change-role/${id}`, { newRole }, {
            headers: { 'csrf-token': csrfToken }
        });

        if(!response.data || !response.data.user){
            throw new Error('Unexpected response format from the server.');
        }

        set((state) => ({
            role: state.role.map((b) => (b._id === id ? { ...b, role: response.data.user.role } : b)),
            error: null,
        }));

        console.log('Role changed successfully:', response.data.user.role);
    } catch (error) {
        console.error("Error changing user role:", error.response?.data || error.message);
        throw new Error('Unable to change user role.');
    }
}
}));
