import React, { useState } from 'react';
import { validateName, validateEmail, validateDateOfBirth, validatePostalCode } from '../../services/CheckForm/CheckForm';
import './FormComponent.css';

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

  const fieldLabels = {
    firstName: 'Prénom',
    lastName: 'Nom',
    email: 'Email',
    dateOfBirth: 'Date de naissance',
    city: 'Ville',
    postalCode: 'Code postal',
  };

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
        errorMessage = validateName(value) ? '' : 'Prénom invalide';
        break;
      case 'lastName':
        errorMessage = validateName(value) ? '' : 'Nom invalide';
        break;
      case 'city':
        errorMessage = validateName(value) ? '' : 'Nom de ville invalide';
        break;
      case 'email':
        errorMessage = validateEmail(value) ? '' : 'Email invalide';
        break;
      case 'dateOfBirth':
        errorMessage = validateDateOfBirth(value) ? '' : "La date doit être valide et l'utilisateur majeur";
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
    <div className="form-container">
      <form onSubmit={handleSubmit} className="custom-form">
        <h2 className="form-title">Inscription</h2>
        {['firstName', 'lastName', 'email', 'dateOfBirth', 'city', 'postalCode'].map((field) => (
          <div key={field} className="form-field">
            <label htmlFor={field} className="form-label">
              {fieldLabels[field]}
            </label>
            <input
              type={field === 'email' ? 'email' : field === 'dateOfBirth' ? 'date' : 'text'}
              id={field}
              name={field}
              value={formData[field]}
              onChange={handleInputChange}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              className="form-input"
            />
            {formErrors[field] && <span className="error-message" style={{ color: 'red' }}>{formErrors[field]}</span>}
          </div>
        ))}
        <button 
          type="submit" 
          disabled={!isFormValid} 
          className={`submit-button ${isFormValid ? 'valid' : 'disabled'}`}
          onClick={handleSubmit}
        >
          Enregistrer
        </button>
      </form>
    </div>
  );
};

export default FormComponent;
