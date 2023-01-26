const express = require("express");
const app = express();
const PORT = 3333;
const appRouter = require("./routes");

app.listen(PORT, () =>
  console.log(`Server listening on http://localhost:${PORT}`)
);

app.use(express.json());
app.use(appRouter);
