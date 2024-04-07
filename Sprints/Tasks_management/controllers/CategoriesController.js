const Categorie= require("../models/categorie.model");

module.exports.getAllCategories = async (req, res) => {
    try {
      // Query all categories from the database
      const categories = await Categorie.find();
  
      // Send success response with the categories
      res.status(200).json(categories);
    } catch (error) {
      // Send error response if any error occurs
      res.status(500).json({ message: error.message });
    }
};
