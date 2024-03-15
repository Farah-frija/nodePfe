const express = require("express");
const taskController= require("../controllers/taskController");
const router = express.Router();
// /api/auth/register
router.post("/addtask", taskController.addtask);
module.exports = router;