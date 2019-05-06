const express = require('express');
const router = express.Router();

const userController = require('../controllers/users');

router.post('/signup', userController.signup_user);

router.post('/login', userController.login_user);

router.delete('/:userId', userController.deleteUser);

module.exports = router;
