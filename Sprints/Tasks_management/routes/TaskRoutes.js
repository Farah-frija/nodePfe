const express = require("express");
const taskController= require("../controllers/taskController");
const router = express.Router();
const {
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
  } = require("../../../middleware/VerifyToken");
// /api/auth/register


module.exports = function(io) {
    router.post("/addtask", verifyTokenAndAdmin, (req, res) => taskController.addTask(req, res, io));
    router.get("/", taskController.getAllTasks);
    return router;
};