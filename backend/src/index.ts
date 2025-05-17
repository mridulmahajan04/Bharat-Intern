import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';


// Load environment variables
dotenv.config();

// Debug logging for environment variables
console.log('Environment Variables Status:');
console.log('FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID ? '✓ Set' : '✗ Not Set');
console.log('FIREBASE_CLIENT_EMAIL:', process.env.FIREBASE_CLIENT_EMAIL ? '✓ Set' : '✗ Not Set');
console.log('FIREBASE_PRIVATE_KEY:', process.env.FIREBASE_PRIVATE_KEY ? '✓ Set' : '✗ Not Set');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? '✓ Set' : '✗ Not Set');

// Import routes
import authRoutes from './routes/auth';
import menuRoutes from './routes/menu';
import orderRoutes from './routes/orders';
import userRoutes from './routes/users';
import cashfreeRoutes from "./routes/cashfree";
import adminRoutes from './routes/admin';

const app = express();

// CORS configuration - IMPORTANT: must be before routes
app.use(cors({
  origin: 'http://localhost:3000', // Your frontend origin
  credentials: true,               // Allow credentials (cookies, auth headers)
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cashfree', cashfreeRoutes);
app.use('/api/admin', adminRoutes);

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/aniicone-cafe';
console.log('MongoDB Connection String (masked):', MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));
console.log('Attempting to connect to MongoDB...');
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✓ Connected to MongoDB'))
  .catch((error) => {
    console.error('✗ MongoDB connection error:', error);
    console.error('Connection string format should be: mongodb+srv://username:password@cluster.mongodb.net/database');
    process.exit(1); // Exit if database connection fails
  });

// Basic route
app.get('/', (req, res) => {
  res.json({ message: "Welcome to Aniicone's Café API" });
});

// Test route for environment variables
app.get('/test-env', (req, res) => {
  res.json({
    firebaseProjectId: process.env.FIREBASE_PROJECT_ID ? 'Set' : 'Not Set',
    firebaseClientEmail: process.env.FIREBASE_CLIENT_EMAIL ? 'Set' : 'Not Set',
    firebasePrivateKey: process.env.FIREBASE_PRIVATE_KEY ? 'Set' : 'Not Set',
    mongodbUri: process.env.MONGODB_URI ? 'Set' : 'Not Set'
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error occurred:', err);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✓ Server is running on port ${PORT}`);
});
