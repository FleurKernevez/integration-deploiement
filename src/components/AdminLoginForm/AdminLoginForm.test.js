import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AdminLoginForm from './AdminLoginForm';
import axios from 'axios';

jest.mock('axios');

jest.mock('../../services/CheckForm/CheckForm', () => ({
  validateEmail: jest.fn(() => true),
}));

describe('AdminLoginForm', () => {
    beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    });

  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    require('../../services/CheckForm/CheckForm').validateEmail.mockReturnValue(true);
  });

  it('rend correctement les champs email et mot de passe', () => {
    render(<AdminLoginForm />);
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Mot de passe/i)).toBeInTheDocument();
  });

  it('désactive le bouton quand les champs sont vides ou invalides', () => {
    render(<AdminLoginForm />);
    const button = screen.getByRole('button', { name: /se connecter/i });
    expect(button).toBeDisabled();
  });

  it('affiche une erreur si le mot de passe est trop court', () => {
    render(<AdminLoginForm />);
    const passwordInput = screen.getByLabelText(/mot de passe/i);

    fireEvent.change(passwordInput, { target: { value: '123' } });
    expect(screen.getByText(/mot de passe trop court/i)).toBeInTheDocument();
  });

it('active le bouton si le formulaire est valide', async () => {
  render(<AdminLoginForm />);

  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'admin@email.com' } });
  fireEvent.change(screen.getByLabelText(/mot de passe/i), { target: { value: 'password123' } });

  await waitFor(() => {
    expect(screen.getByRole('button', { name: /se connecter/i })).not.toBeDisabled();
  });
});



  it('soumet le formulaire avec succès et stocke le token', async () => {
    const mockToken = 'fake-jwt-token';
    axios.post.mockResolvedValue({ data: { token: mockToken } });
    window.alert = jest.fn();
    delete window.location;
    window.location = { reload: jest.fn() };

    render(<AdminLoginForm />);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'admin@email.com' } });
    fireEvent.change(screen.getByLabelText(/mot de passe/i), { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: /se connecter/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/login'),
        { email: 'admin@email.com', password: 'password123' },
        expect.any(Object)
      );
      expect(localStorage.getItem('adminToken')).toBe(mockToken);
      expect(window.alert).toHaveBeenCalledWith('Connexion réussie !');
      expect(window.location.reload).toHaveBeenCalled();
    });
  });

  it('affiche une alerte en cas d’échec du login', async () => {
    axios.post.mockRejectedValue(new Error('Login failed'));
    window.alert = jest.fn();

    render(<AdminLoginForm />);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'admin@email.com' } });
    fireEvent.change(screen.getByLabelText(/mot de passe/i), { target: { value: 'wrongpass' } });

    fireEvent.click(screen.getByRole('button', { name: /se connecter/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Échec de l'authentification. Vérifie ton email ou ton mot de passe.");
    });
  });
});
