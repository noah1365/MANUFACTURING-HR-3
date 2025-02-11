import express from "express";


import { verifyToken } from "../middleware/verifyToken.js";
import { checkRole } from "../middleware/roleMiddleware.js";

import { addMySalesCommission, assignSalesCommission, createIncentive, createRecognitionPrograms, createSalesCommission, deleteIncentive, getAllRecognitionPrograms, getAllRequestIncentives, getAllSalesCommission, getIncentive, getMyRequestIncentives, requestIncentive, updateIncentive, updateRequestIncentiveStatus, updateSalesCommission } from "../controller/incentiveController.js";
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
incentiveRoute.put("/add-my-sales-commission", verifyToken, addMySalesCommission);

incentiveRoute.post("/create-recognition-program",verifyToken,createRecognitionPrograms);
incentiveRoute.get("/get-all-recognition-programs",verifyToken,getAllRecognitionPrograms);
export default incentiveRoute;

    