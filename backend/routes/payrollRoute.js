import express from "express";
import { getMyRequestedSalary, getRequestedSalary, requestSalary, reviewRequest, toggleRequestAvailability } from "../controller/payrollDistributionController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { reviewRequestValidation, validate } from "../middleware/validationMiddleware.js";
import { checkRole } from "../middleware/roleMiddleware.js";

const payrollRoute = express.Router();

payrollRoute.get('/csrf-token', (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

payrollRoute.post("/request-salary",verifyToken,requestSalary);
payrollRoute.get("/get-requested-salary",verifyToken,getRequestedSalary);
payrollRoute.get("/get-my-requested-salary",verifyToken,getMyRequestedSalary);

payrollRoute.put("/review-request/:requestId",verifyToken,checkRole("Manager"),reviewRequestValidation,validate,reviewRequest);
payrollRoute.put("/toggle-request-availability",verifyToken,checkRole("Manager"),toggleRequestAvailability);


export default payrollRoute