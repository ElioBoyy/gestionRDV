const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data) {
  let errors = {};

  data.firstName = !isEmpty(data.firstName) ? data.firstName : '';
  data.lastName = !isEmpty(data.lastName) ? data.lastName : '';
  data.sexe = !isEmpty(data.sexe) ? data.sexe : '';
  data.birthDate = !isEmpty(data.birthDate) ? data.birthDate : '';

  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.password2 = !isEmpty(data.password2) ? data.password2 : '';
  data.role = !isEmpty(data.role) ? data.role : '';


  if (!Validator.isLength(data.firstName, { min: 2, max: 30 })) {
    errors.firstName = 'firstName must be between 2 and 30 characters';
  }

  if (Validator.isEmpty(data.firstName)) {
    errors.firstName = 'Name field is required';
  }
  if (!Validator.isLength(data.lastName, { min: 2, max: 30 })) {
    errors.lastName = 'lastName must be between 2 and 30 characters';
  }

  if (Validator.isEmpty(data.lastName)) {
    errors.lastName = 'Name field is required';
  }
  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email field is required';
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password field is required';
  }

  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (Validator.isEmpty(data.password2)) {
    errors.password2 = 'Confirm Password field is required';
  }

  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = 'Passwords must match';
  }
  if ((!Validator.equals(data.role,'Professionel'))||(!Validator.equals(data.role,'Client'))||(!Validator.equals(data.role,'admin'))) {
    errors.role = 'Worng role';
  }
  if ((!Validator.equals(data.sexe,'Homme'))||(!Validator.equals(data.sexe,'Femme'))||(!Validator.equals(data.sexe,'Autre'))) {
    errors.role = 'Worng role';
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};