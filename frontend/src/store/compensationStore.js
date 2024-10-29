import {create} from 'zustand';
import axios from 'axios';

const API_URL = process.env.NODE_ENV === "production"
? `https://backend-hr3.jjm-manufacturing.com/api/compensation`
: "http://localhost:7687/api/compensation";

axios.defaults.withCredentials = true;

export const useCompensationStore = create((set) => ({
  compensationPositions: [],
  compensationPlans:[],

  fetchCompensationPositions: async () => {
    try {
      const response = await axios.get(`${API_URL}/get-compensation-position`);
      set({ compensationPositions: response.data.data });
    } catch (error) {
      console.error('Failed to fetch compensation positions:', error);
    }
  },

  getCompensationPlans: async () => {
    try {
      const response = await axios.get(`${API_URL}/get-compensation-plans`);
      console.log('Compensation Plans Response:', response.data);
      set({ compensationPlans: response.data.data });
    } catch (error) {
      console.error('Failed to fetch compensation plans:', error);
      set({ compensationPlans: [] });
    }
  },
  
  createCompensationPlan: async (planData) => {
    try {
      const csrfResponse = await axios.get(`${API_URL}/csrf-token`);
      const csrfToken = csrfResponse.data.csrfToken;
  
      const response = await axios.post(`${API_URL}/create-compensation-plan`, planData, {
        headers: { 'csrf-token': csrfToken },
      });
  
      set((state) => ({
        compensationPlans: [...state.compensationPlans, response.data.data],
      }));
      return { success: true, message: "Compensation created successfully!" };
    } catch (error) {
      if(error.response && error.response.status === 400){
        return {success:false,message:error.response.data.message};
      }else{
        console.error("Error creating compensation plan:", error);
        return {success:false,message:"Server error. Please try again later."};
      }
    }
  },


  deleteCompensationPlan: async (id) => {
    try {
      const csrfResponse = await axios.get(`${API_URL}/csrf-token`);
      const csrfToken = csrfResponse.data.csrfToken;
  
      const response = await axios.delete(`${API_URL}/delete-compensation-plan/${id}`,{
        headers: { 'csrf-token': csrfToken }});
      if (response.data.success) {
        set((state) => ({
          compensationPlans: state.compensationPlans.filter(plan => plan._id !== id),
        }));
        return { success: true, message: response.data.message };
      }
    } catch (error) {
      console.error('Error deleting compensation plan:', error);
      return { success: false, message: "Server error. Please try again later." };
    }
  },
  
  updateCompensationPlan: async (id, planData) => {
    try {
        const csrfResponse = await axios.get(`${API_URL}/csrf-token`);
        const csrfToken = csrfResponse.data.csrfToken;

        const response = await axios.put(`${API_URL}/update-compensation-plan/${id}`, planData, {
            headers: { 'csrf-token': csrfToken },
        });

        set((state) => ({
            compensationPlans: state.compensationPlans.map(plan =>
                plan._id === id ? response.data.data : plan
            ),
        }));

        return {success:true,message:"Compensation plan updated successfully!"};
    } catch (error) {
        if(error.response){
            if(error.response.status === 400){
                return {success:false,message:error.response.data.message};
            }else if(error.response.status === 404){
                return {success:false,message:"Compensation plan not found."};
            }else{
                return{success:false,message:"Server error. Please try again later."};
            }
        }else{
            console.error("Error updating compensation plan:", error);
            return {success:false,message:"Network error. Please check your connection."};
        }
    }
}


  
}));
