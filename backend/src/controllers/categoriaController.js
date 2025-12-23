const Categoria = require('../models/Categoria');

// Criar nova categoria
exports.criarCategoria = async (req, res) => {
    try {
        const { nome, tipo } = req.body;
        const id_usuario = req.usuario.id;

        // Formatação para garantir compatibilidade com o ENUM('Receita', 'Despesa')
        const tipoFormatado = tipo.charAt(0).toUpperCase() + tipo.slice(1).toLowerCase();

        const novaCategoria = await Categoria.create({
            nome,
            tipo: tipoFormatado,
            id_usuario
        });

        res.status(201).json(novaCategoria);
    } catch (error) {
        console.error('Erro ao criar categoria:', error);
        res.status(500).json({ error: 'Erro ao criar categoria no banco de dados.' });
    }
};

// Listar categorias do usuário logado
exports.listarCategorias = async (req, res) => {
    try {
        const id_usuario = req.usuario.id;
        const categorias = await Categoria.findAll({ 
            where: { id_usuario },
            order: [['nome', 'ASC']] 
        });
        res.json(categorias);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar categorias.' });
    }
};

// Editar uma categoria existente
exports.editarCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, tipo } = req.body;
        const id_usuario = req.usuario.id;

        const categoria = await Categoria.findOne({ where: { id_categoria: id, id_usuario } });

        if (!categoria) {
            return res.status(404).json({ error: 'Categoria não encontrada.' });
        }

        // Formata o tipo se ele for enviado
        if (tipo) {
            categoria.tipo = tipo.charAt(0).toUpperCase() + tipo.slice(1).toLowerCase();
        }
        
        categoria.nome = nome || categoria.nome;
        await categoria.save();

        res.json({ message: 'Categoria atualizada com sucesso!', categoria });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao editar categoria.' });
    }
};

// Deletar uma categoria
exports.deletarCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        const id_usuario = req.usuario.id;

        const deletado = await Categoria.destroy({
            where: { id_categoria: id, id_usuario }
        });

        if (!deletado) return res.status(404).json({ error: 'Categoria não encontrada.' });

        res.json({ message: 'Categoria eliminada com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao eliminar categoria.' });
    }
};