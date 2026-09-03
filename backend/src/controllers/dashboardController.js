// src/controllers/dashboardController.js
const { Op } = require('sequelize');
const { Transacao, Categoria, Cartao } = require('../config/db');

exports.getResumo = async (req, res) => {
    try {
        const id_usuario = req.usuario?.id || req.user?.id || req.usuario?.id_usuario || req.id_usuario;

        if (!id_usuario) {
            return res.status(401).json({ error: 'Usuário não autenticado.' });
        }

        let { data_inicio, data_fim } = req.query;

        const hoje = new Date();
        const anoAtual = hoje.getFullYear();
        const mesAtual = String(hoje.getMonth() + 1).padStart(2, '0');

        const isDataValida = (d) => d && !isNaN(new Date(d).getTime());

        if (!isDataValida(data_inicio)) {
            data_inicio = `${anoAtual}-${mesAtual}-01`;
        }

        if (!isDataValida(data_fim)) {
            const ultimoDia = new Date(anoAtual, hoje.getMonth() + 1, 0).getDate();
            data_fim = `${anoAtual}-${mesAtual}-${String(ultimoDia).padStart(2, '0')}`;
        }

        // 1. BUSCA FILTRADA (Para Entradas e Saídas do Mês)
        const transacoesMes = await Transacao.findAll({
            where: {
                id_usuario,
                data: { [Op.between]: [data_inicio, data_fim] },
            },
            include: [{ model: Categoria, as: 'categoria' }],
        });

        // 2. BUSCA GLOBAL (Para o Saldo/Patrimônio Total)
        const todasTransacoes = await Transacao.findAll({
            where: { id_usuario },
            include: [{ model: Categoria, as: 'categoria' }],
        });

        // 3. BUSCA DAS ÚLTIMAS TRANSAÇÕES (Com Categoria e Cartão de Crédito)
        const ultimasTransacoes = await Transacao.findAll({
            where: { id_usuario },
            include: [
                {
                    model: Categoria,
                    as: 'categoria',
                    attributes: ['nome', 'tipo', 'status'],
                },
                {
                    model: Cartao,
                    as: 'cartao',
                    attributes: ['id_cartao', 'nome', 'bandeira'],
                    required: false,
                },
            ],
            order: [
                ['data', 'DESC'],
                ['id_transacao', 'DESC'],
            ],
            limit: 5,
        });

        // Cálculos do Mês
        let entradasMes = 0;
        let saidasMes = 0;
        transacoesMes.forEach((t) => {
            const valor = Math.abs(parseFloat(t.valor)) || 0;
            const tipo = t.categoria?.tipo?.toLowerCase();
            if (tipo === 'receita') entradasMes += valor;
            else if (tipo === 'despesa') saidasMes += valor;
        });

        // Cálculo do Patrimônio Total
        let entradasTotal = 0;
        let saidasTotal = 0;
        todasTransacoes.forEach((t) => {
            const valor = Math.abs(parseFloat(t.valor)) || 0;
            const tipo = t.categoria?.tipo?.toLowerCase();
            if (tipo === 'receita') entradasTotal += valor;
            else if (tipo === 'despesa') saidasTotal += valor;
        });

        return res.json({
            entradas: parseFloat(entradasMes.toFixed(2)),
            saidas: parseFloat(saidasMes.toFixed(2)),
            saldo: parseFloat((entradasTotal - saidasTotal).toFixed(2)),
            totalTransacoesPeriodo: transacoesMes.length,
            ultimasTransacoes, // <-- Transações recentes já com o objeto 'cartao'
        });
    } catch (error) {
        console.error('Erro no DashboardController:', error);
        return res.status(500).json({ error: 'Erro ao gerar resumo.', detalhes: error.message });
    }
};