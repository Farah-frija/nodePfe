const mongoose = require("mongoose");
const CategorieSchema = new mongoose.Schema({
  nom: {
        type: String,
        enum: ['Quizz','Meme','feedback'],},
}, { timestamps: true });
  const Categorie = mongoose.model('Categorie', CategorieSchema);

// Export the model
module.exports = Categorie;