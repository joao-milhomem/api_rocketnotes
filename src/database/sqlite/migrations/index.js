const createUsers = require("../migrations/createUsers");
const sqliteConnection = require("../../sqlite");

async function migrationsRun() {
  const schema = [createUsers].join("");

  sqliteConnection().then((database) => database.exec(schema));
}

module.exports = migrationsRun;
