import React, { useState } from 'react';
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...loginData, [name]: value };

    setLoginData(updatedData);
    validateField(name, value);
    validateForm(updatedData);
  };

  const validateField = (fieldName, value) => {
    let errorMessage = '';

    if (fieldName === 'email') {
      errorMessage = validateEmail(value) ? '' : 'Email invalide';
    } else if (fieldName === 'password') {
      errorMessage = value.length >= 6 ? '' : 'Mot de passe trop court (min. 6 caractères)';
    }

    setLoginErrors({ ...loginErrors, [fieldName]: errorMessage });
  };

  const validateForm = (updatedData) => {
    const isValid =
      validateEmail(updatedData.email) &&
      updatedData.password.length >= 6;

    setIsLoginValid(isValid);
  };

/*   const handleLogin = async (e) => {
    e.preventDefault();

    if (isLoginValid) {
      try {
        const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/admin/login`, loginData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 200) {
          alert('Connexion réussie');
          // TODO : rediriger l'admin ou stocker un token, etc.
        } else {
          throw new Error('Échec de la connexion.');
        }
      } catch (error) {
        console.error('Erreur de connexion :', error);
        alert("Échec de l'authentification. Vérifiez vos identifiants.");
      }
    }
  }; */

    const handleLogin = async (e) => {
    e.preventDefault();

    if (isLoginValid) {
        try {
        console.log('Tentative login avec :', loginData);
        const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/admin`, loginData, {
            headers: {
            'Content-Type': 'application/json',
            },
        });

        const token = response.data;
        console.log(response.data)

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
            name="email"
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
            name="password"
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