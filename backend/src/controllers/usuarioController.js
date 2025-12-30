// src/controllers/usuarioController.js
const Usuario = require('../models/Usuario');
const Categoria = require('../models/Categoria'); // Importe o modelo de Categoria
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registrar = async (req, res) => {
    try {
        const { nome, email, senha } = req.body;

        // 1. Verificar se o usuário já existe
        const usuarioExistente = await Usuario.findOne({ where: { email } });
        if (usuarioExistente) {
            return res.status(400).json({ error: 'Este e-mail já está em uso.' });
        }

        // 2. Criptografar a senha
        const salt = await bcrypt.genSalt(10);
        const senha_hash = await bcrypt.hash(senha, salt);

        // 3. Criar o usuário no banco (Neon PostgreSQL)
        const novoUsuario = await Usuario.create({
            nome,
            email,
            senha_hash
        });

        // Criar categorias padrão para o novo usuário
        await Categoria.bulkCreate([
            { id_usuario: novoUsuario.id_usuario, nome: 'Alimentação', tipo: 'despesa' },
            { id_usuario: novoUsuario.id_usuario, nome: 'Salário', tipo: 'receita' },
            { id_usuario: novoUsuario.id_usuario, nome: 'Lazer', tipo: 'despesa' },
            { id_usuario: novoUsuario.id_usuario, nome: 'Educação', tipo: 'despesa' },
            { id_usuario: novoUsuario.id_usuario, nome: 'Investimentos', tipo: 'receita' }
        ]);

        res.status(201).json({ 
            message: 'Usuário criado com sucesso!', 
            id: novoUsuario.id_usuario 
        });
    } catch (error) {
        console.error('Erro no registro:', error);
        res.status(500).json({ error: 'Erro ao registrar usuário.' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, senha } = req.body;

        // 1. Buscar usuário
        const usuario = await Usuario.findOne({ where: { email } });
        if (!usuario) {
            return res.status(401).json({ error: 'E-mail ou senha inválidos.' });
        }

        // 2. Verificar senha
        const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
        if (!senhaValida) {
            return res.status(401).json({ error: 'E-mail ou senha inválidos.' });
        }

        // 3. Gerar Token JWT
        const token = jwt.sign(
            { id: usuario.id_usuario }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' }
        );

        res.json({
            message: 'Login realizado com sucesso!',
            token,
            user: { id: usuario.id_usuario, nome: usuario.nome } // Alterado para 'user' para bater com o localStorage.setItem('user', ...)
        });
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ error: 'Erro ao realizar login.' });
    }
};