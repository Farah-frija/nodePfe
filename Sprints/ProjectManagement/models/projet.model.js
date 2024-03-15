const ProjetSchema = new mongoose.Schema({
    
    categorie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categorie',
      },
      titre: {
        type: String,
        trim: true,
        minlength: 10,
        maxlength: 20,
      },
    description: {
        type: String,
        trim: true,
        minlength: 15,
        maxlength: 100,
    },
    tache: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tache',
      },
  
  }, { timestamps: true });
  const Projet = mongoose.model('Projet', ProjetSchema);

  // Export the model
  module.exports = Projet;