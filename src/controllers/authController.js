const jwt = require('jsonwebtoken');
const { User } = require('../models');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Email y contraseña son obligatorios.'
      });
    }

    const user = await User.scope('withPassword').findOne({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({
        status: 'fail',
        message: 'Credenciales incorrectas.'
      });
    }

    if (!user.activo) {
      return res.status(403).json({
        status: 'fail',
        message: 'El usuario se encuentra inactivo.'
      });
    }

    if (user.password !== password) {
      return res.status(401).json({
        status: 'fail',
        message: 'Credenciales incorrectas.'
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        rol: user.rol
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h'
      }
    );

    return res.status(200).json({
      status: 'success',
      message: 'Login exitoso.',
      data: {
        token,
        expiresIn: '1h',
        usuario: {
          id: user.id,
          nombre: user.nombre,
          email: user.email,
          rol: user.rol
        }
      }
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Error al iniciar sesión.',
      error: error.message
    });
  }
};