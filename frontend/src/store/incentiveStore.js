import { create } from 'zustand';
import axios from 'axios';

const API_URL = process.env.NODE_ENV === "production"
? `https://backend-hr3.jjm-manufacturing.com/api/incentive`
: "http://localhost:7687/api/incentive";


//  const API_URL = "https://backend-hr3.jjm-manufacturing.com/api/incentive";

axios.defaults.withCredentials = true;

export const useIncentiveStore = create((set) => ({
    incentive: null,
    error: null,
    incentives:[],
    allSalesCommission:[],

    createIncentive: async (incentive) => {
        try {
            const csrfResponse = await axios.get(`${API_URL}/csrf-token`);
            const csrfToken = csrfResponse.data.csrfToken;

            const response = await axios.post(`${API_URL}/create-incentives`, incentive,
                { headers:{ 'X-CSRF-Token': csrfToken}});
            set({
                incentive: response.data.incentive || null,
                error: null,
            });
            return true;
        } catch (error) {
            set({
                error: error.response?.data.message || "Error in creating incentive"
            });
            return false;
        }
    },

    fetchIncentive: async () => {
        try {
            const response = await axios.get(`${API_URL}/get-incentives`);
            set({
                incentive: response.data.incentives || [],
                error: null,
            });
        } catch (error) {
            set({
                error: error.response?.data?.message || "Error fetching incentives",
                benefit: [],
            });
        }
    },

    deleteIncentive: async (id) => {
        try {
            const csrfResponse = await axios.get(`${API_URL}/csrf-token`);
            const csrfToken = csrfResponse.data.csrfToken;

            console.log("Deleting benefit with ID:", id);
            const response = await axios.delete(`${API_URL}/delete-incentives/${id}`,
                { headers:{ 'X-CSRF-Token': csrfToken}});
            set((state) => ({
                incentive: state.incentive.filter((i) => i._id !== id),
                error: null,
            }));
            return response.data;
        } catch (error) {
            console.error("Error deleting benefit:", error); 
            set({
                error: error.response?.data.message || "Error deleting incentive",
            });
            return false;
        }
    },

    updateIncentive: async (id, incentive) => {
        try {
            const csrfResponse = await axios.get(`${API_URL}/csrf-token`);
            const csrfToken = csrfResponse.data.csrfToken;

            const response = await axios.put(`${API_URL}/update-incentives/${id}`, incentive,
                { headers:{ 'X-CSRF-Token': csrfToken}});
            set((state) => ({
                incentive: state.incentive.map((i) => (i._id === id ? response.data.updatedIncentive : i)),
                error: null,
            }));
            return true;
        } catch (error) {
            console.log(error);
            set({
                error: error.response?.data.message || "Error updating incentive",
            });
            return false;
        }
    },
    
    requestIncentive: async (newRequest) => {
        try {
            const csrfResponse = await axios.get(`${API_URL}/csrf-token`);
            const csrfToken = csrfResponse.data.csrfToken;

            const response = await axios.post(`${API_URL}/request-incentive`, newRequest,
                { headers:{ 'X-CSRF-Token': csrfToken}});
            set({
                incentive: response.data.incentive || null,
                error: null,
            });
            return true;
        } catch (error) {
            set({
                error: error.response?.data.message || "Error in creating incentive"
            });
            return false;
        }
    },

    fetchMyRequestIncentives: async () => {
        try {
            const response = await axios.get(`${API_URL}/my-request-incentives`);
            set({
                incentive: response.data.myRequestIncentives || [],
                error: null,
            });
        } catch (error) {
            set({
                error: error.response?.data?.message || "Error fetching incentives",
                benefit: [],
            });
        }
    },

    fetchAllRequestIncentives: async () => {
        try {
          const response = await axios.get(`${API_URL}/get-all-request-incentives`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }, 
          });
          set({
            incentives: response.data.requestIncentive || [], 
            error: null,
          });
        } catch (error) {
          set({
            error: error.response?.data?.message || "Error fetching incentives",
            incentives: [],
          });
        }
      },

      updateRequestIncentiveStatus: async (id, status) => {
        try {
          console.log(`Updating incentive status: ID = ${id}, New Status = ${status}`);
      
          const csrfResponse = await axios.get(`${API_URL}/csrf-token`);
          const csrfToken = csrfResponse.data.csrfToken;
          console.log("CSRF Token received:", csrfToken);
      
          const response = await axios.put(`${API_URL}/update-request-incentive-status/${id}`, 
            { status }, 
            { headers: { 'X-CSRF-Token': csrfToken } }
          );
      
          console.log("Response from server:", response.data);
      
          set((state) => ({
            incentives: state.incentives.map((req) =>
              req._id === id ? { ...req, status: response.data.updatedRequest.status } : req
            ),
            error: null,
          }));
      
          return true;
        } catch (error) {
          console.error("Error updating request status:", error.response?.data || error.message);
      
          set({
            error: error.response?.data?.message || "Error updating request status",
          });
      
          return false;
        }
      },
    
      fetchAllSalesCommission: async () => {
        try {
          console.log("Fetching Sales Commission...");
          const response = await axios.get(`${API_URL}/get-all-sales-commission`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }, 
          });
          console.log("API Response:", response.data);
          set({
            allSalesCommission: response.data || [],
          });
          
        } catch (error) {
          console.error("Error fetching Sales Commission:", error.response?.data?.message || error);
          set({
            error: error.response?.data?.message || "Error fetching incentives",
            allSalesCommission: [], 
          });
        }
      }
      
}));
