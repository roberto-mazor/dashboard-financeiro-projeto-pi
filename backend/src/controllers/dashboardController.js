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
            const valor = parseFloat(t.valor) || 0;
            
            // Log temporário para debug: vamos ver o que o Sequelize está trazendo
            // console.log('Transacao:', t.id_transacao, 'Categoria:', t.Categoria);

            // Verifica se a categoria existe e soma de acordo com o tipo
            if (t.Categoria) {
                if (t.Categoria.tipo === 'Receita') {
                    totalReceitas += valor;
                } else if (t.Categoria.tipo === 'Despesa') {
                    totalDespesas += valor;
                }
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