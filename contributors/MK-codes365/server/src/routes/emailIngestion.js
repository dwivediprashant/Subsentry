const express = require("express");
const router = express.Router();

// Mock email scanning endpoint
router.post("/scan", async (req, res) => {
  try {
    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simulate random success/failure for testing
    const shouldFail = Math.random() < 0.2;

    if (shouldFail) {
      return res.status(400).json({
        success: false,
        message: "Gmail connection not found. Please connect your account first.",
      });
    }

    // Mock found subscriptions
    const mockSubscriptions = [
      "Netflix",
      "Spotify Premium",
      "Adobe Creative Cloud",
    ];

    res.json({
      success: true,
      found: mockSubscriptions.length,
      subscriptions: mockSubscriptions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error during email scan",
    });
  }
});

module.exports = router;
