import React, { useState } from 'react';
import { validateName, validateEmail, validateDateOfBirth, validatePostalCode } from './FormComponent-tests';


const FormComponent = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: '',
    city: '',
    postalCode: '',
  });

  const [formErrors, setFormErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: '',
    city: '',
    postalCode: '',
  });

  const [isFormValid, setIsFormValid] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };

    setFormData(updatedFormData);
    validateField(name, value);
    validateForm(updatedFormData);
  };

  const validateField = (fieldName, value) => {
    let errorMessage = '';
    switch (fieldName) {
      case 'firstName':
      case 'lastName':
      case 'city':
        errorMessage = validateName(value) ? '' : 'Nom invalide';
        break;
      case 'email':
        errorMessage = validateEmail(value) ? '' : 'Email invalide';
        break;
      case 'dateOfBirth':
        errorMessage = validateDateOfBirth(value) ? '' : 'Doit avoir plus de 18 ans';
        break;
      case 'postalCode':
        errorMessage = validatePostalCode(value) ? '' : 'Code postal invalide';
        break;
      default:
        break;
    }

    setFormErrors({ ...formErrors, [fieldName]: errorMessage });
    const updatedFormData = { ...formData, [fieldName]: value };
    validateForm(updatedFormData);
  };

  const validateForm = (updatedFormData) => {
    const { firstName, lastName, email, dateOfBirth, city, postalCode } = updatedFormData;
    const isValid =
      validateName(firstName) &&
      validateName(lastName) &&
      validateEmail(email) &&
      validateDateOfBirth(dateOfBirth) &&
      validateName(city) &&
      validatePostalCode(postalCode);

    setIsFormValid(isValid);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Données du formulaire :", formData);
    if (isFormValid) {
      alert('Utilisateur enregistré avec succès!');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        dateOfBirth: '',
        city: '',
        postalCode: '',
      });
      setFormErrors({
        firstName: '',
        lastName: '',
        email: '',
        dateOfBirth: '',
        city: '',
        postalCode: '',
      });
    }
  };

  return (
  <div className="flex justify-center items-center min-h-screen bg-gray-100">
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg w-96">
      <h2 className="text-2xl font-semibold text-center mb-4">Inscription</h2>
      {['firstName', 'lastName', 'email', 'dateOfBirth', 'city', 'postalCode'].map((field) => (
        <div key={field} className="mb-4">
          <input
            type={field === 'email' ? 'email' : field === 'dateOfBirth' ? 'date' : 'text'}
            name={field}
            value={formData[field]}
            onChange={handleInputChange}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {formErrors[field] && <span className="text-red-500 text-sm">{formErrors[field]}</span>}
        </div>
      ))}
      <button 
        type="submit" 
        disabled={!isFormValid} 
        className={`w-full p-2 text-white font-semibold rounded-lg ${isFormValid ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300 cursor-not-allowed'}`}
        onClick={handleSubmit}
      >
        Enregistrer
      </button>
    </form>
  </div>
  
  );
};

export default FormComponent;
