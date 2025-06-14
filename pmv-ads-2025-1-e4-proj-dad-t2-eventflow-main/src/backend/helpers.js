const PDFDocument = require("pdfkit");
const fs = require("fs");

async function gerarPdfIngresso(evento, userId, nomes, filePath) {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument();
        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        doc.fontSize(20).text("Ingresso Gerado", { align: "center" });
        doc.moveDown();
        doc.fontSize(16).text(`Evento: ${evento.titulo}`);
        doc.text(`Local: ${evento.local}`);
        doc.text(`Data: ${new Date(evento.data).toLocaleString()}`);
        doc.moveDown();
        doc.fontSize(16).text("Participantes:");
        nomes.forEach((nome, index) => doc.text(`${index + 1}. ${nome}`));

        doc.end();

        stream.on("finish", resolve);
        stream.on("error", reject);
    });
}

module.exports = { gerarPdfIngresso };
