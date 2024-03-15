const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { User, validateUpdateUser } = require("../models/ContentCreator.model");
const mongoose = require("mongoose");
const generatePassword = require('../services/GeneratePassword');

/**
 *  @desc    Update User
 *  @route   /api/users/:id
 *  @method  PUT
 *  @access  private (only admin & user himself)
 */
module.exports.updateUser= async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new Error('Invalid user ID');
    }
    const { error } = validateUpdateUser(req.body);
    if (error) {
      throw new Error('Invalid entries');
    }
  
    const user = await User.findById(req.params.id);
  
    if (!user) {
      throw new Error('User not found');
    }
  
   const newEmail  = req.body.email;
  
    console.log("newEmail");
    console.log("user.email");
    if (newEmail && newEmail !== user.email  && !user.bloque) {
     
      const newPassword = generatePassword();
     
      
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
  
      // Send an email with the new password
      try{ await sendEmail(user,newPassword,"Changement d'email");}
      catch (error) {
        throw new Error("email n'a pas été envoyé à l'utilisateur");
      };
      // Update user data with the new email and hashed password
      user.email = newEmail;
      user.motdepasse = hashedPassword;
    } else {
      // If the email is not being updated, simply update other user data
      user.set(req.body);
    }
  
    // Save the updated user
    const updatedUser = await user.save();
    if(!updatedUser)
    
    throw new Error('an error has occured');
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error.message);
    res.status(500).json(error.message );
  };
  };



/**
 *  @desc    Get All Users
 *  @route   /api/users
 *  @method  GET
 *  @access  private (only admin)
 */
module.exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    if (!users) 
    throw new Error('not found');
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
};

/**
 *  @desc    Get User By Id
 *  @route   /api/users/:id
 *  @method  GET
 *  @access  private (only admin & user himself)
 */
module.exports.getUserById = async (req, res) => {

  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new Error('Invalid user ID');
    }
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      throw new Error("User not found");
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error.message);
    res.status(404).json({ message: error.message });
  }
};


/**
 *  @desc    Delete User
 *  @route   /api/users/:id
 *  @method  DELETE
 *  @access  private (only admin & user himself)
 module.exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (user) {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "user has been deleted successfully" });
  } else {
    res.status(404).json({ message: "user not found" });
  }
});*/