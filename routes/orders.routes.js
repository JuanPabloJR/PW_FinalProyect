const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/orders.controller.js');
const authMiddleware = require('../middleware/users.js');

router.get('/getter', authMiddleware.isLoggedIn, ordersController.getUserOrders);
router.post('/create', authMiddleware.isLoggedIn, ordersController.createOrder);

module.exports = router;