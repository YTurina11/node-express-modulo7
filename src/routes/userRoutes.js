const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/comparacion-sql-orm', authMiddleware, userController.compareSQLAndORM);

router.get('/', authMiddleware, userController.getUsers);

router.post('/transaccion-registro', authMiddleware, userController.registerUserWithAuditTransaction);

router.get('/:id/pedidos', authMiddleware, userController.getUserWithOrders);

router.post('/', authMiddleware, userController.createUser);

router.put('/:id', authMiddleware, userController.updateUser);

router.delete('/:id', authMiddleware, userController.deleteUser);

module.exports = router;
