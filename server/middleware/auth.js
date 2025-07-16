const jwt = require('jsonwebtoken');
const UserModel = require('../models/User');
const Session = require('../models/Session');
const secretKey = 'your-secret-key';

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    const decodedToken = jwt.verify(token, secretKey);
    // Check session validity
    const session = await Session.findOne({ userId: decodedToken.userId, token, isActive: true });
    if (!session || session.expiresAt < new Date()) {
      return res.status(401).json({ error: 'Session expired or invalid. Please log in again.' });
    }
    // Try to get name from token, otherwise fetch from DB
    let user = {
      _id: decodedToken.userId,
      email: decodedToken.email,
      role: decodedToken.role,
      applicationId: decodedToken.applicationId,
      applicationName: decodedToken.applicationName
    };
    if (decodedToken.name) {
      user.name = decodedToken.name;
    } else {
      // Fetch from DB if not in token
      const dbUser = await UserModel.findById(decodedToken.userId).lean();
      if (dbUser) user.name = dbUser.name;
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Authentication failed try Again' });
  }
};