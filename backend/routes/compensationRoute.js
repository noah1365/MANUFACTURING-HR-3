import express from "express";
import { compensationPlanningValidation } from "../middleware/validationMiddleware.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { createCompensationPlan, createStandardCompensation, deleteCompensationPlan, deleteStandardCompensation, updateStandardCompensation, getCompensationPlan, getCompensationPosition, getStandardCompensation, updateCompensationPlan, upload, getGrievanceRequests, updateGrievanceRequest } from "../controller/compensationPlanningController.js";

const compensationRoute = express.Router();

compensationRoute.get('/csrf-token', (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

compensationRoute.post("/create-compensation-plan",verifyToken,compensationPlanningValidation,createCompensationPlan);

compensationRoute.get("/get-compensation-plans",verifyToken,getCompensationPlan);
compensationRoute.get("/get-compensation-position",verifyToken,getCompensationPosition);

compensationRoute.put("/update-compensation-plan/:id",verifyToken,compensationPlanningValidation,updateCompensationPlan);

compensationRoute.delete("/delete-compensation-plan/:id",verifyToken,deleteCompensationPlan);


compensationRoute.post("/create-standard-compensation",verifyToken,createStandardCompensation);
compensationRoute.get("/get-standard-compensations",verifyToken,getStandardCompensation);
compensationRoute.put("/update-standard-compensation/:id",verifyToken,updateStandardCompensation);
compensationRoute.delete("/delete-standard-compensation/:id",verifyToken,deleteStandardCompensation);


compensationRoute.get("/get-grievances", verifyToken, getGrievanceRequests);
compensationRoute.put("/update-grievance/:id", verifyToken, upload.single("file"), updateGrievanceRequest);

export default compensationRoute