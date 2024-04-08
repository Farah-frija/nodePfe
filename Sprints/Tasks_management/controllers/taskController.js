const express = require('express');
const router = express.Router();
const yup = require('yup');
const mongoose = require('mongoose');
const  Tache = require('../models/tache.model');
const {EtatTache} = require('../models/EtatTache.model');
const { User } = require("../../authentification/models/ContentCreator.model");

//administrateur va ajouter une tache
module.exports.addTask = async (req, res,io) => {
  try {

  
    // Extract task data from request body
    const { instructions, description,
      // categorie,
        titre, createurDeContenu, dateLimite, optionnel } = req.body;

    // Check if categorie exists
   /* const existingCategorie = await Categorie.findById(categorie);
    if (!existingCategorie) {
      throw new Error('Categorie not found');
     
    }*/
       if(!optionnel)
    // Check if createurDeContenu exists
    {const existingUser = await User.findById(createurDeContenu);
    
    if (!existingUser) {
      
      throw new Error('Createur de contenu not found');
    }}
    const newTask = new Tache({
      instructions,
      description,
      //categorie,
      titre,
      dateLimite,
      optionnel,
      ...(optionnel ? {} : { createurDeContenu }), // Include createurDeContenu only if optionnel is false
    });
    // Save the new task document to the database

    await newTask.save();
    console.log(newTask.id);
    if(optionnel)
    { const users = await User.find({});
    
      // Create EtatTache instances for each user and the new task
      const etatTaches = users.map(user => ({
          tache: newTask._id,
          createurDeContenu: user._id,
      }));
      console.log(etatTaches);
      // Save EtatTache instances to the database
      const savedEtatTaches = await EtatTache.insertMany(etatTaches);
  
      // Iterate through savedEtatTaches to update the respective user
      for (const etatTache of savedEtatTaches) {
          // Update tachesVues in the User document for the corresponding user
         const user= await User.findByIdAndUpdate(etatTache.createurDeContenu, { $push: { tachesVues: etatTache._id } });
        
      }
  
      // Extract the ObjectId from each saved EtatTache object
      const etatTacheIds = savedEtatTaches.map(et => et._id);
  
      // Update vuPar in the Tache document
      await Tache.findByIdAndUpdate(newTask._id, { $push: { vuPar: { $each: etatTacheIds } } });
  }else {
          // If task is obligatory, create EtatTache instance for content creator
          const etatTache = new EtatTache({
            tache: newTask._id,
            createurDeContenu: createurDeContenu,
          });
    
          // Save EtatTache instance to the database
          await etatTache.save();
     
          // Update content creator's tachesVues
          const user = await User.findByIdAndUpdate(createurDeContenu, { 
            $push: { tachesVues: etatTache._id },
            $addToSet: { taches: newTask._id } // Use $addToSet to avoid adding duplicate tasks
        });
        
      //   if (user && !user.bloque && user.verifie) {
      //    console.log(user._id);
      //  cbon= io.to(user._id).emit('newTaskAdded', { newTask, message: "mandatory Task" });
      //  console.log(cbon,"cbon");
      //   }
        
          
        }


    // Send success response
    res.status(201).json( newTask );
  } catch (error) {
    // Send error response if any error occurs
    res.status(500).json(error.message);
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
    res.status(500).json(error.message);
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