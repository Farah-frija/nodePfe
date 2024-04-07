const express = require("express");
const upload = require("../../../middleware/UploadFile")
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
  verifyToken
} = require("../../../middleware/VerifyToken");
const {
  updateUser,
  getAllUsers,
  getUserById,
  updateUserPhoto

} = require("../contollers/UserController");
const router = express.Router();
/**/

// /api/users
router.get("/", verifyTokenAndAdmin, getAllUsers);
router.put("/photo/:id",upload.single("photoDeProfile"),verifyTokenAndAuthorization, updateUserPhoto);

// /api/users/:id
router
  .route("/:id")
  .put(verifyTokenAndAuthorization,  updateUser)
  .get(verifyToken, getUserById)












module.exports = router;
 
module.exports = router;