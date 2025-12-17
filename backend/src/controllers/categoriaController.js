const Categoria = require('../models/Categoria');

// Criar nova categoria
exports.criarCategoria = async (req, res) => {
    try {
        const { nome, tipo } = req.body;
        const id_usuario = req.usuario.id; // Pego direto do Token!

        const novaCategoria = await Categoria.create({
            nome,
            tipo,
            id_usuario
        });

        res.status(201).json(novaCategoria);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar categoria.' });
    }
};

// Listar categorias do usuário logado
exports.listarCategorias = async (req, res) => {
    try {
        const id_usuario = req.usuario.id;
        const categorias = await Categoria.findAll({ where: { id_usuario } });
        res.json(categorias);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar categorias.' });
    }
};