const { Order, User } = require('../models');

const parseId = (id) => Number.parseInt(id, 10);

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [{ model: User, as: 'usuario', attributes: ['id', 'nombre', 'email'] }],
      order: [['id', 'ASC']]
    });
    res.status(200).json({ status: 'success', message: 'Pedidos obtenidos correctamente.', data: orders });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al consultar pedidos.', error: error.message });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { producto, monto, estado = 'pendiente', usuarioId } = req.body;
    if (!producto || monto === undefined || !usuarioId) {
      return res.status(400).json({ status: 'fail', message: 'producto, monto y usuarioId son obligatorios.' });
    }
    const user = await User.unscoped().findByPk(usuarioId);
    if (!user) return res.status(404).json({ status: 'fail', message: 'El usuario indicado no existe.' });

    const order = await Order.create({ producto, monto, estado, usuarioId });
    res.status(201).json({ status: 'success', message: 'Pedido creado correctamente.', data: order });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: 'No fue posible crear el pedido.', error: error.message });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ status: 'fail', message: 'El ID debe ser numérico.' });
    const order = await Order.findByPk(id);
    if (!order) return res.status(404).json({ status: 'fail', message: `No existe pedido con ID ${id}.` });

    const { producto, monto, estado, usuarioId } = req.body;
    if (usuarioId !== undefined) {
      const user = await User.unscoped().findByPk(usuarioId);
      if (!user) return res.status(404).json({ status: 'fail', message: 'El usuario indicado no existe.' });
    }
    await order.update({ producto, monto, estado, usuarioId });
    res.status(200).json({ status: 'success', message: 'Pedido actualizado correctamente.', data: order });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: 'No fue posible actualizar el pedido.', error: error.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ status: 'fail', message: 'El ID debe ser numérico.' });
    const order = await Order.findByPk(id);
    if (!order) return res.status(404).json({ status: 'fail', message: `No existe pedido con ID ${id}.` });
    await order.destroy();
    res.status(200).json({ status: 'success', message: `Pedido con ID ${id} eliminado correctamente.` });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'No fue posible eliminar el pedido.', error: error.message });
  }
};
