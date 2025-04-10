/**
 * @function
 * @name validateName
 * @description Validation du format texte : le texte doit contenir uniquement des lettres, des accents, des tirets et des apostrophes.
 * @param {string} name - Le texte à valider
 * @returns {boolean} - `true` si le texte est valide, sinon `false`.
 */
export const validateName = (name) => {
    return /^[a-zA-ZÀ-ÿ-']+(\s[a-zA-ZÀ-ÿ-']+)*$/.test(name);
  };
    
/**
 * @function
 * @name validateEmail
 * @description Validation du format email : l'adresse doit contenir un nom, un @, un domaine et une extension.
 * @param {string} email - L'adresse email à valider
 * @returns {boolean} - `true` si l'email est valide, sinon `false`.
 */
export const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

/**
 * @function
 * @name validateDateOfBirth
 * @description Validation du format de date de naissance + vérification que l'utilisateur est majeur (18 ans ou plus).
 * @param {string} dateOfBirth - La date de naissance au format compatible avec le constructeur `Date`
 * @returns {boolean} - `true` si la date est valide et que l'utilisateur est majeur, sinon `false`.
 */
export const validateDateOfBirth = (dateOfBirth) => {
  const birthDate = new Date(dateOfBirth);
  if (isNaN(birthDate)) {
    return false;
  }

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age >= 18;
};

/**
 * @function
 * @name validatePostalCode
 * @description Validation du format du code postal français : doit contenir exactement 5 chiffres.
 * @param {string} postalCode - Le code postal à valider
 * @returns {boolean} - `true` si le code postal est valide, sinon `false`.
 */
export const validatePostalCode = (postalCode) => {
  return /^\d{5}$/.test(postalCode);
};