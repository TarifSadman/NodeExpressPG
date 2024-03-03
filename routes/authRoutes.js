const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController').default;

router.post('/login', authController.signIn);

module.exports = router;
