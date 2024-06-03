const mongoose = require("mongoose");
const taskStateSchema = new mongoose.Schema({
    tache: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tache',
    },
    createurDeContenu: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    vu: {
      type: Boolean,
      default: false,
    },
    lu: {
      type: Boolean,
      default: false,
    },
    projet: 
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Projet',
      }
   
  });
  
  const EtatTache = mongoose.model('EtatTache', taskStateSchema);
  module.exports = {
    EtatTache
   
  };