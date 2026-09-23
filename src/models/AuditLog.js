const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const AuditLog = sequelize.define('AuditLog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  accion: {
    type: DataTypes.STRING,
    allowNull: false
  },
  detalles: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'historial_auditoria',
  timestamps: true
});

module.exports = AuditLog;
