const { Router } = require("express");
const tagsRoutes = Router();

const TagsController = require("../controllers/TagsController");
const tagsController = new TagsController();
const ensureAuthenticity = require("../middlewares/ensureAuthenticity");

tagsRoutes.get("/", ensureAuthenticity, tagsController.index);

module.exports = tagsRoutes;
