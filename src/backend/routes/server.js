const express = require("express");
const mongoose = require("../db");
const app = express();

const port = 3000;

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
