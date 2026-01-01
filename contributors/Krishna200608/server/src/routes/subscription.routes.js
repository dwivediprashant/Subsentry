import express from "express";
import {
  createSubscription,
  getUserSubscriptions,
} from "../controllers/subscription.controller.js";
import requireAuth from "../middleware/requireAuth.js";

const router = express.Router();

router.post("/", requireAuth, createSubscription);
router.get("/", requireAuth, getUserSubscriptions);

export default router;
