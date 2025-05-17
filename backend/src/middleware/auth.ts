import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import admin from '../config/firebase';

const JWT_SECRET = process.env.JWT_SECRET!;

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
        firebaseUid?: string;
        uid?: string;
      };
    }
  }
}

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ 
        code: 'MISSING_TOKEN',
        message: 'Authorization header with Bearer token required' 
      });
    }

    const token = authHeader.split(' ')[1];
    
    // Use Firebase Admin SDK to verify Firebase ID tokens
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      console.log("Firebase token claims:", decodedToken); // Debug logging
      
      // Find the user in the database using Firebase UID
      const user = await User.findOne({ firebaseUid: decodedToken.uid })
        .select('id role firebaseUid');
      
      if (!user) {
        return res.status(401).json({
          code: 'USER_NOT_FOUND',
          message: 'User account not found'
        });
      }
      
      // IMPORTANT: Use the Firebase custom claim role if available, otherwise use DB role
      // This ensures admin permissions set via Firebase take precedence
      req.user = {
        id: user.id,
        // Prioritize Firebase token role claim over database role
        role: decodedToken.role || user.role || 'user',
        firebaseUid: user.firebaseUid,
        uid: decodedToken.uid
      };
      
      console.log("User auth details:", { 
        uid: decodedToken.uid,
        tokenRole: decodedToken.role, 
        dbRole: user.role,
        finalRole: req.user.role
      });
      
      next();
    } catch (firebaseError) {
      console.error('Firebase authentication error:', firebaseError);
      return res.status(401).json({
        code: 'INVALID_TOKEN',
        message: 'Invalid Firebase authentication token'
      });
    }
  } catch (error: any) {
    console.error('Authentication error:', error);
    
    const response = {
      code: 'INVALID_TOKEN',
      message: 'Invalid or expired authentication token'
    };

    if (error.name === 'TokenExpiredError') {
      response.code = 'TOKEN_EXPIRED';
      response.message = 'Session expired, please login again';
    }

    res.status(401).json(response);
  }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ 
      code: 'ADMIN_REQUIRED',
      message: 'Admin privileges required' 
    });
  }
  next();
};
