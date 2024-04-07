const mongoose = require("mongoose");
const ProjetSchema = new mongoose.Schema({
  titre: {
        type: String,
        
      },
      description: {
        type: String,
        
      },
typePost:{
    type: String,
       
},
tache:  {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Tache',},
categorie:  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Categorie',},
    branche:{
      type: String,},
 modele:
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'modele',
  },
  
  etat:{
    type: String,
    enum: ["publique", "privé"],
  },
  createurDeContenu:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',} ,
    image:
  {
    type: String,
  },

 
}, { timestamps: true });
  const Projet = mongoose.model('Projet', ProjetSchema);

// Export the model
module.exports = Projet;