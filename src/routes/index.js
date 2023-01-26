const { Router } = require("express");
const appRouter = Router();
const usersRoutes = require("./users.routes");

appRouter.use("/users", usersRoutes);

module.exports = appRouter;
