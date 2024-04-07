const express = require("express");
const projectController= require("../controllers/projectController");
const router = express.Router();
const upload = require("../../../middleware/UploadFile")
// /api/auth/register
router.post("/addProject",upload.single("image"),projectController.addProject);
router.get("/",projectController.getAllProjects);
router.put("/updateProject/:id",projectController.updateProject);
router.delete("/deleteProject/:id",projectController.deleteProject);
module.exports = router;