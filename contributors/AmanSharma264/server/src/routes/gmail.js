const express = require('express');
const router = express.Router();
const gmailAuth = require('../middlewares/gmailAuth');
const authMiddleware = require('../middlewares/auth');
const User = require('../models/User');

router.get('/auth', gmailAuth.startOAuth);
router.get('/callback', gmailAuth.oauthCallback);

router.get('/status', authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({ connected: !!user?.gmailConnected });
});

router.delete('/disconnect', authMiddleware, async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, {
    gmailConnected: false,
    gmailTokens: null,
  });

  res.json({ success: true });
});

module.exports = router;
