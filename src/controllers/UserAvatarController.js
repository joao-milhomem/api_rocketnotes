const DiskStorage = require("../providers/diskStorage");
const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class UserAvatarController {
  async update(request, response) {
    const user_id = request.user.id;
    const avatarFilename = request.file.filename;
    const diskStorage = new DiskStorage();

    const user = await knex("users").where({ id: user_id }).first();

    if (!user) {
      throw new AppError("Usuário não autenticado", 401);
    }

    if (user.avatar) {
      await diskStorage.deleteFile(user.avatar);
    }

    const newAvatar = await diskStorage.saveFile(avatarFilename);

    user.avatar = newAvatar;

    await knex("users").update(user).where({ id: user.id });

    return response.json(user);
  }
}

module.exports = UserAvatarController;
