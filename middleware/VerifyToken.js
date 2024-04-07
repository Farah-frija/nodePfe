const jwt = require("jsonwebtoken");
const { User, validateUpdateUser } = require("../Sprints/authentification/models/ContentCreator.model")
// Verify Token
// Middleware to check token validity
function verifyToken(req, res, next) {
  const token = req.headers.token;// Assuming Bearer token format
  console.log(token);
  
  // Decode token and get user information
  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
    if (err) {
      console.log(err);
      return res.status(401).json({ message: "Invalid token. Please login again." });
    }

    // Check if user's token flag is false
    if (!decoded) {
     
      return res.status(401).json({ message: "User token is no longer valid. Please login again." });
    }
   
      // Find user in database to check if blocked
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ message: "User not found." });
      }

      // Check if the user is blocked
      if (user.bloque) {
        return res.status(403).json({ message: "Access forbidden. User is blocked." });
      }
    console.log(decoded);
    // Proceed with the request
    req.headers.user = decoded;
    next();
  });
}

// Verify Token & Authorize the user
function verifyTokenAndAuthorization(req, res, next) {
  verifyToken(req, res, () => {
    if (req.headers.user.id=== req.params.id || req.headers.user.role=== "administrateur") {
      console.log(req.headers.user_id );
      console.log(req.headers.user_role);
      next();
    } else {
      return res.status(403).json({ message: "you are not allowed" });
    }
  });
}

// Verify Token & Admin
function verifyTokenAndAdmin(req, res, next) {
  verifyToken(req, res, () => {
    if (req.headers.user.role === "administrateur") {
      console.log(req.headers.user_role);
      next();
    } else {
      return res.status(403).json({ message: "you are not allowed, only admin allowed" });
    }
  });
}

module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin
};
