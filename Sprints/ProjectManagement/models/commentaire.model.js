const mongoose = require('mongoose');

const evaluationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
  },
  stars: {
    type: Number,
    min: 0,
    max: 5,
  },
  comment: String,
  // Other evaluation properties
});

const Evaluation = mongoose.model('Evaluation', evaluationSchema);

module.exports = Evaluation;
