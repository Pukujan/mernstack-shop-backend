const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');


router.post('/api/userLogin', userController.userLogin);
router.post('/api/userSignUp', userController.userSignUp);


module.exports = router; 