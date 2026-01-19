import express from "express";
import { parseSubscriptionEmails } from "../controllers/gmailParse.controller.js";

const router = express.Router();

// GET /api/gmail/parse-subscriptions
router.get("/gmail/parse-subscriptions", parseSubscriptionEmails);

export default router;
