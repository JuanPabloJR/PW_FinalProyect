const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller.js');
const authMiddleware = require('../middleware/users.js');

router.get('/getter', authMiddleware.isLoggedIn, productController.getAllProducts);
router.get('/:query', authMiddleware.isLoggedIn, productController.searchProducts);

module.exports = router;
