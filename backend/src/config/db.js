const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: false,
});

// 1. Importar os modelos de forma limpa
const Usuario = require('../models/Usuario');
const Categoria = require('../models/Categoria');
const Transacao = require('../models/Transacao');
const Cartao = require('../models/Cartao');

// 2. Definir as Associações centralizadas (Sem dependência circular)

// Relacionamentos do Usuário
Usuario.hasMany(Transacao, { foreignKey: 'id_usuario' });
Usuario.hasMany(Categoria, { foreignKey: 'id_usuario' });
Usuario.hasMany(Cartao, { foreignKey: 'id_usuario' });

// Relacionamentos da Transação
Transacao.belongsTo(Usuario, { foreignKey: 'id_usuario' });
Transacao.belongsTo(Categoria, { foreignKey: 'id_categoria' });
Transacao.belongsTo(Cartao, { foreignKey: 'id_cartao' });

// Relacionamentos da Categoria
Categoria.belongsTo(Usuario, { foreignKey: 'id_usuario' });
Categoria.hasMany(Transacao, { foreignKey: 'id_categoria' });

// Relacionamentos do Cartão
Cartao.belongsTo(Usuario, { foreignKey: 'id_usuario' });
Cartao.hasMany(Transacao, { foreignKey: 'id_cartao' });

module.exports = {
  sequelize,
  Usuario,
  Categoria,
  Transacao,
  Cartao
};