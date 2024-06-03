const Projet = require('../models/Project');
const Modele = require('../../Tasks_management/models/modele');
const Tache=require('../../Tasks_management/models/tache.model');
const Categorie=require('../../Tasks_management/models/categorie.model');
const {User}=require('../../authentification/models/ContentCreator.model');
// Add a new project
module.exports.addProject = async (req, res) => {
    try {
        const { filename } = req.file;
        const newProject = new Projet({
            categorie: req.body.categorie,
            branche: req.body.branche,
            image: filename,
            tache: req.body.tache,
            typePost: req.body.typePost,
            titre: req.body.titre,
            description: req.body.description,
            etat: req.body.etat,
            createurDeContenu: req.body.createurDeContenu,
            modele:req.body.modele
          
        });
        const existingCategorie = await Categorie.findById(req.body.categorie);
        if (!existingCategorie) {
            throw new Error("Categorie not found");
        }
        const existingTemplate = await Modele.findById(req.body.modele);
        const existingtache = await Tache.findById(req.body.tache);
        if (req.body.modele) {
            
            if (!existingTemplate) {
                throw new Error("Template not found");
            } else if (existingTemplate.archive) {
                throw new Error("Template has been archivated");
            }}
            
            // Check if tache ID exists and mark it as done
            if (newProject.tache) {
                
                if (!existingtache) {
                    throw new Error("Task not found");
                }
                console.log(existingtache.etat);
                if(existingtache.etat=="manqué")
                {
                    throw new Error ("missed task");
                }
                if(existingtache.etat=="fait" )
                { console.log("error fait");
                    throw new Error ("task done");
                }

            }
            const existingCreateur = await User.findById(req.body.createurDeContenu);
            if (!existingCreateur) {
                throw new Error("Createur de contenu not found");
            }

            const projet = await newProject.save();
            try{  existingCreateur.projets.push(projet);
                await existingCreateur.save();
            }
            catch(e)
            {
                throw new error(e.message);
            }
          
            if(existingtache)
            {existingtache.projet = projet;
                existingtache.etat='fait';
            if(existingtache.optionnel){
            existingtache.createurDeContenu=existingCreateur;
            }
            await existingtache.save();}
            if(existingTemplate)
            {existingTemplate.projets.push(projet);
            await existingTemplate.save();}
       
        res.status(201).json(newProject);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
};

module.exports.deleteProject = async (req, res) => {
    try {
        const projectId = req.params.id;
        
        // Find the project by ID and delete it
        const deletedProject = await Projet.findByIdAndDelete(projectId);
        if (!deletedProject) {
            return res.status(404).json({ error: "Project not found" });
        }
        
        // Remove project reference from associated collections
        // Remove project reference from Modele collection
        if (deletedProject.modele) {
            await Modele.findByIdAndUpdate(deletedProject.modele, {
                $pull: { projets: projectId }
            });
        }
        
        // Remove project reference from User collection
        const users = await User.find({ projets: projectId });
        for (const user of users) {
            user.projets.pull(projectId);
            await user.save();
        }
        
        // Remove project reference from Tache collection
        await Tache.updateMany({ projet: projectId }, {
            $unset: { projet: "" }
        });
        
        res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};


// Update an existing project by ID
module.exports.updateProject = async (req, res) => {
    const { id } = req.params;
    try {
        await Projet.findByIdAndUpdate(id, req.body);
        res.status(200).json({ message: 'Project updated successfully' });
    } catch (error) {
        res.status(500).json(error.message);
    }
};


// Get a project by ID
module.exports.getProjectById = async (req, res) => {
    const { id } = req.params;
    try {
        const project = await Projet.findById(id);
        res.status(200).json(project);
    } catch (error) {
        res.status(404).json({ message: 'Project not found' });
    }
};

// Get all projects
module.exports.getAllProjects = async (req, res) => {
    try {
        const projects = await Projet.find();
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json(error.message);
    }
};


