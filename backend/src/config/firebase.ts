import admin from 'firebase-admin';
import dotenv from 'dotenv';
dotenv.config();


const serviceAccount = {
  type: process.env.FIREBASE_TYPE || "service_account",
  projectId: process.env.FIREBASE_PROJECT_ID, // ✓ Correct format
  privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID, // ✓ Correct format
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL, // ✓ Correct format
  clientId: process.env.FIREBASE_CLIENT_ID,
  authUri: process.env.FIREBASE_AUTH_URI,
  tokenUri: process.env.FIREBASE_TOKEN_URI,
  authProviderX509CertUrl: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  clientX509CertUrl: process.env.FIREBASE_CLIENT_X509_CERT_URL
};

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
  });
}

export default admin;
