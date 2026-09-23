const { sequelize } = require('../config/database');
const { User, Order } = require('../models');

const seedDatabase = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('🌱 Base de datos reiniciada para datos semilla.');

    const u1 = await User.create({
      nombre: 'Juan Pérez',
      email: 'juan.perez@empresa.com',
      password: 'password123',
      rol: 'admin'
    });

    const u2 = await User.create({
      nombre: 'María Gómez',
      email: 'maria.gomez@empresa.com',
      password: 'password123',
      rol: 'desarrollador'
    });

    const u3 = await User.create({
      nombre: 'Carlos Rodríguez',
      email: 'carlos.rodriguez@empresa.com',
      password: 'password123',
      rol: 'usuario'
    });

    await Order.create({
      producto: 'Licencia Software Backend Pro',
      monto: 299.99,
      estado: 'completado',
      usuarioId: u1.id
    });

    await Order.create({
      producto: 'Servicio Cloud Database 1 Mes',
      monto: 85.50,
      estado: 'completado',
      usuarioId: u1.id
    });

    await Order.create({
      producto: 'Dominio Web .COM',
      monto: 15.00,
      estado: 'pendiente',
      usuarioId: u2.id
    });

    console.log('✅ Datos semilla insertados con éxito (3 usuarios y 3 pedidos).');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al insertar datos semilla:', error);
    process.exit(1);
  }
};

seedDatabase();
