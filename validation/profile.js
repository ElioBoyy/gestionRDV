const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateProfileInput(data) {
  let errors = {};

  //data.domainePrincipal = !isEmpty(data.domainePrincipal) ? data.domainePrincipal : '';
  data.mobile = !isEmpty(data.mobile) ? data.mobile : '';


  // if (Validator.isEmpty(data.domainePrincipal)) {
  //   errors.domainePrincipal = 'Domaine principal field is required';
  // }
 
  if (Validator.isEmpty(data.mobile)) {
    errors.mobile = 'Mobile field is required';
  }


  return {
    errors,
    isValid: isEmpty(errors)
  };
};
