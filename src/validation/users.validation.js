const { check } = require('express-validator');

const updateValidation = [
  // name
  check('name', 'name cannot be empty').not().isEmpty(),
  check('name', 'name must be between 3 and 50 characters').isLength({
    min: 3,
    max: 50,
  }),
  check('name', 'name must be alphabet only').matches(/^[A-Za-z\s]+$/),

  // phone
  check('phone', 'phone cannot be empty').not().isEmpty(),
  check('phone', 'Please Enter phone Number correctly').isMobilePhone(),
];

module.exports = { updateValidation };
