import express from "express";


import { verifyToken } from "../middleware/verifyToken.js";
import { checkRole } from "../middleware/roleMiddleware.js";

import { createIncentive, deleteIncentive, getAllRequestIncentives, getIncentive, getMyRequestIncentives, requestIncentive, updateIncentive } from "../controller/incentiveController.js";

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

export default incentiveRoute;

    