const mongoose = require('mongoose');

const categoriaSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
        unique: true, // Garante que não haja categorias duplicadas
        trim: true
    },
    // Você pode adicionar um campo de descrição ou ícone se quiser
    descricao: {
        type: String,
        trim: true
    }
});

module.exports = mongoose.model('Categoria', categoriaSchema);