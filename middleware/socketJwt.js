const { User } = require("../Sprints/authentification/models/ContentCreator.model");
const jwt = require("jsonwebtoken");
 module.exports.authenticateSocket = async (socket, token, next) => {
    try {
      jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
        if (err) {
          console.error(err);
          return next(new Error('Invalid token. Please login again.'));
        }
        
        if (!decoded) {
          return next(new Error('User token is no longer valid. Please login again.'));
        }
        
        const user = await User.findById(decoded.id);
        if (!user) {
          return next(new Error('User not found.'));
        }
        
        if (user.bloque) {
          return next(new Error('Access forbidden. User is blocked.'));
        }
        
        socket.userId = decoded.id;
        next();
      });
    } catch (error) {
      console.error(error);
      next(new Error('Internal server error.'));
    }
  };
  
  // Usage:
 
  