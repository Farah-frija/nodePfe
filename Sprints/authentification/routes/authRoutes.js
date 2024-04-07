const express = require("express");

const { register, login, EmailVerification,verifyUser} = require("../contollers/AuthController");
const { updatePassword} = require("../contollers/PasswordController");
const router = express.Router();
const upload = require("../../../middleware/UploadFile")
// /api/auth/register
router.post("/register",upload.single("photoDeProfile"), register);

// /api/auth/login
router.post("/login", login);

///
router.post("/verifyEmail",EmailVerification );
router.get("/:id/verify/:token/",verifyUser );



module.exports = router;