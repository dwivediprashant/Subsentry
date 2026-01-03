const Subscription = require('../models/Subscription');

/**
 * @desc    Create new subscription
 * @route   POST /api/subscriptions
 * @access  Private
 */
exports.createSubscription = async (req, res) => {
  try {
    const { 
      name, 
      amount, 
      currency,
      billingCycle, 
      nextBillingDate, 
      category,
      description,
      website,
      reminderEnabled,
      reminderDays
    } = req.body;
    
    // Validate required fields
    if (!name || !amount || !billingCycle || !nextBillingDate) {
      return res.status(400).json({ 
        success: false,
        message: 'Missing required fields: name, amount, billingCycle, nextBillingDate' 
      });
    }

    // Validate amount is positive
    if (amount < 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be a positive number'
      });
    }

    // Validate billing cycle
    const validCycles = ['daily', 'weekly', 'monthly', 'quarterly', 'yearly'];
    if (!validCycles.includes(billingCycle.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `Invalid billing cycle. Must be one of: ${validCycles.join(', ')}`
      });
    }

    // Validate next billing date is in future
    const nextDate = new Date(nextBillingDate);
    if (nextDate < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Next billing date must be in the future'
      });
    }

    // Create subscription with authenticated user ID
    const subscription = await Subscription.create({
      userId: req.user._id, // From auth middleware
      name,
      amount,
      currency: currency || 'INR',
      billingCycle: billingCycle.toLowerCase(),
      nextBillingDate: nextDate,
      category: category || 'Other',
      description,
      website,
      reminderEnabled: reminderEnabled !== undefined ? reminderEnabled : true,
      reminderDays: reminderDays || 3
    });

    res.status(201).json({
      success: true,
      message: 'Subscription created successfully',
      data: subscription
    });
  } catch (error) {
    console.error('Create subscription error:', error);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while creating subscription',
      error: error.message
    });
  }
};

/**
 * @desc    Fetch all subscriptions for authenticated user
 * @route   GET /api/subscriptions
 * @access  Private
 */
exports.getSubscriptions = async (req, res) => {
  try {
    // Extract query parameters for filtering
    const { 
      status, 
      category, 
      billingCycle,
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;

    // Build query - only fetch subscriptions belonging to authenticated user
    const query = { userId: req.user._id };

    // Add optional filters
    if (status) {
      query.status = status;
    }
    if (category) {
      query.category = category;
    }
    if (billingCycle) {
      query.billingCycle = billingCycle.toLowerCase();
    }

    // Determine sort order
    const sortOrder = order === 'asc' ? 1 : -1;
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder;

    // Fetch subscriptions
    const subscriptions = await Subscription.find(query)
      .sort(sortOptions)
      .lean(); // Use lean() for better performance

    // Calculate totals
    const totalMonthly = subscriptions
      .filter(sub => sub.billingCycle === 'monthly' && sub.status === 'active')
      .reduce((sum, sub) => sum + sub.amount, 0);

    const totalYearly = subscriptions
      .filter(sub => sub.billingCycle === 'yearly' && sub.status === 'active')
      .reduce((sum, sub) => sum + sub.amount, 0);

    res.status(200).json({
      success: true,
      count: subscriptions.length,
      summary: {
        totalMonthly,
        totalYearly,
        activeCount: subscriptions.filter(s => s.status === 'active').length
      },
      data: subscriptions
    });
  } catch (error) {
    console.error('Get subscriptions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching subscriptions',
      error: error.message
    });
  }
};

/**
 * @desc    Get single subscription by ID
 * @route   GET /api/subscriptions/:id
 * @access  Private
 */
exports.getSubscriptionById = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      _id: req.params.id,
      userId: req.user._id // Ensure user owns this subscription
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }

    res.status(200).json({
      success: true,
      data: subscription
    });
  } catch (error) {
    console.error('Get subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
