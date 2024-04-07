const express = require("express");
const categorieController= require("../controllers/CategoriesController");
const router = express.Router();
// /api/auth/register
router.get("/",categorieController.getAllCategories);

module.exports = router;