// src/controllers/usuarioController.js
const Usuario = require('../models/Usuario');
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

        // 3. Criar o usuário no banco
        const novoUsuario = await Usuario.create({
            nome,
            email,
            senha_hash
        });

        res.status(201).json({ message: 'Usuário criado com sucesso!', id: novoUsuario.id_usuario });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao registrar usuário.' });
    }
};