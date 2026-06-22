const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

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

// Nota: Os relacionamentos belongsTo(Usuario), belongsTo(Categoria) e belongsTo(Cartao) 
// foram centralizados no arquivo db.js para extinguir a dependência circular.

module.exports = Transacao;