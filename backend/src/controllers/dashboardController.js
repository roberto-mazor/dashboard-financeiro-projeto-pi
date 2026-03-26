// src/controllers/dashboardController.js
const Transacao = require('../models/Transacao');
const Categoria = require('../models/Categoria');
const { Op } = require('sequelize');

exports.getResumo = async (req, res) => {
    try {
        const id_usuario = req.usuario?.id || req.user?.id;
        const { data_inicio, data_fim } = req.query;

        // 1. BUSCA FILTRADA (Para Entradas e Saídas do Mês)
        const transacoesMes = await Transacao.findAll({
            where: {
                id_usuario,
                data: { [Op.between]: [new Date(data_inicio + 'T00:00:00Z'), new Date(data_fim + 'T23:59:59Z')] }
            },
            include: [{ model: Categoria, as: 'categoria' }]
        });

        // 2. BUSCA GLOBAL (Para o Saldo/Patrimônio Total)
        // Aqui não usa o filtro de data, apenas o de usuário
        const todasTransacoes = await Transacao.findAll({
            where: { id_usuario },
            include: [{ model: Categoria, as: 'categoria' }]
        });

        // Cálculos do Mês
        let entradasMes = 0;
        let saidasMes = 0;
        transacoesMes.forEach(t => {
            const valor = Math.abs(parseFloat(t.valor)) || 0;
            const tipo = t.categoria?.tipo?.toLowerCase();
            if (tipo === 'receita') entradasMes += valor;
            else if (tipo === 'despesa') saidasMes += valor;
        });

        // Cálculo do Patrimônio Total (Saldo Acumulado)
        let entradasTotal = 0;
        let saidasTotal = 0;
        todasTransacoes.forEach(t => {
            const valor = Math.abs(parseFloat(t.valor)) || 0;
            const tipo = t.categoria?.tipo?.toLowerCase();
            if (tipo === 'receita') entradasTotal += valor;
            else if (tipo === 'despesa') saidasTotal += valor;
        });

        res.json({
            entradas: parseFloat(entradasMes.toFixed(2)),   // Filtrado
            saidas: parseFloat(saidasMes.toFixed(2)),       // Filtrado
            saldo: parseFloat((entradasTotal - saidasTotal).toFixed(2)), // ACUMULADO (Patrimônio)
            totalTransacoesPeriodo: transacoesMes.length
        });
        
    } catch (error) {
        console.error('Erro no DashboardController:', error);
        res.status(500).json({ error: 'Erro ao gerar resumo.' });
    }
};