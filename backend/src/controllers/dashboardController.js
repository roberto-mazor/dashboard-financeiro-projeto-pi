// src/controllers/dashboardController.js
const Transacao = require('../models/Transacao');
const Categoria = require('../models/Categoria');
const { Op } = require('sequelize');

exports.getResumo = async (req, res) => {
    try {
        // 1. AJUSTE: Verifique se no seu authMiddleware você salva como 'req.usuario' ou 'req.user'
        const id_usuario = req.usuario?.id || req.user?.id;

        if (!id_usuario) {
            return res.status(401).json({ error: 'Usuário não identificado.' });
        }

        const { mes, ano } = req.query;
        let filtroData = { id_usuario };

        if (mes && ano) {
            // Garante que o fuso horário não "coma" o primeiro ou último dia
            const dataInicio = new Date(Date.UTC(ano, mes - 1, 1, 0, 0, 0));
            const dataFim = new Date(Date.UTC(ano, mes, 0, 23, 59, 59));

            filtroData.data = {
                [Op.between]: [dataInicio, dataFim]
            };
        }

        const transacoes = await Transacao.findAll({
            where: filtroData,
            include: [{
                model: Categoria,
                as: 'categoria' // Certifique-on de que a associação no models/index.js usa esse 'as'
            }]
        });

        let totalReceitas = 0;
        let totalDespesas = 0;

        transacoes.forEach(t => {
            // 2. AJUSTE: Verificação defensiva do valor e do tipo
            const valor = parseFloat(t.valor) || 0;
            
            // Verifique se o seu banco salva o tipo na Categoria ou na Transação
            const tipo = t.categoria?.tipo?.toLowerCase() || t.tipo?.toLowerCase();

            if (tipo === 'receita') totalReceitas += valor;
            else if (tipo === 'despesa') totalDespesas += valor;
        });

        // 3. RETORNO: Ajustado para bater com os nomes das variáveis do seu Dashboard.jsx
        res.json({
            entradas: parseFloat(totalReceitas.toFixed(2)),
            saidas: parseFloat(totalDespesas.toFixed(2)),
            saldo: parseFloat((totalReceitas - totalDespesas).toFixed(2)),
            totalTransacoes: transacoes.length,
            periodo: mes && ano ? `${mes}/${ano}` : "Tudo"
        });
    } catch (error) {
        console.error('Erro no DashboardController:', error);
        res.status(500).json({ error: 'Erro ao gerar resumo filtrado.' });
    }
};