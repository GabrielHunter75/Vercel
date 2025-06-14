// Evento.js (dentro da sua pasta BACKEND)
const mongoose = require('mongoose');

// 1. Defina o esquema para o Ingresso
const ingressoSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
        trim: true
    },
    preco: {
        type: Number,
        required: true,
        min: 0 // Preço não pode ser negativo
    },
    quantidadeDisponivel: {
        type: Number,
        required: true,
        min: 0 // Quantidade não pode ser negativa
    },
    // NOVO CAMPO: Quantidade de ingressos deste tipo que foram vendidos
    vendidos: {
        type: Number,
        default: 0, // Começa em 0 para novos tipos de ingresso
        min: 0
    }
});


// 2. Defina o esquema principal para o Evento
const eventoSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 100
    },
    local: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    data: {
        type: Date,
        required: true
    },
    descricao: {
        type: String,
        required: true,
        trim: true,
        minlength: 10,
        maxlength: 1000
    },
    faixa_etaria: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    imagem: {
        type: String, // Armazenará o caminho da imagem ou Base64
        default: null // Pode ser nulo se não houver imagem
    },
   categoria: {
  type: mongoose.Schema.Types.Mixed,  // <-- aceita string, ObjectId, qualquer coisa
  default: null
},
    organizador_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    participantes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    privado: {
        type: Boolean,
        default: false
    },
    // AQUI ESTÁ A ADIÇÃO CRUCIAL: O CAMPO 'ingressos'
    ingressos: {
        type: [ingressoSchema], // Define que 'ingressos' é um array de documentos que seguem o ingressoSchema
        default: [] // Garante que, se nenhum ingresso for fornecido, ele será um array vazio.
    },
    criado_em: {
        type: Date,
        default: Date.now
    },
    atualizado_em: {
        type: Date,
        default: Date.now
    }
});

// Adicionando um middleware para atualizar 'atualizado_em' em cada save
eventoSchema.pre('save', function (next) {
    this.atualizado_em = Date.now();
    next();
});


// Exporta o modelo
module.exports = mongoose.model('Evento', eventoSchema);

