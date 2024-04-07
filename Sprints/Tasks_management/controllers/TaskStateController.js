const { EtatTache} = require("../models/EtatTache.model");
const mongoose = require("mongoose");


/**
 *  @desc    Update TaskState
 *  @route   /api/users/:id
 *  @method  PUT
 *  @access  private 
 */
module.exports.updateTaskState = async (req, res) => {
    const id = req.params.id;
    const body = req.body;
  
    try {
      const updatedItem = await EtatTache.findByIdAndUpdate(id, body, { new: true });
  
      if (!updatedItem) {
       throw Error('taskstate not found');
      }
      console.log(updatedItem);
      return res.status(200).json(updatedItem);
     
    } catch (error) {
      res.status(500).json(error.message);
    }}
  
  