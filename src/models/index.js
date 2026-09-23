const User = require('./User');
const Order = require('./Order');
const AuditLog = require('./AuditLog');

// Definición de Relación 1:N (Usuario tiene muchos Pedidos)
User.hasMany(Order, { foreignKey: 'usuarioId', as: 'pedidos', onDelete: 'CASCADE' });
Order.belongsTo(User, { foreignKey: 'usuarioId', as: 'usuario' });

// Relación para logs de auditoría
User.hasMany(AuditLog, { foreignKey: 'usuarioId', as: 'logs' });
AuditLog.belongsTo(User, { foreignKey: 'usuarioId', as: 'usuario' });

module.exports = {
  User,
  Order,
  AuditLog
};
