const express = require('express');

const router = express.Router();

const mongoose = require('mongoose');
const Evento = require('../models/Evento');

// Buscar eventos do usuário logado
router.get("/:userId", async (req, res) => {

  try {

    const eventos = await Evento.find({ organizador_id: req.params.userId });

    res.status(200).json(eventos);

  } catch (error) {

    console.error("Erro ao buscar meus eventos:", error);

    res.status(500).send("Erro ao buscar meus eventos.");

  }

});



// Deletar evento (só se for dono)
router.delete("/:eventoId/:userId", async (req, res) => {

  try {

    const evento = await Evento.findById(req.params.eventoId);

    if (!evento) return res.status(404).json({ message: "Evento não encontrado." });



    if (evento.organizador_id.toString() !== req.params.userId) {

      return res.status(403).json({ message: "Você não tem permissão para deletar este evento." });

    }



    await Evento.findByIdAndDelete(req.params.eventoId);

    res.status(200).json({ message: "Evento deletado com sucesso!" });

  } catch (error) {

    console.error(error);

    res.status(500).json({ message: "Erro ao deletar evento." });

  }

});



module.exports = router;