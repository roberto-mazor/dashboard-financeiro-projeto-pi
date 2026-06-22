const { Sequelize } = require('sequelize');
require('dotenv').config();

// 1. PRIMEIRO: Inicializa a instância do Sequelize
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

// 2. SEGUNDO: Exporta a instância para que os models consigam ler o .define() sem vir undefined
module.exports = { sequelize };

// 3. TERCEIRO: Importa os modelos APÓS o module.exports (evita o travamento)
const Usuario = require('../models/Usuario');
const Categoria = require('../models/Categoria');
const Transacao = require('../models/Transacao');
const Cartao = require('../models/Cartao');

// 4. QUARTO: Aplica as associações centralizadas
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

// 5. QUINTO: Adiciona os modelos ao objeto já exportado, se precisar usá-los fora daqui
Object.assign(module.exports, {
  Usuario,
  Categoria,
  Transacao,
  Cartao
});