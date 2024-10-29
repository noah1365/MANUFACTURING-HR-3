import express from "express";
import { compensationPlanningValidation } from "../middleware/validationMiddleware.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { createCompensationPlan, deleteCompensationPlan, getCompensationPlan, getCompensationPosition, updateCompensationPlan } from "../controller/compensationPlanningController.js";

const compensationRoute = express.Router();

compensationRoute.get('/csrf-token', (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

compensationRoute.post("/create-compensation-plan",verifyToken,compensationPlanningValidation,createCompensationPlan);

compensationRoute.get("/get-compensation-plans",verifyToken,getCompensationPlan);
compensationRoute.get("/get-compensation-position",verifyToken,getCompensationPosition);

compensationRoute.put("/update-compensation-plan/:id",verifyToken,compensationPlanningValidation,updateCompensationPlan);

compensationRoute.delete("/delete-compensation-plan/:id",verifyToken,deleteCompensationPlan);

export default compensationRoute