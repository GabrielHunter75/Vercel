const Evento = require("../models/Evento");

exports.getEventoById = async (req, res) => {
  const evento = await Evento.findById(req.params.id);
  if (!evento) return res.status(404).json({ message: "Evento não encontrado." });
  res.json(evento);
};

exports.getAllEventos = async (req, res) => {
  const eventos = await Evento.find();
  res.json(eventos);
};

exports.createEvento = async (req, res) => {
  const novoEvento = new Evento(req.body);
  await novoEvento.save();
  res.status(201).json(novoEvento);
};
