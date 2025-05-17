import { Request, Response } from 'express';
import admin from '../config/firebase';
import User from '../models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export const login = async (req: Request, res: Response) => {
  try {
    const { idToken } = req.body;
    
    // Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email } = decodedToken;
    
    // Find or create user in MongoDB
    let user = await User.findOne({ firebaseUid: uid });
    
    if (!user) {
      // Create new user if not exists
      user = new User({
        firebaseUid: uid,
        email: email || '',
        name: decodedToken.name || 'User',
        role: 'customer',
      });
      await user.save();
    }
    
    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.json({ 
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({ message: 'Authentication failed' });
  }
};
