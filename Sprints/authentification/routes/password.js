const express = require("express");
const { updatePassword,EmailVerificationForPasswordReset} = require("../contollers/PasswordController");
const router = express.Router();

router.post("/updatePassword",updatePassword );
router.post("/verifyEmail",EmailVerificationForPasswordReset);


module.exports = router;