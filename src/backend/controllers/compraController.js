const Compra = require("../models/Compra");
const Evento = require("../models/Evento");
const User = require("../models/User");
const path = require("path");
const fs = require("fs");
const PDFDocument = require("pdfkit");

const realizarCompra = async (req, res) => {
  try {
    const { userId, eventId, metodoPagamento, valorPago, nomesParticipantes } = req.body;

    const evento = await Evento.findById(eventId);
    if (!evento) {
      return res.status(404).json({ message: "Evento não encontrado." });
    }

    const novaCompra = new Compra({
      evento_id: eventId,
      comprador: userId,
      quantidade: nomesParticipantes.length,
      total: valorPago
    });

    await novaCompra.save();

    const pdfDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir, { recursive: true });

    const pdfPath = path.join(pdfDir, `compra_${novaCompra._id}.pdf`);
    const pdfUrl = `/uploads/compra_${novaCompra._id}.pdf`; // Caminho relativo

    const doc = new PDFDocument();
    const stream = fs.createWriteStream(pdfPath);
    doc.pipe(stream);

    doc.fontSize(16).text("Confirmação de Compra", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Evento: ${evento.titulo}`);
    doc.text(`Local: ${evento.local}`);
    doc.text(`Data: ${new Date(evento.data).toLocaleString()}`);
    doc.text(`Quantidade de Participantes: ${nomesParticipantes.length}`);
    doc.text(`Valor Total Pago: R$ ${valorPago}`);
    doc.text(`Participantes:`);
    nomesParticipantes.forEach((nome, index) => {
      doc.text(`  ${index + 1}. ${nome}`);
    });
    doc.end();

    stream.on("finish", async () => {
      novaCompra.pdfUrl = pdfUrl;
      await novaCompra.save();
      res.status(201).json({ compra: novaCompra, pdfUrl });
    });

    stream.on("error", (err) => {
      console.error("Erro ao gerar PDF:", err);
      res.status(500).json({ message: "Erro ao gerar PDF." });
    });

  } catch (error) {
    console.error("Erro ao realizar compra:", error);
    res.status(500).json({ message: "Erro ao realizar compra." });
  }
};

const listarCompras = async (req, res) => {
  try {
    const { userId } = req.query;
    const filtro = userId ? { comprador: userId } : {};

    const compras = await Compra.find(filtro)
      .populate("evento_id")  // CORRIGIDO AQUI
      .populate("comprador");

    res.status(200).json(compras);
  } catch (error) {
    console.error("Erro ao listar compras:", error);
    res.status(500).json({ message: "Erro ao listar compras." });
  }
};

module.exports = { realizarCompra, listarCompras };
