// src/controllers/dashboardController.js
const Transacao = require('../models/Transacao');
const Categoria = require('../models/Categoria');
const { Op } = require('sequelize'); // Importar o Operador do Sequelize

exports.getResumo = async (req, res) => {
    try {
        const id_usuario = req.usuario.id;
        const { mes, ano } = req.query; // Pegar os filtros da URL

        let filtroData = { id_usuario };

        // Se o usuário enviar mes e ano, filtra o período
        if (mes && ano) {
            const dataInicio = new Date(ano, mes - 1, 1);
            const dataFim = new Date(ano, mes, 0); // Último dia do mês

            filtroData.data = {
                [Op.between]: [dataInicio, dataFim]
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
            if (t.categoria) {
                const valor = parseFloat(t.valor) || 0;
                const tipo = t.categoria.tipo.toLowerCase();
                if (tipo === 'receita') totalReceitas += valor;
                else if (tipo === 'despesa') totalDespesas += valor;
            }
        });

        res.json({
            totalReceitas: totalReceitas.toFixed(2),
            totalDespesas: totalDespesas.toFixed(2),
            saldoAtual: (totalReceitas - totalDespesas).toFixed(2),
            totalTransacoes: transacoes.length,
            periodo: mes && ano ? `${mes}/${ano}` : "Tudo"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao gerar resumo filtrado.' });
    }
};