const { Router } = require("express");
const usersRoutes = Router();

const UsersController = require("../controllers/UsersController");
const usersController = new UsersController();

const ensureAuthenticity = require("../middlewares/ensureAuthenticity");

usersRoutes.post("/", usersController.create);
usersRoutes.put("/", ensureAuthenticity, usersController.update);

module.exports = usersRoutes;
