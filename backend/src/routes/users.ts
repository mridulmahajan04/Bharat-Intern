import express from 'express';
import { authenticateUser } from '../middleware/auth';
import User from '../models/User';
import admin from '../config/firebase';

const router = express.Router();

// Get current user profile
router.get('/me', authenticateUser, async (req, res) => {
  try {
    // Get the Firebase token from the request
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Missing token' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify the token with Firebase Admin SDK and get the claims
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Check if user exists in your database
    let user = await User.findOne({ firebaseUid: decodedToken.uid });
    
    if (!user) {
      // Create user if not exists
      user = await User.create({
        email: decodedToken.email,
        firebaseUid: decodedToken.uid,
        role: decodedToken.role || 'user' // Get role from the token claims
      });
    }
    
    // Return user with role from Firebase claims
    res.json({
      id: user._id,
      email: user.email,
      role: decodedToken.role || user.role || 'user', // Prioritize Firebase claim
      firebaseUid: user.firebaseUid
    });
    
  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({ message: 'Failed to get user profile' });
  }
});

export default router;
