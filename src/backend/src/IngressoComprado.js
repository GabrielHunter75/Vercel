const mongoose = require('mongoose');

const ingressoCompradoSchema = new mongoose.Schema({
    usuario_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Referencia o modelo de Usuário
        required: true
    },
    evento_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Evento', // Referencia o modelo de Evento
        required: true
    },
    // Detalhes do ingresso no momento da compra (para manter o histórico caso o evento mude o preço, etc.)
    nome_ingresso_comprado: {
        type: String,
        required: true,
        trim: true
    },
    preco_pago: {
        type: Number,
        required: true,
        min: 0
    },
    quantidade_comprada: {
        type: Number,
        required: true,
        min: 1 // No mínimo 1 ingresso comprado
    },
    data_compra: {
        type: Date,
        default: Date.now
    },
    // Campo opcional para um código único do ingresso (e.g., QR code)
    codigo_ingresso: {
        type: String,
        unique: true, // Garante que o código seja único
        sparse: true // Permite valores nulos para unique
    },
    // Adicione outros campos se precisar, como 'status' (pendente, confirmado, cancelado)
    status: {
        type: String,
        enum: ['pendente', 'confirmado', 'cancelado'], // Enum para status
        default: 'confirmado' // Por padrão, assume-se que a compra é confirmada
    }
});

module.exports = mongoose.model('IngressoComprado', ingressoCompradoSchema);