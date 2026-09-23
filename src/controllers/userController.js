const { User, Order, AuditLog } = require('../models');
const { sequelize } = require('../config/database');
const { logFailedTransaction } = require('../services/fileLogger');
const { Op } = require('sequelize');

// 1. Obtener todos los usuarios (con paginación y filtro opcional por query params)
exports.getUsers = async (req, res) => {
  try {
    const { nombre, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (nombre) {
      whereClause.nombre = { [Op.iLike]: `%${nombre}%` };
    }

    const { count, rows } = await User.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['id', 'ASC']]
    });

    return res.status(200).json({
      status: 'success',
      message: 'Usuarios obtenidos exitosamente.',
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit),
      data: rows
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Error al consultar usuarios.',
      error: error.message
    });
  }
};

// 2. Obtener un usuario por ID con sus pedidos asociados (Relaciones Lección 6)
exports.getUserWithOrders = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      include: [
        {
          model: Order,
          as: 'pedidos',
          attributes: ['id', 'producto', 'monto', 'estado', 'createdAt']
        }
      ]
    });

    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: `No se encontró el usuario con ID: ${id}`
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Usuario y sus pedidos asociados obtenidos con éxito.',
      data: user
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Error al consultar el usuario y sus pedidos.',
      error: error.message
    });
  }
};

// 3. Crear usuario
exports.createUser = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Por favor proporcione nombre, email y contraseña.'
      });
    }

    const newUser = await User.create({ nombre, email, password, rol });

    return res.status(201).json({
      status: 'success',
      message: 'Usuario creado exitosamente.',
      data: newUser
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        status: 'fail',
        message: 'El correo electrónico ya está registrado.'
      });
    }
    return res.status(500).json({
      status: 'error',
      message: 'Error al crear el usuario.',
      error: error.message
    });
  }
};

// 4. Actualizar usuario (Lección 3)
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email, rol, activo } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: `No existe usuario con el ID ${id} para actualizar.`
      });
    }

    // Actualización de campos permitidos
    await user.update({
      nombre: nombre !== undefined ? nombre : user.nombre,
      email: email !== undefined ? email : user.email,
      rol: rol !== undefined ? rol : user.rol,
      activo: activo !== undefined ? activo : user.activo
    });

    return res.status(200).json({
      status: 'success',
      message: `Usuario con ID ${id} actualizado correctamente.`,
      data: user
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Error al actualizar el usuario.',
      error: error.message
    });
  }
};

// 5. Eliminar usuario (Lección 3)
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: `No existe usuario con el ID ${id} para eliminar.`
      });
    }

    await user.destroy();

    return res.status(200).json({
      status: 'success',
      message: `Usuario con ID ${id} eliminado exitosamente de la base de datos.`
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Error al eliminar el usuario.',
      error: error.message
    });
  }
};

// 6. Registro Transaccional (Lección 4 - Transacciones y Rollback con Log en archivo plano)
exports.registerUserWithAuditTransaction = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { nombre, email, password, rol, forceError } = req.body;

    // Acción 1: Crear Usuario
    const user = await User.create({ nombre, email, password, rol }, { transaction });

    // Acción 2: Crear entrada de auditoría obligatoria
    await AuditLog.create({
      usuarioId: user.id,
      accion: 'REGISTRO_INICIAL',
      detalles: `Usuario ${user.nombre} registrado correctamente en el sistema.`
    }, { transaction });

    // Simulación voluntaria de fallo para demostrar Rollback
    if (forceError) {
      throw new Error('Error forzado para prueba de transaccionalidad y rollback automático.');
    }

    // Confirmar transacción si todo salió bien
    await transaction.commit();

    return res.status(201).json({
      status: 'success',
      message: 'Transacción completada: Usuario y registro de auditoría creados exitosamente.',
      data: user
    });
  } catch (error) {
    // Deshacer todos los cambios en caso de fallo
    await transaction.rollback();

    // Registrar fallo en el archivo plano de logs
    logFailedTransaction('REGISTRO_USUARIO_CON_AUDITORIA', error);

    return res.status(400).json({
      status: 'fail',
      message: 'La transacción falló y se ejecutó un Rollback. Los datos no sufrieron cambios.',
      error: error.message
    });
  }
};

// 7. Comparación de SQL manual vs Sequelize (Lección 5)
exports.compareSQLAndORM = async (req, res) => {
  try {
    const { compareSQLAndORM: compare } = require('../services/sqlComparison');
    const resultado = await compare();

    return res.status(200).json({
      status: 'success',
      message: 'Comparación entre SQL manual y Sequelize realizada correctamente.',
      data: resultado
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'No fue posible comparar SQL manual y Sequelize.',
      error: error.message
    });
  }
};
