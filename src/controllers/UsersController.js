const { hash, compare } = require("bcrypt");
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

  async update(request, response) {
    const { name, email, password, old_password } = request.body;
    const { id } = request.params;

    const database = await sqliteConnection();
    const user = await database.get("SELECT * FROM users WHERE id = (?)", [id]);

    if (!user) {
      throw new AppError("Usuário não encontrado");
    }

    const emailOnwer = await database.get(
      "SELECT * FROM users WHERE email = (?)",
      [email]
    );

    if (emailOnwer && emailOnwer.id !== user.id) {
      throw new AppError("Email já esta em uso por outro usuario");
    }

    if (password && !old_password) {
      throw new AppError("Digite sua senha atual");
    }

    if (password && old_password) {
      const checkPassword = await compare(old_password, user.password);

      if (checkPassword) {
        user.password = await hash(password, 8);
      } else {
        throw new AppError("Senhas não conferem");
      }
    }

    user.name = name ?? user.name
    user.email = email ?? user.email;

    await database.run(
      `
      UPDATE users SET
      name = ?, email = ?, password = ?, updated_at = DATETIME('now')
      WHERE id = ?
    `,
      [user.name, user.email, user.password, id]
    );

    return response.json({});
  }
}

module.exports = UsersController;
