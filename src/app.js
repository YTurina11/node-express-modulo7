const express = require('express');
const { connectDB, sequelize } = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Archivos estáticos
app.use(express.static('public'));

// Ruta raíz de prueba
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'online',
    message: 'Servidor Express corriendo - Proyecto Evaluación Módulo 7',
    endpoints: {
      usuarios: '/api/usuarios',
      usuarios_con_pedidos: '/api/usuarios/:id/pedidos',
      transaccion_demo: 'POST /api/usuarios/transaccion-registro'
    }
  });
});

// Rutas de la API
app.use('/api/usuarios', userRoutes);
app.use('/api/pedidos', orderRoutes);

// Manejo de rutas no encontradas (404)
app.use((req, res) => {
  res.status(404).json({
    status: 'fail',
    message: 'Ruta no encontrada en el servidor.'
  });
});

// Inicialización de la base de datos y el servidor
const startServer = async () => {
  await connectDB();
  
  // Sincronización de modelos con la BD
  await sequelize.sync({ alter: true });
  console.log('✅ [ORM] Modelos sincronizados con la base de datos.');

  app.listen(PORT, () => {
    console.log(`🚀 [SERVER] Servidor ejecutándose en http://localhost:${PORT}`);
  });
};

startServer();
