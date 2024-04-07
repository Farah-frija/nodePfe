const mongoose = require("mongoose");
const ModeleSchema = new mongoose.Schema({
 categorie:  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Categorie',},
contenu:{
    type: String,
    },
    branche:{
        type: String,},
archive:{
    type:Boolean,
    default:false,
},
Utilise:{
    type:Number,
    default:0,
},
projets:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Projet',
}]     

}, { timestamps: true });
  const Modele = mongoose.model('Modele', ModeleSchema);

// Export the model
module.exports = Modele;


// Route GET pour récupérer tous les modèles
