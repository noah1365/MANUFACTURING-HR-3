import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { getNotifications, markAsRead } from "../controller/notificationController.js";

const notificationRoute = express.Router();

notificationRoute.get('/csrf-token', (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

notificationRoute.get("/get-notifications",verifyToken,getNotifications);
notificationRoute.put("/mark-as-read/:notificationId",verifyToken,markAsRead);

export default notificationRoute