const express = require("express");
const router = express.Router();
const relatorioController = require("../controllers/relatorioController");

router.get("/", relatorioController.getRelatorios);

module.exports = router;
