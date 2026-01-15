const Subscription = require('../../models/Subscription');
const { calculateMonthlySpend } = require('../services/subscriptionMetrics');

// GET all subs + monthly summary
const getSubscriptions = async (req, res) => {
  try {
    // TODO: Filter by logged in user once auth is fully wired
    const subscriptions = await Subscription.find();
    const monthlySpend = calculateMonthlySpend(subscriptions);

    res.json({
      data: subscriptions,
      meta: { monthlySpend }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch subscriptions' });
  }
};

// Add new sub
const createSubscription = async (req, res) => {
  try {
    const sub = await Subscription.create(req.body);
    res.status(201).json({ success: true, data: sub });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  getSubscriptions,
  createSubscription
};
