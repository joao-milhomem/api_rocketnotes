const fs = require("fs");
const path = require("path");
const uploadCOnfig = require("../configs/uploads");

class DiskStorage {
  async saveFile(file) {
    await fs.promises.rename(
      path.resolve(uploadCOnfig.TMP_FOLDER, file),
      path.resolve(uploadCOnfig.UPLOADS_FOLDER, file)
    );

    return file;
  }

  async deleteFile(file) {
    const filePath = path.resolve(uploadCOnfig.UPLOADS_FOLDER, file);

    try {
      await fs.promises.stat(filePath);
    } catch {
      return;
    }

    await fs.promises.unlink(filePath);
  }
}

module.exports = DiskStorage