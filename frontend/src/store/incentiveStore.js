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
    newCommission:null,
    allRecognitionPrograms:[],
    newRecognition:[],


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
      },
      createSalesCommission: async (newCommission) => {
        try {
          console.log("Fetching CSRF token..."); 
          const csrfResponse = await axios.get(`${API_URL}/csrf-token`);
          const csrfToken = csrfResponse.data.csrfToken;
          
          console.log("CSRF Token Received:", csrfToken); 
      
          const response = await axios.post(`${API_URL}/create-sales-commission`, newCommission, {
            headers: { "X-CSRF-Token": csrfToken },
          });
      
          console.log("API Response:", response.data); 
      
          set((state) => ({
            newCommission: response.data.commission || null,
            allSalesCommission: [...state.allSalesCommission, response.data.commission],
            error: null,
          }));
      
          return true;
        } catch (error) {
          console.error("Error Creating Commission:", error.response?.data || error.message);
          
          set({
            error: error.response?.data.message || "Error in creating new Commission",
          });
      
          return false;
        }
      },

      updateSalesCommission: async (id,updatedCommission) => {
        try {
          console.log(`Updating incentive status: ID = ${id}, New Status = ${updatedCommission}`);
      
          const csrfResponse = await axios.get(`${API_URL}/csrf-token`);
          const csrfToken = csrfResponse.data.csrfToken;
          console.log("CSRF Token received:", csrfToken);
      
          const response = await axios.put(`${API_URL}/update-sales-commission/${id}`, 
            updatedCommission , 
            { headers: { 'X-CSRF-Token': csrfToken } }
          );
      
          console.log("Response from server:", response.data);
      
          set((state) => ({
            incentives: state.incentives.map((req) =>
              req._id === id ? { ...req, updatedCommission: response.data.updatedRequest.updatedCommission } : req
            ),
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
      fetchAllRecognitionPrograms: async () => {
        try {
          const response = await axios.get(`${API_URL}/get-all-recognition-programs`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }, 
          });
          set({
            allRecognitionPrograms: response.data || [], 
            error: null,
          });
        } catch (error) {
          set({
            error: error.response?.data?.message || "Error fetching incentives",
            allRecognitionPrograms: [],
          });
        } 
      },
      
      newRecognition:[],

      createRecognitionPrograms: async (newRecognition) => {
        try {
          console.log("Fetching CSRF token...");
          const csrfResponse = await axios.get(`${API_URL}/csrf-token`);
          const csrfToken = csrfResponse.data.csrfToken;
          
          console.log("CSRF Token Received:", csrfToken);
      
          const response = await axios.post(`${API_URL}/create-recognition-program`, newRecognition, {
            headers: { "X-CSRF-Token": csrfToken },
          });
      
          console.log("API Response:", response.data);
      
          set((state) => ({
            newRecognition: response.data.recognition || null,
            allRecognitionPrograms: [...state.allRecognitionPrograms, response.data.recognition],
            error: null,
          }));
      
          return true;
        } catch (error) {
          console.error("Error Recogniton programs:", error.response?.data || error.message);
          
          set({
            error: error.response?.data.message || "Error in creating new Recognition",
          });
      
          return false;
        }
      },

      assignedSalesCommission: async (newAssignment) => {
        try {
            console.log("Fetching CSRF token...");
            const csrfResponse = await axios.get(`${API_URL}/csrf-token`);
            const csrfToken = csrfResponse.data.csrfToken;
    
            console.log("CSRF Token Received:", csrfToken);
    
            const response = await axios.post(`${API_URL}/assign-sales-commission`, newAssignment, {
                headers: { "X-CSRF-Token": csrfToken },
            });
    
            console.log("API Response:", response.data);
    
            set((state) => ({
                allSalesCommission: [...state.allSalesCommission, response.data.assignment],
                error: null,
            }));
    
            return response.data;
        } catch (error) {
            console.error("Error assigning commission:", error.response?.data || error.message);
    
            set({
                error: error.response?.data.message || "Error in assigning new commission",
            });
    
            throw error;
        }
    },

    addMySalesCommission: async (myCommission) => {
      try {
          console.log("Fetching CSRF token...");
          const csrfResponse = await axios.get(`${API_URL}/csrf-token`);
          const csrfToken = csrfResponse.data.csrfToken;
  
          console.log("CSRF Token Received:", csrfToken);
  
          const response = await axios.post(`${API_URL}/add-my-sales-commission`, myCommission, {
              headers: { "X-CSRF-Token": csrfToken },
          });
  
          console.log("API Response:", response.data);
  
          set((state) => ({
              allSalesCommission: [...state.allSalesCommission, response.data.commission],
              error: null,
          }));
  
          return response.data;
      } catch (error) {
          console.error("Error assigning commission:", error.response?.data || error.message);
  
          set({
              error: error.response?.data.message || "Error in assigning new commission",
          });
  
          throw error;
      }
  },

  myCommissions:[],
  fetchMySalesCommission: async () => {
    try {
      console.log("Fetching Sales Commission...");
      const response = await axios.get(`${API_URL}/my-sales-commission`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }, 
      });
      console.log("API Response:", response.data);
      set({
        myCommissions: response.data.myCommissions || [],
      });
      
    } catch (error) {
      console.error("Error fetching Sales Commission:", error.response?.data?.message || error);
      set({
        error: error.response?.data?.message || "Error fetching incentives",
        myCommissions: [], 
      });
    }
  },
  assignedCommissions: [],
  fetchAllAssignedSalesCommissions: async () => {
    try {
      console.log("Fetching Sales Commissions...");
      const response = await axios.get(`${API_URL}/get-all-assigned-sales-commission`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
  
      console.log("Sales Commissions Data:", response.data);
  
      set({ assignedCommissions: response.data.assignedCommissions || [] });
    } catch (error) {
      console.error("Error fetching sales commissions:", error.response?.data?.message || error);
      set({ error: error.response?.data?.message || "Error fetching commissions", assignedCommissions: [] });
    }
  },

myAssignedCommissions: [],
fetchMyAssignedSalesCommissions: async () => {
  try {
    console.log("Fetching Sales Commissions...");
    const response = await axios.get(`${API_URL}/get-my-assigned-sales-commission`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    console.log("Sales Commissions Data:", response.data);

    // Store both assigned and not assigned commissions
    set({
      assignedCommissions: response.data.assignedCommissions || [],
      notAssignedCommissions: response.data.notAssignedCommissions || [],
    });
  } catch (error) {
    console.error("Error fetching sales commissions:", error.response?.data?.message || error);
    set({
      error: error.response?.data?.message || "Error fetching commissions",
      assignedCommissions: [],
      notAssignedCommissions: [],
    });
  }
},

  
  addedSales: [],
  fetchAllAddedSalesCommissions: async () => {
    try {
      console.log("Fetching Sales Commissions...");
      const response = await axios.get(`${API_URL}/get-all-added-sales-commission`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      console.log("Sales Commissions Data:", response.data);
      set({ addedSales: response.data.addedSales || [] });
    } catch (error) {
      console.error("Error fetching sales commissions:", error.response?.data?.message || error);
      set({ error: error.response?.data?.message || "Error fetching commissions", addedSales: [] });
    }
  },
SalesHistory:null,
updateConfirmationStatus: async (salesHistoryId, confirmationStatus) => {
  try {
      console.log(`Updating sales status: ID = ${salesHistoryId}, New Status = ${confirmationStatus}`);

      const csrfResponse = await axios.get(`${API_URL}/csrf-token`);
      const csrfToken = csrfResponse.data.csrfToken;
      console.log("CSRF Token received:", csrfToken);

      const response = await axios.put(
          `${API_URL}/update-confirmation-status`, 
          { salesHistoryId, confirmationStatus }, 
          { headers: { 'X-CSRF-Token': csrfToken } }
      );

      console.log("Response from server:", response.data);

      set((state) => ({
          addedSales: state.addedSales.map((sale) =>
              sale._id === salesHistoryId 
                  ? { ...sale, confirmationStatus: response.data.updatedCommission.confirmationStatus } 
                  : sale
          ),
          error: null,
      }));

      return true;
  } catch (error) {
      console.error("Error updating sales status:", error.response?.data || error.message);
      set({ error: error.response?.data?.message || "Error updating sales status" });
      return false;
  }
},

  
}));
