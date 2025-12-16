const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Usuario = require('./Usuario');
const Categoria = require('./Categoria');

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
}, {
  tableName: 'transacoes',
  timestamps: true,
});

// Relacionamentos
Transacao.belongsTo(Usuario, { foreignKey: 'id_usuario' });
Transacao.belongsTo(Categoria, { foreignKey: 'id_categoria' });

module.exports = Transacao;