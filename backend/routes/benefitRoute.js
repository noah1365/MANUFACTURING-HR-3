import express from "express";

import {  createBenefit, deleteBenefit, getAllRequestBenefits, getBenefit, getMyRequestBenefits, requestBenefit, updateBenefit, updateRequestBenefitStatus, upload } from "../controller/benefitController.js";

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


benefitRoute.post("/request-benefit", verifyToken, upload.fields([{ name: "frontId" }, { name: "backId" }]), requestBenefit);
benefitRoute.get("/my-request-benefits",verifyToken,getMyRequestBenefits);
benefitRoute.get("/get-all-request-benefits",verifyToken,getAllRequestBenefits);
benefitRoute.put("/update-request-benefit-status/:id", verifyToken, updateRequestBenefitStatus);


export default benefitRoute;

    