const mongoose = require('mongoose');

const ingressoSchema = new mongoose.Schema({
    evento: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Evento', // Referencia o modelo de Evento
        required: true
    },
    nome: {
        type: String,
        required: true,
        trim: true
    },
    preco: {
        type: Number,
        required: true,
        min: 0
    },
    quantidadeDisponivel: { // Quantidade de ingressos para este tipo
        type: Number,
        required: true,
        min: 0
    },
    // Opcional: data limite para venda, taxa de serviço, etc.
    taxaServico: {
        type: Number,
        default: 0
    },
    dataVendaFim: {
        type: Date
    }
}, { timestamps: true }); // Adiciona createdAt e updatedAt

module.exports = mongoose.model('Ingresso', ingressoSchema);