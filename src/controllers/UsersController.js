const { hash } = require("bcrypt");
const sqliteConnection = require("../database/sqlite");
const AppError = require("../utils/AppError");

class UsersController {
  async create(request, response) {
    const { name, email, password } = request.body;

    const database = await sqliteConnection();
    const checkIfUserExists = await database.get(
      "SELECT * FROM users WHERE email = (?)",
      [email]
    );

    if (checkIfUserExists) {
      throw new AppError("Email já está em uso");
    }

    const encryptedPassword = await hash(password, 8);

    database.run("INSERT INTO users (name, email, password) VALUES (?,?,?)", [
      name,
      email,
      encryptedPassword,
    ]);

    return response.status(201).json({});
  }
}

module.exports = UsersController;
