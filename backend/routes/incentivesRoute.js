import express from "express";


import { verifyToken } from "../middleware/verifyToken.js";
import { checkRole } from "../middleware/roleMiddleware.js";

import { addMySalesCommission, assignSalesCommission, createIncentive, createRecognitionPrograms, createSalesCommission, deleteIncentive, getAllAddedSalesCommissions, getAllAssignedSalesCommissions, getAllRecognitionPrograms, getAllRequestIncentives, getAllSalesCommission, getIncentive, getMyAddedSalesCommissions, getMyAssignedSalesCommissions, getMyRequestIncentives, getMySalesCommissions, requestIncentive, updateConfirmationStatus, updateIncentive, updateRequestIncentiveStatus, updateSalesCommission } from "../controller/incentiveController.js";
import upload from "../config/multerConfig.js";

const incentiveRoute = express.Router();

incentiveRoute.get('/csrf-token', (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

incentiveRoute.post("/create-incentives",verifyToken,checkRole('Manager'),createIncentive);
incentiveRoute.get("/get-incentives",verifyToken,getIncentive);
incentiveRoute.put("/update-incentives/:id",verifyToken,checkRole('Manager'),updateIncentive);
incentiveRoute.delete("/delete-incentives/:id",verifyToken,checkRole('Manager'),deleteIncentive);


/* EMPLOYEE */

incentiveRoute.post("/request-incentive",verifyToken,requestIncentive);
incentiveRoute.get("/my-request-incentives",verifyToken,getMyRequestIncentives);
incentiveRoute.get("/get-all-request-incentives",verifyToken,getAllRequestIncentives);
incentiveRoute.put("/update-request-incentive-status/:id", verifyToken, updateRequestIncentiveStatus);


incentiveRoute.post("/create-sales-commission",verifyToken,createSalesCommission);
incentiveRoute.get("/get-all-sales-commission",verifyToken,getAllSalesCommission);
incentiveRoute.put("/update-sales-commission/:id",verifyToken,updateSalesCommission);
incentiveRoute.post("/assign-sales-commission",verifyToken,assignSalesCommission);
incentiveRoute.post("/add-my-sales-commission", verifyToken, upload.single("salesProof"), addMySalesCommission);
incentiveRoute.put("/update-confirmation-status", verifyToken, updateConfirmationStatus);
incentiveRoute.get("/get-all-assigned-sales-commission", verifyToken,getAllAssignedSalesCommissions );
incentiveRoute.get("/get-all-added-sales-commission", verifyToken,getAllAddedSalesCommissions);
incentiveRoute.get("/get-my-added-sales-commission", verifyToken,getMyAddedSalesCommissions);
incentiveRoute.get("/get-my-assigned-sales-commission", verifyToken,getMyAssignedSalesCommissions );
incentiveRoute.get("/my-sales-commission", verifyToken, getMySalesCommissions);

incentiveRoute.post("/create-recognition-program",verifyToken,createRecognitionPrograms);
incentiveRoute.get("/get-all-recognition-programs",verifyToken,getAllRecognitionPrograms);
export default incentiveRoute;

    