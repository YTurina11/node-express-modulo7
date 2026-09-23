const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/comparacion-sql-orm', userController.compareSQLAndORM);
router.get('/', userController.getUsers);
router.post('/transaccion-registro', userController.registerUserWithAuditTransaction);
router.get('/:id/pedidos', userController.getUserWithOrders);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
