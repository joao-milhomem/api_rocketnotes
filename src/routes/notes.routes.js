const { Router } = require("express");
const notesRoutes = Router();

const NotesController = require("../controllers/NotesController");
const notesController = new NotesController();
const ensureAuthenticity = require("../middlewares/ensureAuthenticity");

notesRoutes.use(ensureAuthenticity);

notesRoutes.get("/", notesController.index);
notesRoutes.get("/:id", notesController.show);
notesRoutes.post("/", notesController.create);
notesRoutes.delete("/:id", notesController.delete);

module.exports = notesRoutes;
