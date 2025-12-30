// src/controllers/usuarioController.js
const Usuario = require('../models/Usuario');
const Categoria = require('../models/Categoria');
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

        // 🚀 PROTEÇÃO: Criar categorias padrão dentro de um try/catch isolado
        // Isso evita que um erro bobo de DB aborte todo o registro do usuário
        try {
            await Categoria.bulkCreate([
                { id_usuario: novoUsuario.id_usuario, nome: 'Alimentação', tipo: 'Despesa' },
                { id_usuario: novoUsuario.id_usuario, nome: 'Salário', tipo: 'Receita' },    
                { id_usuario: novoUsuario.id_usuario, nome: 'Lazer', tipo: 'Despesa' },
                { id_usuario: novoUsuario.id_usuario, nome: 'Educação', tipo: 'Despesa' },
                { id_usuario: novoUsuario.id_usuario, nome: 'Investimentos', tipo: 'Receita' }
            ]);
            console.log(`Categorias criadas para o usuário: ${novoUsuario.id_usuario}`);
        } catch (catError) {
            console.error('Falha ao criar categorias iniciais, mas o usuário foi registrado:', catError);
            // Não enviamos erro 500 aqui para o usuário conseguir logar mesmo assim
        }

        res.status(201).json({ 
            message: 'Usuário criado com sucesso!', 
            id: novoUsuario.id_usuario 
        });
    } catch (error) {
        console.error('Erro fatal no registro:', error);
        res.status(500).json({ error: 'Erro interno ao processar o cadastro.' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, senha } = req.body;

        const usuario = await Usuario.findOne({ where: { email } });
        if (!usuario) {
            return res.status(401).json({ error: 'E-mail ou senha inválidos.' });
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
        if (!senhaValida) {
            return res.status(401).json({ error: 'E-mail ou senha inválidos.' });
        }

        const token = jwt.sign(
            { id: usuario.id_usuario }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' }
        );

        res.json({
            message: 'Login realizado com sucesso!',
            token,
            user: { id: usuario.id_usuario, nome: usuario.nome }
        });
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ error: 'Erro ao realizar login.' });
    }
};