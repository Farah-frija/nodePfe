const yup = require('yup');
const mongoose = require("mongoose");
const { boolean, bool } = require('joi');
const tacheSchema = new mongoose.Schema({
  instructions: {
    type: String,
    trim: true,

  },
  description: {
    type: String,
    trim: true,

  },
  categorie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Categorie',
  },
  titre: {
    type: String,
    trim: true,

  },
 

  etat: {
    type: String,
    enum: ['en attente', 'manqué', 'fait'],
    default: 'en attente',
  },
  dateLimite: {
    type: Date,
  },
  optionnel: {
    type: Boolean,
    default: true,
  },
  concerne: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'EtatTache',
    },
   
  ],
 


}, { timestamps: true });

const Tache = mongoose.model('Tache', tacheSchema);
const taskValidationSchema = yup.object().shape({
  instructions: yup.string().trim().min(20).max(100).required('Instructions are required'),
  //categorie: yup.string().trim().length(24).required('Categorie ID is required'),
  titre: yup.string().trim().min(10).max(20),
  affectea: yup.array().of(yup.string().trim().length(24)).min(1, 'At least one user ID is required'),
  isOptional: yup.bool(),
  dateLimite: yup.date().required('DateLimite is required for non-optional tasks'),

});


// Export the model
module.exports = Tache;