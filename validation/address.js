const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateAddressInput(data) {
  let errors = {};

  data.gouvernerat = !isEmpty(data.gouvernerat) ? data.gouvernerat : '';
  data.ville = !isEmpty(data.ville) ? data.ville : '';
  data.cite = !isEmpty(data.cite) ? data.cite : '';

  if (Validator.isEmpty(data.gouvernerat)) {
    errors.gouvernerat = 'gouvernerat field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
