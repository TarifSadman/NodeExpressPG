const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/users', userController.getUsers);
router.post('/users/new-user', userController.createUser);
router.put('/users/update-user/:id', userController.updateUser);
router.delete('/users/delete-user/:id', userController.deleteUser);
router.get('/users/user-details/:id', userController.getUserById);
router.post('/register', userController.signupUser);
router.get('/signed-users', userController.getSignedUsers);

// New login route
router.post('/login', userController.loginUser);

module.exports = router;
