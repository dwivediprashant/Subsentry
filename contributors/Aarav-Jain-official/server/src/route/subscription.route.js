import { Router } from "express";
import {
  createSubscription,
  getSubscriptions,
  getSubscriptionById,
} from "../controller/subscription.controller.js";

const router = Router();

// POST /api/subscriptions - create new subscription
router.post("/", createSubscription);

// GET /api/subscriptions - get all subscriptions (optional filters via query)
router.get("/", getSubscriptions);

// GET /api/subscriptions/:id - get single subscription by ID
router.get("/:id", getSubscriptionById);

export default router;
