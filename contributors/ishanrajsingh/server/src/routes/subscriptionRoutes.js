const express = require('express');
const router = express.Router();
const { 
  createSubscription, 
  getSubscriptions,
  getSubscriptionById
} = require('../controllers/subscriptionController');
const { protect } = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(protect);

// Route definitions
router.route('/')
  .post(createSubscription)      // POST /api/subscriptions
  .get(getSubscriptions);        // GET /api/subscriptions

router.route('/:id')
  .get(getSubscriptionById);     // GET /api/subscriptions/:id

module.exports = router;
