const { check } = require('express-validator');

const loginValidation = [
  // email
  check('email', 'email cannot be empty').not().isEmpty(),
  check('email', 'please enter email correctly').isEmail(),
  check('email', 'Email maximum length is 50 characters').isLength({ max: 50 }),

  // password
  check('password', 'Password required').not().isEmpty(),
  check('password', 'Password require 8 or more characters').isLength({
    min: 8,
  }),
  check(
    'password',
    'Password must include one lowercase character, one uppercase character, a number, and a special character.',
  ).matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, 'i'),
];

const registerValidation = [
  // name
  check('name', 'name cannot be empty').not().isEmpty(),
  check('name', 'name must be between 3 and 50 characters').isLength({
    min: 3,
    max: 50,
  }),
  check('name', 'name must be alphabet only').matches(/^[A-Za-z\s]+$/),

  // email
  check('email', 'email cannot be empty').not().isEmpty(),
  check('email', 'please enter email correctly').isEmail(),
  check('email', 'Email maximum length is 50 characters').isLength({ max: 50 }),

  // phone
  check('phone', 'phone cannot be empty').not().isEmpty(),
  check('phone', 'Please Enter phone Number correctly').isMobilePhone(),

  // password
  check('password', 'Password required').not().isEmpty(),
  check('password', 'Password require 8 or more characters').isLength({
    min: 8,
  }),
  check(
    'password',
    'Password must include one lowercase character, one uppercase character, a number, and a special character.',
  ).matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, 'i'),
];

module.exports = {
  loginValidation,
  registerValidation,
};
