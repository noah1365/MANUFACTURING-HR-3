import express from "express";

import {  createBenefit, deleteBenefit, getBenefit, updateBenefit } from "../controller/benefitController.js";

import { verifyToken } from "../middleware/verifyToken.js";
import { checkRole } from "../middleware/roleMiddleware.js";

const benefitRoute = express.Router();

benefitRoute.get('/csrf-token', (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

benefitRoute.post("/create-benefits",verifyToken,checkRole('Manager'),createBenefit);
benefitRoute.get("/get-benefits",verifyToken,getBenefit);
benefitRoute.put("/update-benefits/:id",verifyToken,checkRole('Manager'),updateBenefit);
benefitRoute.delete("/delete-benefits/:id",verifyToken,checkRole('Manager'),deleteBenefit);


export default benefitRoute;

    