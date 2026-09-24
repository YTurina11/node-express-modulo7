const express = require('express');
const router = express.Router();

const orderController = require('../controllers/orderController');
const verificarToken = require('../middlewares/authMiddleware');

router.get('/', orderController.getOrders);

router.post('/', verificarToken, orderController.createOrder);

router.put('/:id', verificarToken, orderController.updateOrder);

router.delete('/:id', orderController.deleteOrder);

module.exports = router;