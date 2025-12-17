const Transacao = require('../models/Transacao');
const Categoria = require('../models/Categoria');

// Criar uma nova transação (Receita ou Despesa)
exports.criarTransacao = async (req, res) => {
    try {
        const { valor, data, descricao, id_categoria } = req.body;
        const id_usuario = req.usuario.id;

        // Validar se a categoria existe e pertence ao usuário
        const categoria = await Categoria.findOne({ where: { id_categoria, id_usuario } });
        if (!categoria) {
            return res.status(404).json({ error: 'Categoria não encontrada ou não pertence ao usuário.' });
        }

        const novaTransacao = await Transacao.create({
            valor,
            data,
            descricao,
            id_categoria,
            id_usuario
        });

        res.status(201).json(novaTransacao);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao registrar transação.' });
    }
};

// Listar transações do usuário (com filtros futuros)
exports.listarTransacoes = async (req, res) => {
    try {
        const id_usuario = req.usuario.id;
        
        // Buscamos as transações incluindo os dados da categoria associada
        const transacoes = await Transacao.findAll({
            where: { id_usuario },
            include: [{ model: Categoria, attributes: ['nome', 'tipo'] }],
            order: [['data', 'DESC']] // Mais recentes primeiro
        });

        res.json(transacoes);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar transações.' });
    }
};

// Deletar transação
exports.deletarTransacao = async (req, res) => {
    try {
        const { id } = req.params;
        const id_usuario = req.usuario.id;

        const deletado = await Transacao.destroy({
            where: { id_transacao: id, id_usuario }
        });

        if (!deletado) return res.status(404).json({ error: 'Transação não encontrada.' });

        res.json({ message: 'Transação removida com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao remover transação.' });
    }
};