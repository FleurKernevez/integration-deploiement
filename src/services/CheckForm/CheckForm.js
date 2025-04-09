// validation du format texte
export const validateName = (name) => {
    return /^[a-zA-ZÀ-ÿ-']+(\s[a-zA-ZÀ-ÿ-']+)*$/.test(name);
  };
    
  // validation du format email
  export const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  
  // validation du format date + vérification de la majorité de l'utilisateur
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
  
  // validation du format code postal français
  export const validatePostalCode = (postalCode) => {
    return /^\d{5}$/.test(postalCode);
  };