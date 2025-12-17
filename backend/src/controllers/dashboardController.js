// src/controllers/dashboardController.js
const Transacao = require('../models/Transacao');
const Categoria = require('../models/Categoria');

exports.getResumo = async (req, res) => {
    try {
        const id_usuario = req.usuario.id;

        const transacoes = await Transacao.findAll({
            where: { id_usuario },
            include: [{
                model: Categoria,
                as: 'categoria' // DEVE ser igual ao que está no model
            }]
        });

        let totalReceitas = 0;
        let totalDespesas = 0;

        transacoes.forEach(t => {
            if (t.categoria) {
                const valor = parseFloat(t.valor) || 0;
                const tipoReal = t.categoria.tipo;
                const nomeCat = t.categoria.nome; // Vamos ver o nome!

                if (tipoReal === 'Receita') {
                    totalReceitas += valor;
                } else if (tipoReal === 'Despesa') {
                    totalDespesas += valor;
                }
            }
        });

        res.json({
            totalReceitas: totalReceitas.toFixed(2),
            totalDespesas: totalDespesas.toFixed(2),
            saldoAtual: (totalReceitas - totalDespesas).toFixed(2),
            totalTransacoes: transacoes.length
        });
    } catch (error) {
        // MUITO IMPORTANTE: Esse log vai nos dizer o erro real se falhar de novo
        console.error("ERRO NO DASHBOARD:", error); 
        res.status(500).json({ error: 'Erro ao gerar resumo.' });
    }
};