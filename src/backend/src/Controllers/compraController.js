// src/backend/controllers/compraController.js
import Compra from '../models/Compra.js';
import Evento from '../models/Evento.js'; // Para validações ou dados adicionais, se necessário
import Usuario from '../models/Usuario.js'; // Para validações ou dados adicionais, se necessário

// Controlador para registrar uma nova compra
export const criarCompra = async (req, res) => {
    try {
        const { userId, eventoId, ingressos, valorTotal, metodoPagamento } = req.body;

        // **TODO: Adicionar validação de entrada robusta aqui**
        // Ex: Verificar se o usuário existe (await Usuario.findById(userId)),
        // se o evento existe (await Evento.findById(eventoId)),
        // se há ingressos disponíveis, se o preço corresponde ao que está salvo no evento, etc.
        if (!userId || !eventoId || !ingressos || !valorTotal || !metodoPagamento) {
            return res.status(400).json({ message: 'Dados de compra incompletos.' });
        }

        // **TODO: Em uma aplicação real, aqui você processaria o pagamento real**
        // Integraria com Stripe, PagSeguro, etc., para realmente debitar o valor.
        // A simulação de sucesso (Math.random() > 0.3) é apenas para o frontend.

        const novaCompra = new Compra({
            userId,
            eventoId,
            ingressosComprados: ingressos,
            valorTotal,
            metodoPagamento,
            dataCompra: new Date(),
            statusPagamento: 'confirmado'
        });

        await novaCompra.save();
        res.status(201).json({ message: 'Compra registrada com sucesso!', compra: novaCompra });

    } catch (error) {
        console.error('Erro ao registrar compra:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao registrar compra.' });
    }
};

// Controlador para buscar as compras de um usuário
export const getComprasPorUsuario = async (req, res) => {
    try {
        const { userId } = req.params;

        // Opcional: verificar se o userId é válido ou se o usuário logado tem permissão
        // if (req.user._id.toString() !== userId) { return res.status(403).json({ message: 'Acesso negado.' }); }

        const compras = await Compra.find({ userId }).populate('eventoId');
        res.status(200).json(compras);
    } catch (error) {
        console.error('Erro ao buscar compras do usuário:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao buscar compras.' });
    }
};