export {};

declare global {
  namespace Express {
    interface Request {
      user?: {
        id?: string;
        uid?: string;         // Add this property
        role?: string;
        firebaseUid?: string;
        email?: string;
        [key: string]: any;
      };
    }
  }
}
