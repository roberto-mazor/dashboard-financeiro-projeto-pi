const Categoria = require('../models/Categoria');

// Criar nova categoria
exports.criarCategoria = async (req, res) => {
    try {
        let { nome, tipo } = req.body;
        const id_usuario = req.usuario.id;
        if (tipo) {
            tipo = tipo.charAt(0).toUpperCase() + tipo.slice(1).toLowerCase();
        }

        const categoriaExistente = await Categoria.findOne({ where: { nome, id_usuario } });

        if (categoriaExistente) {
            if (categoriaExistente.status === 0) {
                categoriaExistente.status = 1;
                categoriaExistente.tipo = tipo;
                await categoriaExistente.save();
                return res.status(200).json(categoriaExistente);
            }
            return res.status(400).json({ error: 'Categoria já ativa.' });
        }

        const nova = await Categoria.create({ 
            nome, 
            tipo, 
            id_usuario, 
            status: 1 
        });

        res.status(201).json(nova);
    } catch (error) {
        console.error("Erro detalhado no Controller:", error);
        res.status(500).json({ error: 'Erro ao criar categoria.' });
    }
};

// Listar categorias do usuário logado
exports.listarCategorias = async (req, res) => {
    try {
        const id_usuario = req.usuario.id;
        const categorias = await Categoria.findAll({ 
            where: { id_usuario, status: 1 }, // Retorna apenas as ativas
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

        await Categoria.update(
            { status: 0 }, 
            { where: { id_categoria: id, id_usuario } }
        );

        res.json({ message: 'Categoria removida com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao remover categoria.' });
    }
};