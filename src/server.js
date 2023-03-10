require("express-async-errors");

const AppError = require("./utils/AppError");
const migrations = require("./database/sqlite/migrations");

const express = require("express");
const app = express();
const PORT = 3333;
const appRouter = require("./routes");
const { UPLOADS_FOLDER } = require("./configs/uploads");
const cors = require("cors");

migrations();

app.listen(PORT, () =>
  console.log(`Server listening on http://localhost:${PORT}`)
);
app.use(cors());
app.use(express.json());
app.use("/files", express.static(UPLOADS_FOLDER));
app.use(appRouter);

app.use((error, request, response, next) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: "Error",
      message: error.message,
    });
  }

  console.error(error);

  return response.status(500).json({
    status: "Error",
    message: "Internal server error",
  });
});
