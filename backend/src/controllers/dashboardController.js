const { Op } = require('sequelize');
const Transacao = require('../models/Transacao');
const Categoria = require('../models/Categoria');

exports.getResumo = async (req, res) => {
    try {
        const id_usuario = req.usuario.id;

        // 1. Buscar todas as transações do usuário com os dados da categoria
        const transacoes = await Transacao.findAll({
            where: { id_usuario },
            include: [{ model: Categoria, attributes: ['tipo'] }]
        });

        // 2. Calcular Totais
        let totalReceitas = 0;
        let totalDespesas = 0;

        transacoes.forEach(t => {
            const valor = parseFloat(t.valor);
            if (t.Categoria.tipo === 'Receita') {
                totalReceitas += valor;
            } else {
                totalDespesas += valor;
            }
        });

        const saldoAtual = totalReceitas - totalDespesas;

        res.json({
            totalReceitas: totalReceitas.toFixed(2),
            totalDespesas: totalDespesas.toFixed(2),
            saldoAtual: saldoAtual.toFixed(2),
            totalTransacoes: transacoes.length
        });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao gerar resumo do dashboard.' });
    }
};