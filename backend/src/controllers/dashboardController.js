// src/controllers/dashboardController.js
const Transacao = require('../models/Transacao');
const Categoria = require('../models/Categoria');
const { Op } = require('sequelize');

exports.getResumo = async (req, res) => {
    try {
        // Pega o ID do usuário (ajustado para as duas possibilidades comuns)
        const id_usuario = req.usuario?.id || req.user?.id;

        if (!id_usuario) {
            return res.status(401).json({ error: 'Usuário não identificado.' });
        }

        // --- ALTERAÇÃO AQUI: Agora lemos data_inicio e data_fim ---
        const { data_inicio, data_fim } = req.query;
        let filtroData = { id_usuario };

        if (data_inicio && data_fim) {
            // Criamos o filtro de data baseado no intervalo enviado pelo Frontend
            // Adicionamos o horário para garantir que pegue o dia inteiro (00:00 até 23:59)
            filtroData.data = {
                [Op.between]: [
                    new Date(data_inicio + 'T00:00:00Z'),
                    new Date(data_fim + 'T23:59:59Z')
                ]
            };
        }

        const transacoes = await Transacao.findAll({
            where: filtroData,
            include: [{
                model: Categoria,
                as: 'categoria' 
            }]
        });

        let totalReceitas = 0;
        let totalDespesas = 0;

        transacoes.forEach(t => {
            const valor = Math.abs(parseFloat(t.valor)) || 0;
            const tipo = t.categoria?.tipo?.toLowerCase();

            if (tipo === 'receita') {
                totalReceitas += valor;
            } else if (tipo === 'despesa') {
                totalDespesas += valor;
            }
        });

        res.json({
            entradas: parseFloat(totalReceitas.toFixed(2)),
            saidas: parseFloat(totalDespesas.toFixed(2)),
            saldo: parseFloat((totalReceitas - totalDespesas).toFixed(2)),
            totalTransacoes: transacoes.length
        });
        
    } catch (error) {
        console.error('Erro no DashboardController:', error);
        res.status(500).json({ error: 'Erro ao gerar resumo filtrado.' });
    }
};