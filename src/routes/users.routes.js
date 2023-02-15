const { Router } = require("express");
const usersRoutes = Router();

const UsersController = require("../controllers/UsersController");
const UserAvatarController = require("../controllers/UserAvatarController");

const usersController = new UsersController();
const userAvatarController = new UserAvatarController();

const ensureAuthenticity = require("../middlewares/ensureAuthenticity");

const multer = require("multer");
const uploadConfig = require("../configs/uploads");
const upload = multer(uploadConfig.MULTER);

usersRoutes.post("/", usersController.create);
usersRoutes.put("/", ensureAuthenticity, usersController.update);
usersRoutes.patch(
  "/",
  ensureAuthenticity,
  upload.single("avatar"),
  userAvatarController.update
);

module.exports = usersRoutes;
