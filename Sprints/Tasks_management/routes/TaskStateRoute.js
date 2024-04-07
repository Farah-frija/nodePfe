const express = require("express");
const taskStateController= require("../controllers/TaskStateController");
const router = express.Router();
// /api/auth/register
router.put("/:id", taskStateController.updateTaskState);

module.exports = router;