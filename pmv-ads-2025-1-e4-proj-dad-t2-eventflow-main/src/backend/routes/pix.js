const express = require("express");
const router = express.Router();
const pixController = require("../controllers/pixController");

router.post("/", pixController.gerarPix);

module.exports = router;
