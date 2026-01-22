const { google } = require('googleapis');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { encrypt } = require('../utils/encryption');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

exports.startOAuth = async (req, res) => {
  try {
    const token = req.query.token;
    if (!token) return res.status(401).send('Authentication required');

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const state = jwt.sign({ userId: decoded.userId }, process.env.JWT_SECRET, {
      expiresIn: '10m',
    });

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: ['https://www.googleapis.com/auth/gmail.readonly'],
      prompt: 'consent',
      include_granted_scopes: false,
      state,
    });

    return res.redirect(authUrl);
  } catch (err) {
    console.error('Gmail OAuth start error:', err);
    return res.status(401).send('Invalid token');
  }
};

exports.oauthCallback = async (req, res) => {
  try {
    const { code, state } = req.query;
    if (!code || !state) throw new Error('Invalid OAuth callback');

    const decodedState = jwt.verify(state, process.env.JWT_SECRET);
    const userId = decodedState.userId;

    const { tokens } = await oauth2Client.getToken(code);

    const encryptedTokens = encrypt(
      JSON.stringify({
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expiry_date: tokens.expiry_date,
      })
    );

    await User.findByIdAndUpdate(userId, {
      gmailConnected: true,
      gmailTokens: encryptedTokens,
      gmailConnectedAt: new Date(),
    });

    return res.redirect(
      `${process.env.FRONTEND_URL}/dashboard/settings?gmail_status=connected`
    );
  } catch (err) {
    console.error('Gmail OAuth callback error:', err);
    return res.redirect(
      `${process.env.FRONTEND_URL}/dashboard/settings?gmail_status=error`
    );
  }
};
