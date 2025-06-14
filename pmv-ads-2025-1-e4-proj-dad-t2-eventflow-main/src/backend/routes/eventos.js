const express = require("express");
const router = express.Router();
const eventoController = require("../controllers/eventoController");

// Lista todos os eventos
router.get("/", eventoController.getAllEventos);

// Busca evento por ID
router.get("/:id", eventoController.getEventoById);

// Cria um novo evento
router.post("/", eventoController.createEvento);

module.exports = router;
