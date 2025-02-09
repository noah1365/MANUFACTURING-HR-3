import { create } from 'zustand';
import axios from 'axios';

const API_URL = process.env.NODE_ENV === "production"
? `https://backend-hr3.jjm-manufacturing.com/api/benefit`
: "http://localhost:7687/api/benefit";


//  const API_URL = "https://backend-hr3.jjm-manufacturing.com/api/benefit";

axios.defaults.withCredentials = true;

export const useBenefitStore = create((set) => ({       
    benefit: null,
    error: null,
    benefits:[],
    myRequestBenefits: [], 
    deductions: [], 
    history: [], 

    
    createBenefit: async (benefit) => {
        try {
            const csrfResponse = await axios.get(`${API_URL}/csrf-token`);
            const csrfToken = csrfResponse.data.csrfToken;

            const response = await axios.post(`${API_URL}/create-benefits`, benefit,
                { headers:{ 'X-CSRF-Token': csrfToken}});
            set({
                benefit: response.data.benefit || null,
                error: null,
            });
            return true;
        } catch (error) {
            set({
                error: error.response?.data.message || "Error in creating Benefit"
            });
            return false;
        }
    },

fetchBenefit: async () => {
    try {
        const response = await axios.get(`${API_URL}/get-benefits`);
        set({ benefit: response.data.benefits || [], error: null });
    } catch (error) {
        console.error("Error fetching benefits:", error);
        set({ error: error.response?.data?.message || "Error fetching benefits", benefits: [] });
    }
},

    

    deleteBenefit: async (id) => {
        try {
            const csrfResponse = await axios.get(`${API_URL}/csrf-token`);
            const csrfToken = csrfResponse.data.csrfToken;

            console.log("Deleting benefit with ID:", id);
            const response = await axios.delete(`${API_URL}/delete-benefits/${id}`,
                { headers:{ 'X-CSRF-Token': csrfToken}});
            set((state) => ({
                benefit: state.benefit.filter((b) => b._id !== id),
                error: null,
            }));
            return response.data;
        } catch (error) {
            console.error("Error deleting benefit:", error); 
            set({
                error: error.response?.data.message || "Error deleting Benefit",
            });
            return false;
        }
    },

    updateBenefit: async (id, benefit) => {
        try {
            const csrfResponse = await axios.get(`${API_URL}/csrf-token`);
            const csrfToken = csrfResponse.data.csrfToken;

            const response = await axios.put(`${API_URL}/update-benefits/${id}`, benefit,
                { headers:{ 'X-CSRF-Token': csrfToken}});
            set((state) => ({
                benefit: state.benefit.map((b) => (b._id === id ? response.data.updatedBenefit : b)),
                error: null,
            }));
            return true;
        } catch (error) {
            console.log(error);
            set({
                error: error.response?.data.message || "Error updating Benefit",
            });
            return false;
        }
    },
    
    requestBenefit: async (newRequest) => {
        try {
            const csrfResponse = await axios.get(`${API_URL}/csrf-token`);
            const csrfToken = csrfResponse.data.csrfToken;
    
            const response = await axios.post(`${API_URL}/request-benefit`, newRequest, {
                headers: {
                    'X-CSRF-Token': csrfToken,
                    'Content-Type': 'multipart/form-data'
                }
            });
    
            set({ myRequestBenefits: response.data.myRequestBenefits || null, error: null });
            return true;
        } catch (error) {
            set({ error: error.response?.data.message || "Error in requesting benefit",myRequestBenefits: [], });
            return false;
        }
    },
    

    fetchMyRequestBenefits: async () => {
        try {
            const response = await axios.get(`${API_URL}/my-request-benefits`);
            set({
                myRequestBenefits: response.data.myRequestBenefits || [],
                error: null,
            });
        } catch (error) {
            set({
                error: error.response?.data?.message || "Error fetching benefits",
                myRequestBenefits: [],
            });
        }
    },

    fetchAllRequestBenefits: async () => {
        try {
          const response = await axios.get(`${API_URL}/get-all-request-benefits`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }, 
          });
          set({
            benefits: response.data.requestBenefit || [], 
            error: null,
          });
        } catch (error) {
          set({
            error: error.response?.data?.message || "Error fetching benefits",
            benefits: [], 
          });
        }
      },

      updateRequestBenefitStatus: async (id, status) => {
        try {
          console.log(`Updating incentive status: ID = ${id}, New Status = ${status}`);
      
          const csrfResponse = await axios.get(`${API_URL}/csrf-token`);
          const csrfToken = csrfResponse.data.csrfToken;
          console.log("CSRF Token received:", csrfToken);
      
          const response = await axios.put(`${API_URL}/update-request-benefit-status/${id}`, 
            { status }, 
            { headers: { 'X-CSRF-Token': csrfToken } }
          );
      
          console.log("Response from server:", response.data);
      
          set((state) => ({
            benefits: state.benefits.map((req) =>
              req._id === id ? { ...req, status: response.data.data.status } : req
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

      fetchBenefitDeductions: async () => {
        try {
            const response = await axios.get(`${API_URL}/get-all-benefit-deduction`); 
            set({ deductions: response.data.deductions || [], error: null });
        } catch (error) {
            set({ 
                error: error.response?.data?.message || "Error fetching benefit deductions", 
                deductions: [] 
            });
        }
    },

    fetchBenefitDeductionHistory: async () => {
        try {
            const response = await axios.get(`${API_URL}/get-benefit-deduction-history`);
            set({ history: response.data.history || [], error: null });
        } catch (error) {
            set({
                error: error.response?.data?.message || "Error fetching benefit deductions history",
                history: []
            });
        }
    }
    
      
}));
