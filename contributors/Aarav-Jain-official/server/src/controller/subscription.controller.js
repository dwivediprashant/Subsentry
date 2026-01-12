import Subscription from "../models/Subscription.js";

// Create a new subscription
export const createSubscription = async (req, res, next) => {
  try {
    const { userId, name, amount, billingCycle, renewalDate, isTrial, source } = req.body;

    // Validate required fields
    if (!userId || !name || !amount || !billingCycle || !renewalDate) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: userId, name, amount, billingCycle, and renewalDate are required',
      });
    }

    // Validate billingCycle
    if (!["monthly", "yearly"].includes(billingCycle)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid billingCycle. Must be "monthly" or "yearly"',
      });
    }

    // Validate source
    if (source && !["manual", "email"].includes(source)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid source. Must be "manual" or "email"',
      });
    }

    // Validate amount
    if (typeof amount !== "number" || amount < 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be a positive number',
      });
    }

    // Validate renewalDate
    const parsedDate = new Date(renewalDate);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid renewalDate format',
      });
    }

    // Create subscription
    const subscription = await Subscription.create({
      userId,
      name,
      amount,
      billingCycle,
      renewalDate: parsedDate,
      isTrial: isTrial || false,
      source: source || "manual",
    });

    res.status(201).json({
      success: true,
      message: "Subscription created successfully",
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
};

// Get all subscriptions
export const getSubscriptions = async (req, res, next) => {
  try {
    const { userId, billingCycle, isTrial, source } = req.query;
    const filter = {};

    if (userId) filter.userId = userId;
    if (billingCycle) filter.billingCycle = billingCycle;
    if (isTrial !== undefined) filter.isTrial = isTrial === "true";
    if (source) filter.source = source;

    const subscriptions = await Subscription.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: subscriptions.length,
      data: subscriptions,
    });
  } catch (error) {
    next(error);
  }
};

// Get single subscription by ID
export const getSubscriptionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const subscription = await Subscription.findById(id);

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found",
      });
    }

    res.status(200).json({
      success: true,
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
};
