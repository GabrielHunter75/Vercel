// src/backend/models/Compra.js
import mongoose from 'mongoose';

const CompraSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // O nome do seu modelo de usuário (ex: 'User' ou 'Usuario')
        required: true,
    },
    eventoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Evento', // O nome do seu modelo de evento (ex: 'Evento')
        required: true,
    },
    ingressosComprados: [
        {
            id: { type: String, required: true }, // ID único do tipo de ingresso (ex: 'VIP', 'Pista')
            nome: { type: String, required: true },
            preco: { type: Number, required: true },
            taxa: { type: Number, default: 0 },
            quantidade: { type: Number, required: true, min: 1 },
        }
    ],
    valorTotal: {
        type: Number,
        required: true,
    },
    metodoPagamento: {
        type: String,
        enum: ['pix', 'creditCard'], // Ajuste conforme seus métodos de pagamento
        required: true,
    },
    dataCompra: {
        type: Date,
        default: Date.now,
    },
    statusPagamento: {
        type: String,
        enum: ['pendente', 'confirmado', 'cancelado', 'falhou'],
        default: 'pendente',
    },
}, {
    timestamps: true // Adiciona automaticamente createdAt e updatedAt
});

const Compra = mongoose.model('Compra', CompraSchema);

export default Compra;