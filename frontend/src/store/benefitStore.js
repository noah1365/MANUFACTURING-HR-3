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
            set({
                benefit: response.data.benefits || [],
                error: null,
            });
        } catch (error) {
            set({
                error: error.response?.data?.message || "Error fetching benefits",
                benefit: [],
            });
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
    
    
}));
