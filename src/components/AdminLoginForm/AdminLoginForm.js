import React, { useState, useEffect } from 'react';
import '../FormComponent/FormComponent.css';
import { validateEmail } from '../../services/CheckForm/CheckForm';
import axios from 'axios';

const AdminLoginForm = () => {
  const initialLoginData = {
    email: '',
    password: '',
  };

  const initialLoginErrors = {
    email: '',
    password: '',
  };

  const [loginData, setLoginData] = useState(initialLoginData);
  const [loginErrors, setLoginErrors] = useState(initialLoginErrors);
  const [isLoginValid, setIsLoginValid] = useState(false);

  useEffect(() => {
  const isValid = validateEmail(loginData.email) && loginData.password.length >= 6;
  setIsLoginValid(isValid);
}, [loginData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    const updatedData = { ...loginData };

    if (name === 'adminEmail') updatedData.email = value;
    if (name === 'adminPassword') updatedData.password = value;

    setLoginData(updatedData);
    validateField(name, value);

    // recalcul immédiat de la validité
    const isValid = validateEmail(updatedData.email) && updatedData.password.length >= 6;
    setIsLoginValid(isValid);
  };

  const validateField = (fieldName, value) => {
    let errorMessage = '';

    if (fieldName === 'adminEmail') {
      errorMessage = validateEmail(value) ? '' : 'Email invalide';
      setLoginErrors((prev) => ({ ...prev, email: errorMessage }));
    } else if (fieldName === 'adminPassword') {
      errorMessage = value.length >= 6 ? '' : 'Mot de passe trop court';
      setLoginErrors((prev) => ({ ...prev, password: errorMessage }));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (isLoginValid) {
      try {
        const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/login`, loginData, {
          headers: { 'Content-Type': 'application/json' },
        });

        const token = response.data.token;
        localStorage.setItem('adminToken', token);
        alert('Connexion réussie !');
        window.location.reload();
      } catch (error) {
        console.error('Erreur de connexion :', error);
        alert("Échec de l'authentification. Vérifie ton email ou ton mot de passe.");
      }
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleLogin} className="custom-form">
        <h2 className="form-title">Connexion administrateur</h2>

        <div className="form-field">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            id="email"
            name="adminEmail"
            data-testid="admin-email"
            value={loginData.email}
            onChange={handleInputChange}
            placeholder="Email"
            className="form-input"
          />
          {loginErrors.email && <span className="error-message" style={{ color: 'red' }}>{loginErrors.email}</span>}
        </div>

        <div className="form-field">
          <label htmlFor="password" className="form-label">Mot de passe</label>
          <input
            type="password"
            id="password"
            name="adminPassword"
            data-testid="admin-password"
            value={loginData.password}
            onChange={handleInputChange}
            placeholder="Mot de passe"
            className="form-input"
          />
          {loginErrors.password && <span className="error-message" style={{ color: 'red' }}>{loginErrors.password}</span>}
        </div>

        <button
          type="submit"
          disabled={!isLoginValid}
          className={`submit-button ${isLoginValid ? 'valid' : 'disabled'}`}
        >
          Se connecter
        </button>
      </form>
    </div>
  );
};

export default AdminLoginForm;
