import { Router } from 'express';
import requireAuth from '../middleware/requireAuth.js';
import {
  startGmailAuth,
  gmailCallback,
  gmailStatus,
  disconnectGmail,
  fetchEmails,
} from '../controllers/gmailAuthController.js';

const router = Router();

router.get('/connect', requireAuth, startGmailAuth);
router.get('/callback', gmailCallback);
router.get('/status', requireAuth, gmailStatus);
router.post('/disconnect', requireAuth, disconnectGmail);
router.get('/emails', requireAuth, fetchEmails);

export default router;