const express = require("express");
const TemplateController= require("../controllers/templateController");
const router = express.Router();
const upload = require("../../../middleware/UploadFile")
const {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
  } = require("../../../middleware/VerifyToken");
// /api/auth/register
router.post("/addTemplate",verifyTokenAndAdmin,upload.single("contenu"),TemplateController.addTemplate);
router.get("/",verifyToken,TemplateController.getTemplates);
router.put("/:id",verifyTokenAndAdmin,TemplateController.updateTemplate );
router.put("/Increment/:id",verifyToken,TemplateController.incrementTemplate);

module.exports = router;