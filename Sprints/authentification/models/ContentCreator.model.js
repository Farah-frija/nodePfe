const mongoose = require("mongoose");
const yup = require("yup");
//const passwordComplexity = require("joi-password-complexity");
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
    minlength: 15,
    maxlength: 100,
    unique: true,
  },
  pseudo: {
    type: String,
    trim: true,
    minlength: 2,
    maxlength: 200,
  },
  motdepasse: {
    type: String,
    trim: true,
    minlength: 8,
  },
  role: {
    type: String,
    enum: ["admin", "utilisateur"],
    default: "utilisateur",
  },
  cin: {
    type: Number,
    minlength: 8,
    maxlength: 8,
  },
  sexe: {
    type: String,
    enum: ["homme", "femme"],
  },
  adresse: {
    type: String,
    minlength: 5,
    maxlength: 100,
  },
  NumeroDeTel: {
    type: Number,
  },
  bloque: {
    type: Boolean,
    default: false,
  },
  dateDeNaissance: {
    type: Date,
  },
  nom: {
    type: String,
    minlength: 2,
    maxlength: 20,
  },
  prenom: {
    type: String,
    minlength: 2,
    maxlength: 20,
  },
  nombreAvertissement: {
    type: Number,
    default: 0
},
  verified: { type: Boolean, default: false },
  taches: [
    {
      idtache: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tache', // Reference the User model
      },
      projet: {
        type: mongoose.Schema.Types.ObjectId,
        
      },
      etat: {
        type: String,
        enum: ['pending', 'missed', 'done'],
        default:'pending'
      },
    },
  ],
}, { timestamps: true });

UserSchema.methods.generateAuthToken = function () {
	const token = jwt.sign({ _id: this._id}, process.env.JWT_SECRET_KEY, {
		expiresIn: "7d",
	});
	return token;
};



    /*UserSchema.methods.generateToken = function() {
      return jwt.sign({ id: this._id, isAdmin: this.isAdmin },process.env.JWT_SECRET_KEY);
    }*/
  // User Model
  const User= mongoose.model("User", UserSchema);



// Validate Register User
function validateRegisterUser(obj) {
  const schema = yup.object().shape({
    email: yup.string().trim().min(15).max(100).email().required(),
    pseudo: yup.string().trim().min(2).max(200).required(),
    role: yup.string().oneOf(["admin", "utilisateur"]),
    cin: yup.number().integer().min(10000000).max(99999999).required(),
    sexe: yup.string().oneOf(["homme", "femme"]).required(),
    adresse: yup.string().trim().min(8).max(100).required(),
    NumeroDeTel: yup.number().required(),
    dateDeNaissance: yup.date().required(),
    nom: yup.string().trim().min(2).max(20).required(),
    prenom: yup.string().trim().min(2).max(20).required(),
   
  });

  return schema.validate(obj, { abortEarly: true});
}

// Validate Login User
function validateEmail(obj) {
  const schema = yup.object().shape({
    email: yup.string().trim().min(15).max(100).email().required(),
   
  });

  return schema.validate(obj, { abortEarly: false });
}

// Validate Change Password
function validateChangePassword(obj) {
  const schema = yup.object().shape({
    motdepasse: yup
      .string()
      .trim()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters long')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      ),
  });

  return schema.validate(obj, { abortEarly: false });
}

// Validate Update User
function validateUpdateUser(obj) {
  const schema = yup.object().shape({
    email: yup.string().trim().min(5).max(100).email(),
    pseudo: yup.string().trim().min(2).max(20),
    cin: yup.number().integer().min(10000000).max(99999999),
    sexe: yup.string().oneOf(["homme", "femme"]),
    adresse: yup.string().trim().min(5).max(100),
    NumeroDeTel: yup.number(),
    bloque: yup.boolean(),
    DateDeNaissance: yup.date(),
    nom: yup.string().trim().min(2).max(20),
    prenom: yup.string().trim().min(2).max(20),

  });

  return schema.validate(obj, { abortEarly: false });
}


  module.exports = {
    User,
    validateEmail,
    validateRegisterUser,
    validateUpdateUser,
    validateChangePassword,
    //validateLoginUser
  };