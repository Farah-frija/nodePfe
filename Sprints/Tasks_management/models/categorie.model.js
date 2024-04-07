const mongoose = require("mongoose");
const CategorieSchema = new mongoose.Schema({
  nom: {
        type: String,
        unique: true ,
      },
 modeles:[
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'modele',
  }
 ]
}, { timestamps: true });
  const Categorie = mongoose.model('Categorie', CategorieSchema);

// Export the model
module.exports = Categorie;