const Modele = require('../models/modele'); // Import the Modele model
const Categorie = require('../models/categorie.model'); 
// Controller function to add a new mode
 module.exports.addTemplate = async (req, res) => {
  try {
    console.log(req.body);
     const {filename}=req.file;
    

    // Create a new mode instance
    const newModele = new Modele({
        categorie: req.body.categorie,
        branche:req.body.branche,
        contenu:filename,

    });
    const categorie = await Categorie.findById(req.body.categorie);
   
    if (!categorie) {
      throw new Error("categorie not found");
    }

    // Push the ID of the saved modele instance into the modeles array of the category document
    categorie.modeles.push(newModele._id);

    // Save the updated category document
    await categorie.save();

    // Save the new mode instance to the database
    await newModele.save();
     
    // Return success response
    res.status(200).json(newModele);
  } catch (error) {
    // Return error response if any error occurs
    res.status(500).json(error.message);
  }
};
module.exports.getTemplates= async (req, res) => {
    try {
      const modeles = await Modele.find().populate('categorie');;
      res.status(200).json(modeles);
    } catch (err) {
      res.status(500).json(err.message);
    }
  };

module.exports.updateTemplate= async (req, res) => {
    const { id } = req.params;
    const { categorie, contenu, branche,archive,Utilise } = req.body;
    if (categorie) {
        // Search for the category ID in the database
        const existingCategory = await Categorie.findOne({ _id: categorie });
        if (!existingCategory) {
          throw new Error("Category not found");
        }}
    try {
      const modele = await Modele.findByIdAndUpdate(id, {
        categorie,
        contenu,
        branche,
        archive,
        Utilise
      }, { new: true }); 
      if (!modele) {
        throw new Error("model not found");
      }


  
      res.json(modele);
    } catch (err) {
      res.status(500).json(err.message);
    }
  }




