// src/controllers/dashboardController.js
const Transacao = require('../models/Transacao');
const Categoria = require('../models/Categoria');

exports.getResumo = async (req, res) => {
    try {
        const id_usuario = req.usuario.id;

        const transacoes = await Transacao.findAll({
            where: { id_usuario },
            // 🚨 Importante: Garantir que o nome do Model no include esteja correto
            include: [{ 
                model: Categoria, 
                attributes: ['tipo'] 
            }]
        });

        let totalReceitas = 0;
        let totalDespesas = 0;

        transacoes.forEach(t => {
            // Convertemos para número para evitar erros de soma de strings
            const valor = parseFloat(t.valor) || 0;
            
            // Verificamos se a categoria existe antes de acessar o tipo
            if (t.Categoria && t.Categoria.tipo === 'Receita') {
                totalReceitas += valor;
            } else if (t.Categoria && t.Categoria.tipo === 'Despesa') {
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
        console.error("Erro detalhado:", error); // Isso vai mostrar o erro real no seu terminal
        res.status(500).json({ error: 'Erro ao gerar resumo do dashboard.' });
    }
};