
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const emailSender = require('../services/SendEmail');
const {
  User,
  validateRegisterUser,
  validateEmail,
  validateLoginUser
} = require("../models/ContentCreator.model");

const Token = require('../models/Token.model');

/**
 *  @desc    Register New User
 *  @route   /api/auth/register
 *  @method  POST
 *  @access  public
 */
// this function for the admin to send email verification link to the user email 
// this function will add the user info but the user account is still not verified in the db 
module.exports.register = async (req, res,next) => {
  try {
    /*const  error  = validateRegisterUser(req.body);
    if (error) {
      throw new Error("invalid entries");
    }*/
console.log(req.body);
const {filename}=req.file;

    let user = await User.findOne({ email: req.body.email });
    if (user) {
      throw new Error("This user is already registered");
    }
 

    user = new User({
     email: req.body.email,
      pseudo: req.body.pseudo,
      motdepasse: req.body.motdepasse,
      cin: req.body.cin,
      sexe: req.body.sexe,
      adresse: req.body.adresse,
      NumeroDeTel: req.body.NumeroDeTel,
      bloque: req.body.bloque,
      DateDeNaissance: req.body.DateDeNaissance,
      nom: req.body.nom,
      prenom: req.body.prenom,
      photoDeProfile:filename,

    });

    //send motdepasse via email for verification
   const token = await new Token({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex"),
    }).save();
    const url = `${process.env.BASE_URL}auth/${user.id}/verify/${token.token}`;
    //email sending
    try {
      await emailSender.sendEmail(user,'email verification' , url);

    } catch (error) {
      throw new Error(error.message);
    };
    const result = await user.save();
    //const token = user.generateToken();
    const { motdepasse, ...other } = result._doc;
    return res.status(200).json({ ...other, message: "Email sent with success" });

  } catch (error) {
    console.log(req.body);
    console.log(error.message);
    return res.status(500).json(error.message);
  }
};

/**
 *  @desc    Login User
 *  @route   /api/auth/login
 *  @method  POST
 *  @access  public
 */
module.exports.EmailVerification = async (req, res) => {
  try {
    //email Validation
    /*const { error } = validateEmail(req.body);
    if (error) {
      throw new Error("invalid email");
    }*/
    console.log(req.body.email);
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      throw new Error("non existant user");
    }
    if (user.bloque) {
      throw new Error("Access forbidden. Account blocked.");

    }
    console.log(user.verifie);
    if (!user.verifie) {
      let token = await Token.findOne({ userId: user._id });
      console.log(token);

      if (!token) {
        token = await new Token({
          userId: user._id,
          token: crypto.randomBytes(32).toString("hex"),
        }).save();
        console.log(token);
        const url = `${process.env.BASE_URL}auth/${user.id}/verify/${token.token}`;
        //send email
        try {
          
      await emailSender.sendEmail(user,'email verification' , url);


        } catch (error) {
          throw new Error("email n'a pas été envoyé à l'utilisateur");
        };
      }
     
       

    }
    else{  return res
      .status(400).json("Email verified please login");}
  
    res.status(200).send({ email: req.body.email, message: "An Email sent to your account please verify" });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.message);
  }
};



module.exports.login = async (req, res) => {
  try {
      /*const { error } = validateLoginUser(req.body);
    if (error) {
      throw new Error("invalid email and motdepasse ");
    }*/
  
    let user = await User.findOne({ email: req.body.email }) ;
    if (!user) {
      throw new Error("non existant user");
    }
    if (user.bloque) {
      throw new Error("Access forbidden. Account blocked.");

    }
    if (!user.verifie) {
      throw new Error("please verify your account");

    }
   console.log(req.body.motdepasse);
    const ismotdepasseMatch =  bcrypt.compare(
      req.body.motdepasse,
      user.motdepasse
    );
    if (!ismotdepasseMatch) {
      throw new Error("user wrong motdepasse");
    }
    //const token = user.generateToken();
    

    // Update user's FCM token in the database
    //await User.findByIdAndUpdate(user._id, { fcmToken });
    const token = user.generateToken();


    const { motdepasse, ...other } = user._doc;

  res.status(200).json({ ...other, token });


  } catch (error) {
    console.log(error);
    return res.status(500).json(error.message);
  }
};
//router.get("/:id/verify/:token/",
module.exports.verifyUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
        
    if (!user) 
    {
      console.log("user mch mawjoud");
      throw new Error("Invalid link user");}
     console.log(user._id);
     console.log(req.params.token);
    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    console.log("hetha token",token);
    if (!token)
    { console.log("token mch mawjoud");
    throw new Error("Invalid link token");}
     

   console.log(token);
    //await User.updateOne({ _id: user._id, verified: true });
    await token.deleteOne();

    res.status(200).send({ email: user.email, message: "Email verified successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
};

