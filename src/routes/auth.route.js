const express = require('express');

// controller here
const {
  register,
  login,
  verifyEmail,
} = require('../controllers/auth.controller');

// middleware
const validationResult = require('../middlewares/validation');

// validation rules
const {
  registerValidation,
  loginValidation,
} = require('../validation/auth.validation');

const router = express.Router();

router
  .post('/auth/register', registerValidation, validationResult, register)
  .post('/auth/login', loginValidation, validationResult, login)
  .get('/auth/verify-email', verifyEmail);

module.exports = router;
