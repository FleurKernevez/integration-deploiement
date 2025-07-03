import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FormComponent from './FormComponent';
import axios from 'axios';
import {
  validateName,
  validateEmail,
  validateDateOfBirth,
  validatePostalCode,
} from '../../services/CheckForm/CheckForm';

// MOCK axios
jest.mock('axios');

// MOCK uuid
jest.mock('uuid', () => ({
  v4: () => 'mocked-uuid',
}));

// MOCK fonctions de validation
jest.mock('../../services/CheckForm/CheckForm', () => ({
  validateName: jest.fn(() => true),
  validateEmail: jest.fn(() => true),
  validateDateOfBirth: jest.fn(() => true),
  validatePostalCode: jest.fn(() => true),
}));

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
  jest.spyOn(window, 'alert').mockImplementation(() => {});
});

describe('Rendu initial du formulaire', () => {
  it('devrait initialiser tous les champs à une valeur vide', () => {
    render(<FormComponent />);
    expect(screen.getByLabelText("Prénom").value).toBe('');
    expect(screen.getByLabelText("Nom").value).toBe('');
    expect(screen.getByLabelText(/email/i).value).toBe('');
    expect(screen.getByLabelText(/date de naissance/i).value).toBe('');
    expect(screen.getByLabelText(/ville/i).value).toBe('');
    expect(screen.getByLabelText(/code postal/i).value).toBe('');
  });
});

it('devrait activer le bouton quand tous les champs sont valides', async () => {
  validateName.mockReturnValue(true);
  validateEmail.mockReturnValue(true);
  validateDateOfBirth.mockReturnValue(true);
  validatePostalCode.mockReturnValue(true);

  render(<FormComponent />);

  fireEvent.change(screen.getByLabelText('Prénom'), { target: { value: 'Jean' } });
  fireEvent.change(screen.getByLabelText('Nom'), { target: { value: 'Dupont' } });
  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'jean@example.com' } });
  fireEvent.change(screen.getByLabelText(/date de naissance/i), { target: { value: '1990-01-01' } });
  fireEvent.change(screen.getByLabelText(/ville/i), { target: { value: 'Paris' } });
  fireEvent.change(screen.getByLabelText(/code postal/i), { target: { value: '75000' } });

  await waitFor(() => expect(screen.getByRole('button', { name: /enregistrer/i })).toBeEnabled());
});

it('devrait afficher un toaster et vider les champs après la soumission', async () => {
  // Mocks essentiels
  axios.post.mockResolvedValue({ status: 200 });
  validateName.mockReturnValue(true);
  validateEmail.mockReturnValue(true);
  validateDateOfBirth.mockReturnValue(true);
  validatePostalCode.mockReturnValue(true);

  render(<FormComponent />);

  fireEvent.change(screen.getByLabelText('Prénom'), { target: { value: 'Jean' } });
  fireEvent.change(screen.getByLabelText('Nom'), { target: { value: 'Dupont' } });
  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'jean@example.com' } });
  fireEvent.change(screen.getByLabelText(/date de naissance/i), { target: { value: '2000-01-01' } });
  fireEvent.change(screen.getByLabelText(/ville/i), { target: { value: 'Paris' } });
  fireEvent.change(screen.getByLabelText(/code postal/i), { target: { value: '75000' } });

  fireEvent.click(screen.getByRole('button', { name: /enregistrer/i }));

  await waitFor(() => expect(window.alert).toHaveBeenCalledWith('Utilisateur enregistré avec succès!'));
  expect(screen.getByLabelText('Prénom').value).toBe('');
});

describe('Formulaire', () => {
  it('devrait afficher les erreurs si les champs sont invalides', async () => {
    validateName.mockReturnValueOnce(false);
    validateEmail.mockReturnValueOnce(false);

    render(<FormComponent />);
    fireEvent.change(screen.getByLabelText('Prénom'), { target: { value: 'Jean!Charles' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'jean-example.com' } });
    fireEvent.submit(screen.getByRole('button'));

    const nameError = await screen.findByText('Prénom invalide');
    const emailError = await screen.findByText(/email invalide/i);

    expect(nameError).toBeInTheDocument();
    expect(emailError).toBeInTheDocument();
    expect(nameError).toHaveStyle('color: red');
    expect(emailError).toHaveStyle('color: red');
  });

  it('devrait afficher une erreur si le code postal contient des lettres', () => {
    validatePostalCode.mockReturnValueOnce(false);
    render(<FormComponent />);
    fireEvent.change(screen.getByLabelText(/code postal/i), { target: { value: '75AB0' } });
    fireEvent.blur(screen.getByLabelText(/code postal/i));
    expect(screen.getByText('Code postal invalide')).toBeInTheDocument();
  });
});

it('devrait ajouter un utilisateur dans le localStorage après soumission', async () => {
  axios.post.mockResolvedValue({ status: 200 });

  // Assure la validité des champs
  validateName.mockReturnValue(true);
  validateEmail.mockReturnValue(true);
  validateDateOfBirth.mockReturnValue(true);
  validatePostalCode.mockReturnValue(true);

  render(<FormComponent />);

  fireEvent.change(screen.getByLabelText('Prénom'), { target: { value: 'Lucie' } });
  fireEvent.change(screen.getByLabelText('Nom'), { target: { value: 'Moreau' } });
  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'lucie@example.com' } });
  fireEvent.change(screen.getByLabelText(/date de naissance/i), { target: { value: '1990-02-02' } });
  fireEvent.change(screen.getByLabelText(/ville/i), { target: { value: 'Bordeaux' } });
  fireEvent.change(screen.getByLabelText(/code postal/i), { target: { value: '33000' } });

  fireEvent.click(screen.getByRole('button', { name: /enregistrer/i }));

  await waitFor(() => {
    const storedData = localStorage.getItem('formData');
    expect(storedData).not.toBeNull();
  });
  const parsed = JSON.parse(localStorage.getItem('formData'));
  expect(parsed.email).toBe('lucie@example.com');
});

