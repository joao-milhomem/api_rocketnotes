const { compare } = require("bcrypt");
const knex = require("../database/knex/index");
const AppError = require("../utils/AppError");

class SessionsController {
  async create(request, response) {
    const { email, password } = request.body;

    const user = await knex("users").where({ email }).first();

    if (!user) {
      throw new AppError("Email e/ou senha inválidos", 401);
    }

    const checkPassword = await compare(password, user.password);

    if (!checkPassword) {
      throw new AppError("Email e/ou senha inválidos", 401);
    }

    return response.json(user);
  }
}

module.exports = SessionsController;
