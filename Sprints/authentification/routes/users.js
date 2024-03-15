const express = require("express");
const {
  updateUser,
  getAllUsers,
  getUserById,

} = require("../contollers/UserController");
const router = express.Router();
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../../../middleware/VerifyToken");

// /api/users
router.get("/",  getAllUsers);

// /api/users/:id
router
  .route("/:id")
  .put( updateUser)
  .get( getUserById)
 
module.exports = router;