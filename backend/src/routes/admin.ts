import express from 'express';
import admin from '../config/firebase';
import { authenticateUser, isAdmin } from '../middleware/auth';

const router = express.Router();

// Special endpoint to set the FIRST admin (no auth required)
// IMPORTANT: Remove or secure this endpoint after first use!
router.post('/set-first-admin', async (req, res) => {
  try {
    const { uid, secretKey } = req.body;
    if (secretKey !== process.env.ADMIN_SECRET_KEY) {
      return res.status(403).json({ message: 'Invalid secret key' });
    }
    if (!uid) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    await admin.auth().setCustomUserClaims(uid, { role: 'admin' });
    res.json({ 
      success: true, 
      message: 'First admin role set successfully',
      uid
    });
  } catch (error) {
    console.error('Error setting first admin:', error);
    res.status(500).json({ message: 'Failed to set admin role' });
  }
});

// Regular endpoint for admins to promote other users (requires admin auth)
router.post('/set-admin-role', authenticateUser, isAdmin, async (req, res) => {
  try {
    const { uid } = req.body;
    if (!uid) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    await admin.auth().setCustomUserClaims(uid, { role: 'admin' });
    res.json({ success: true, message: 'User upgraded to admin role' });
  } catch (error) {
    console.error('Error setting admin role:', error);
    res.status(500).json({ message: 'Failed to set admin role' });
  }
});

// Get current user's admin status (useful for frontend)
router.get('/check-status', authenticateUser, async (req, res) => {
  try {
    // Type assertion to avoid TS error
    const user = req.user as { uid?: string; firebaseUid?: string; role?: string };
    const isUserAdmin = user?.role === 'admin';
    res.json({ 
      isAdmin: isUserAdmin,
      uid: user?.uid || user?.firebaseUid || null
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to check admin status' });
  }
});

export default router;
