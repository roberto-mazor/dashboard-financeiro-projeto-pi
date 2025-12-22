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

// Editar uma transação existente
exports.editarTransacao = async (req, res) => {
    try {
        const { id } = req.params;
        const { valor, data, descricao, id_categoria } = req.body;
        const id_usuario = req.usuario.id;

        // Verifica se a transação pertence ao usuário
        const transacao = await Transacao.findOne({ where: { id_transacao: id, id_usuario } });

        if (!transacao) {
            return res.status(404).json({ error: 'Transação não encontrada.' });
        }

        // Se o usuário estiver mudando a categoria, verifica se a nova categoria existe
        if (id_categoria) {
            const categoriaExistente = await Categoria.findOne({ where: { id_categoria, id_usuario } });
            if (!categoriaExistente) {
                return res.status(404).json({ error: 'Nova categoria não encontrada.' });
            }
        }

        // Atualiza os campos (mantém o original se o campo não for enviado)
        transacao.valor = valor || transacao.valor;
        transacao.data = data || transacao.data;
        transacao.descricao = descricao || transacao.descricao;
        transacao.id_categoria = id_categoria || transacao.id_categoria;

        await transacao.save();

        res.json({ message: 'Transação atualizada com sucesso!', transacao });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao editar transação.' });
    }
};