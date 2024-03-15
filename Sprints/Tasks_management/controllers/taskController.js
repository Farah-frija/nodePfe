const express = require('express');
const router = express.Router();
const yup = require('yup');
const mongoose = require('mongoose');
const { Tache, taskValidationSchema } = require('../models/tache.model');
const Categorie = require('../models/categorie.model');
const { User } = require("../../authentification/models/ContentCreator.model");

//administrateur va ajouter une tache
module.exports.addtask = async (req, res) => {
  try {

    // Validate request body using Yup
    try {

      console.log(req.body);
      await taskValidationSchema.validate(req.body, { abortEarly: false });

    }
    catch { throw new Error('Validation failed:'); };
    //retrenir les infos
    const { instructions, categorie, titre, createursDeContenu, optionnel, dateLimite } = req.body;

    /* const existingCategorie = await Categorie.findById(req.body.categorie);
     if (!existingCategorie) {
       throw new Error(`Categorie with ID ${req.body.categorie} not found`);
     }*/
//verification de la date 
    if (dateLimite && new Date(dateLimite) < new Date()) {
      console.log("bch ythabt fl date");
      throw new Error('DateLimite must be in the future ');
    }
    // Perform additional checks



    if (!optionnel) {
      console.log("bch ythabt fi ken me aandouch users w howa obligatoire");
      if (!createursDeContenu || createursDeContenu.length === 0)
        throw new Error('A non-optional task must be assigned to at least one user');



// verification de la validité des ids entrés
      const invalidIds = createursDeContenu.filter(({ createurDeContenu }) => {
        try {
          new mongoose.Types.ObjectId(createurDeContenu); // Try to construct ObjectId
          console.log("id valide") // If successful, it's a valid ObjectId
        } catch (error) {
          throw new Error(error.message); // If an error occurs, it's not a valid ObjectId
        }
      });

      for (const userId of createursDeContenu) {
        const user = await User.findById(userId);
        console.log("lkahom");
//ylawej aala kol user mawjoud fl bd wala lee
        if (!user) {
          throw new Error(`User with ID ${userId} not found`);
        }
        user.taches.push({
          createurDeContenu: userId,
          projet: null,

        });
        console.log(user);
//nhot e tache aand l user
        await user.save();

      }
//nassnaa tache jdida w nhotha fl collection mtaa taches
      const task = new Tache({
        instructions,
        categorie,
        titre,
        createursDeContenu: createursDeContenu.map(userId => ({
          createurDeContenu: userId,

        })),
        dateLimite,
      });

      await task.save();
      
      return res.status(200).json({ message: 'Task added successfully to the users' });



    }
    else {
      const task = new Tache({
        instructions,
        categorie,
        titre,
        createursDeContenu: [],  // Empty array for optional task
        dateLimite,
      });
      await task.save();
    }





    return res.status(200).json({ message: 'Task added successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


module.exports.submitTask = async (req, res) => {
  try {
    const { userId, taskId } = req.body;

    // Check if the user and task exist
    const user = await User.findById(userId);
    const task = await Task.findById(taskId);

    if (!user || !task) {
      throw new Error('User or task not found');
    }

    // Check if the task's deadline has passed
    if (task.isDeadlinePassed()) {
      throw new Error('passed deadline');
    }

    // Create a new project associated with the task
    const project = new Project({
      title: task.title,
      categorie: task.categorie,
      tache: task._id,
    });

    await project.save();
    const existingUserEntry = task.createursDeContenu.find(entry => entry.createurDeContenu.equals(userId));

    if (existingUserEntry) {
      // User exists in createursDeContenu, update the entry
      existingUserEntry.projet = projectId;
      existingUserEntry.etat = 'fait';
    } else {
      // User doesn't exist in createursDeContenu, add a new entry
      task.createursDeContenu.push({
        createurDeContenu: userId,
        projet: projectId,
        etat: 'fait',
      });
    }
    await task.save();

    const existingTaskEntry = user.taches.find(entry => entry.createurDeContenu.equals(userId));

    if (existingTaskEntry) {
      // If the user already has an entry, update the project and etat
      existingTaskEntry.projet = project._id;
      existingTaskEntry.etat = 'fait';
    } else {
      // If the user doesn't have an entry, create a new one
      user.taches.push({
        createurDeContenu: userId,
        projet: project._id,
        etat: 'fait',
      });
    }
     await user.save();
     //notification will be sent to the admin to inform him that a user has submitted a task 
     io.to(adminSocketId).emit('adminTaskCompleted', { taskId });

     // Create a notification for the user
    const notificationMessage = `Task ${taskId} has been completed.`;
    const notificationUrl = `/tasks/${taskId}`; // Replace with the URL structure you want


    return res.status(200).json({ message: 'Task submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

//update task
// Import required modules and models


// Your existing route handler for updating a task
module.exports.updateTask= async (req, res) => {
  const taskId = req.params.taskId;
  const task = await Tache.findById(taskId);
  if (!task) {
    throw new Error('User or task not found');
  }
  
  const updates = req.body; // Assuming updates are sent in the request body
  try {

    console.log(req.body);
    await taskValidationSchema.validate(req.body, { abortEarly: false });

  }
  catch { throw new Error('Validation failed:'); };
  try {
    // Call the update method
    const updatedTask = await Tache.updateTask(taskId, updates);
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json(error.message);
  }
};


// Your existing route handler for deleting a task
module.exports.deleteTask= async (req, res) => {
  const taskId = req.params.taskId;
  const task = await Tache.findById(taskId);
  if (!task) {
    throw new Error('User or task not found');
  }
  try {
    // Call the delete method
    const deletedTask = await Tache.deleteTask(taskId);
    if (!deletedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
//get all of the tasks 
module.exports.getAllTasks = async (req, res) => {
  try {
    // Fetch all tasks from the database
    const tasks = await Tache.find();

    // Return the tasks in the response
    res.status(200).json(tasks);
  } catch (error) {
    // If an error occurs, handle it and send an error response
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
//get optional tasks

// Controller function for getting tasks of a user with filter
module.exports.getUserTasksWithFilters = async (req, res) => {
  const userId = req.params.id;
  const { title, category, done, optionnel } = req.query;
  const query = { 'createursDeContenu.createurDeContenu': userId };

  if (title) {
    query.titre = { $regex: title, $options: 'i' }; // Case-insensitive title search
  }
  if (category) {
    query.categorie = category;
  }
  if (done) {
    query['createursDeContenu.etat'] = 'fait';
  }
  if (optionnel) {
    query.estOptionnel = optionnel === 'true';
  }

  try {
    const tasks = await Tache.find(query)
                              .populate('createursDeContenu.createurDeContenu', 'name'); // Populate user details
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching user tasks with filters:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};







//get tasks for only one content creator 
//get non optional tasks 