const jwt  = require('jsonwebtoken')
const admin = require('../config/firebase')

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split('Bearer ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Token is missing' });
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not set in environment variables');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    console.log('Attempting JWT verification...');
    console.log('Token length:', token.length);
    console.log('JWT_SECRET set:', !!process.env.JWT_SECRET);

    // Try to verify as Firebase token first
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      console.log('Firebase authentication successful');
      req.user = decodedToken; 
      return next();
    } catch (firebaseError) {
      console.log('Firebase verification failed, trying JWT...');
      //
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('JWT verification successful:', decoded);
        req.user = decoded; // JWT user (has userId)
        return next();
      } catch (jwtError) {
        console.error('JWT verification failed:', jwtError.message);
        return res.status(401).json({ error: 'Invalid token' });
      }
    }
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ error: 'Authentication failed' });
  }
};


module.exports = { authMiddleware } ;