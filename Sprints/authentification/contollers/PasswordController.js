const asyncHandler = require("express-async-handler");
const { User, validateChangePassword,validateEmail } = require("../models/ContentCreator.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const emailSender = require('../services/SendEmail');
const crypto = require("crypto");
const Token=require('../models/Token.model');


/**
 *  @desc    Send Forgot Password Link
 *  @route   /password/forgot-password
 *  @method  POST
 *  @access  public
 */
module.exports.EmailVerificationForPasswordReset = async (req, res) => {
  try {
  const { error } = validateEmail(req.body);
  if (error) {
    throw new Error("invalid email");
  }
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    throw new Error("non existant user");
  }
  if (user.bloque) {
    throw new Error("Access forbidden. Account blocked.");
  
  }
  console.log(user.bloque);
  if (!user.verified)
  {
    throw new Error("User not verified please go verify your account!");
  }
  console.log(user.verified);
  
    let token = await Token.findOne({ userId: user._id });
    console.log(token);
    if (!token) {
      token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
      console.log(token.token);
      
      const url = `${process.env.BASE_URL}auth/${user.id}/verify/${token.token}`;

         try{ 
          await emailSender.sendEmail(user,'email verification' , url);
    
        
  } catch (error) {
    throw new Error("email n'a pas été envoyé à l'utilisateur");
  };}
  return res.status(200).send({ email:req.body.email,  message: "link sent to reset password" });


   } catch (error) {
    console.log(error);
    return res.status(500).json(error.message);
  }
};




/**
 *  @desc    Reset The Password
 *  @route   /password/reset-password/:userId/:token
 *  @method  POST
 *  @access  public
 */


module.exports.updatePassword = async (req, res) => {
  try {
    const { email, motdepasse} = req.body;
    console.log("hetha l body",req.body);
    console.log("hetha l pass",motdepasse);

    if(!motdepasse){
      throw new Error("Password is required " );
    }
   /*try{
   validateChangePassword(req.body);
  }catch(error){
  
      throw new Error(error.message);
    }*/
    // Find the user by email
    let user = await User.findOne({ email });
    if (!user) {
      throw new Error("non existant user");
    }
 

    
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(motdepasse, salt);

      user.motdepasse = hashedPassword;
      if(!user.verified)
      user.verified = true;
      await user.save();

      return res.status(200).send({ message: "Password set and account verified successfully" });
    }
  
  catch (error) {
    return res.status(500).send({ message: error.message });
  }
};
