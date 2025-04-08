"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validatePostalCode = exports.validateName = exports.validateEmail = exports.validateDateOfBirth = void 0;
// validation du format texte
const validateName = name => {
  return /^[a-zA-ZÀ-ÿ-]+$/.test(name);
};

// validation du format email
exports.validateName = validateName;
const validateEmail = email => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// validation du format date + vérification de la majorité de l'utilisateur
exports.validateEmail = validateEmail;
const validateDateOfBirth = dateOfBirth => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || monthDiff === 0 && today.getDate() < birthDate.getDate()) {
    age--;
  }
  return age >= 18;
};

// validation du format code postal français
exports.validateDateOfBirth = validateDateOfBirth;
const validatePostalCode = postalCode => {
  return /^\d{5}$/.test(postalCode);
};
exports.validatePostalCode = validatePostalCode;