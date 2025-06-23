import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { validateName, validateEmail, validateDateOfBirth, validatePostalCode } from '../../services/CheckForm/CheckForm';
import './FormComponent.css';
import { v4 as uuidv4 } from 'uuid';

const FormComponent = () => {
  const initialFormData = {
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: '',
    city: '',
    postalCode: '',
  };

  const initialFormErrors = {
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: '',
    city: '',
    postalCode: '',
  };

  const fieldLabels = {
    firstName: 'Prénom',
    lastName: 'Nom',
    email: 'Email',
    dateOfBirth: 'Date de naissance',
    city: 'Ville',
    postalCode: 'Code postal',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState(initialFormErrors);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const storedFormData = localStorage.getItem('formData');
    if (storedFormData) {
      const parsedData = JSON.parse(storedFormData);
      if (parsedData && typeof parsedData === 'object' && !Array.isArray(parsedData)) {
        setFormData({
          firstName: parsedData.firstName || '',
          lastName: parsedData.lastName || '',
          email: parsedData.email || '',
          dateOfBirth: parsedData.dateOfBirth || '',
          city: parsedData.city || '',
          postalCode: parsedData.postalCode || '',
        });
      }
    }
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (isFormValid) {
      const user = {
        id: uuidv4(),
        nom: formData.lastName,
        prenom: formData.firstName,
        email: formData.email,
        dateDeNaissance: formData.dateOfBirth,
        ville: formData.city,
        codePostal: formData.postalCode,
      };

      try {
        const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/users`, user, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 200) {
          localStorage.setItem('formData', JSON.stringify(formData));
          alert('Utilisateur enregistré avec succès!');
          window.dispatchEvent(new Event('userAdded'));
          setFormData(initialFormData);
          setFormErrors(initialFormErrors);
        } else {
          throw new Error('Échec de la création de l\'utilisateur.');
        }
      } catch (error) {
        console.error('Erreur lors de la création de l\'utilisateur :', error);
        alert('Erreur lors de l\'enregistrement de l\'utilisateur.');
      }
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
              data-testid={`user-${field}`}
              value={formData[field]}
              onChange={handleInputChange}
              placeholder={fieldLabels[field]}
              className="form-input"
            />
            {formErrors[field] && <span className="error-message" style={{ color: 'red' }}>{formErrors[field]}</span>}
          </div>
        ))}
        <button 
          type="submit" 
          disabled={!isFormValid} 
          className={`submit-button ${isFormValid ? 'valid' : 'disabled'}`}
        >
          Enregistrer
        </button>
      </form>
    </div>
  );
};

export default FormComponent;
