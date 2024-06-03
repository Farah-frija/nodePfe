const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { User, validateUpdateUser } = require("../models/ContentCreator.model");
const mongoose = require("mongoose");
const generatePassword = require('../services/GeneratePassword');
const Categorie = require("../../Tasks_management/models/categorie.model");

/**
 *  @desc    Update User
 *  @route   /api/users/photo/:id
 *  @method  PUT
 *  @access  private (only admin & user himself)
 */
module.exports.updateUser = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new Error('Invalid user ID');
    }
    const { error } = validateUpdateUser(req.body);
    if (error) {
      throw new Error('Invalid entries');
    }
    let updateData = req.body;

    // Check if bloque is true, then set token to false
    if (req.body.bloque === true) {
      updateData.token = false;
    }

    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });



    if (!user) {
      throw new Error('User not found');
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).json(error.message);
  };
};

/**
 *  @desc    Update User Photo
 *  @route   /api/users/:id
 *  @method  PUT
 *  @access  private (only admin & user himself)
 */
module.exports.updateUserPhoto = async (req, res,next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new Error('Invalid user ID');
    }
 

    
    const {filename}=req.file;
    console.log(filename);
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { photoDeProfile: filename },
      { new: true } // Set to true to return the modified document
    );
    
    if (!updatedUser) {
      throw new Error('User not found or no modification performed');
    }
  
    return res.status(200).json({photoDeProfile:updatedUser.photoDeProfile});
  } catch (error) {
    console.error(error.message);
    res.status(500).json(error.message);
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
    const users = await User.find().select("-password").populate('projets');;
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
    const user = await User.findById(req.params.id).select("-password")
    .populate({
      path: 'taches', // Populate the 'taches' field referencing 'Tache' model
    })
      .populate({
        path: 'projets',
        populate:{
          path:'categorie',
          model:'Categorie'
        } // Populate the 'projets' field referencing 'Projet' model
      })
      .populate({
        path: 'tachesVues', // Populate the 'tachesVues' field referencing 'EtatTache' model
        populate: {
          path: 'tache', // Populate the 'tache' field inside 'EtatTache' model
          model: 'Tache' // The model to use for populating 'tache' field
        }
      }// Populate the 'tachesVues' field referencing 'EtatTache' model
  
      );
    if (!user) {
      throw new Error("User not found");
    }

        
    const { motdepasse, ...other } = user._doc;

    res.status(200).json({ ...other});
   
  } catch (error) {
    console.error(error.message);
    res.status(500).json(error.message);
  }
};

module.exports.logout = async (req,res) => {
  try {
    res.cookie('jwt_token', '', { httpOnly: false, maxAge: 1 });
    req.session.destroy();
    res.status(200).json({
      message: 'User successfully logged out',
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  } 
}

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