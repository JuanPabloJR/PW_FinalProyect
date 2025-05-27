const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller.js');
const userMiddleware = require('../middleware/users.js');

router.post('/sign-up', userMiddleware.validateRegister, authController.register);
router.post('/login', authController.login);

module.exports = router;