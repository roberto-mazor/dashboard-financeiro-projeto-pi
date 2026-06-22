const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Usuario = require('./Usuario');
const Categoria = require('./Categoria');
const Cartao = require('./Cartao');

const Transacao = sequelize.define('Transacao', {
  id_transacao: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  valor: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  data: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  descricao: {
    type: DataTypes.STRING(255),
  },
  // Chave estrangeira opcional associada ao cartão
  id_cartao: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'cartoes',
      key: 'id_cartao',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  },
}, {
  tableName: 'transacoes',
  timestamps: true,
});

// Relacionamentos
Transacao.belongsTo(Usuario, { foreignKey: 'id_usuario' });
Transacao.belongsTo(Categoria, { foreignKey: 'id_categoria', as: 'categoria' });
Transacao.belongsTo(Cartao, { foreignKey: 'id_cartao', as: 'cartao' });

module.exports = Transacao;