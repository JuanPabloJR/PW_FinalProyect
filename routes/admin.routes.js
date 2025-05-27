const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller.js');
const authMiddleware = require('../middleware/users.js');
const checkAdmin = require('../middleware/admin.js');

router.use(authMiddleware.isLoggedIn); // Token válido para todas
router.use(checkAdmin); // Sólo admin puede seguir

// Rutas para admin:
router.get('/users', adminController.getAllUsers);
router.post('/users', adminController.createAdminUser);
router.get('/products', adminController.getAllProducts);
router.put('/products/:id', adminController.updateProduct);
router.post('/products', adminController.createProduct);

module.exports = router;