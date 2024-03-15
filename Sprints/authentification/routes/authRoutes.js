const express = require("express");
const { register, login, EmailVerification,verifyUser} = require("../contollers/AuthController");
const { updatePassword} = require("../contollers/PasswordController");
const router = express.Router();
// /api/auth/register
router.post("/register", register);

// /api/auth/login
router.post("/login", login);

///
router.post("/verifyEmail",EmailVerification );
router.get("/:id/verify/:token/",verifyUser );



module.exports = router;