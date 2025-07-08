import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FormComponent from './FormComponent';
import axios from 'axios';

import {
  validateName,
  validateEmail,
  validateDateOfBirth,
  validatePostalCode,
} from '../../services/CheckForm/CheckForm';

jest.mock('axios');

jest.mock('uuid', () => ({
  v4: () => 'mocked-uuid',
}));

jest.mock('../../services/CheckForm/CheckForm', () => ({
  validateName: jest.fn(() => true),
  validateEmail: jest.fn(() => true),
  validateDateOfBirth: jest.fn(() => true),
  validatePostalCode: jest.fn(() => true),
}));

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
  jest.spyOn(window, 'alert').mockImplementation(() => { });
  jest.spyOn(window, 'dispatchEvent').mockImplementation(() => { });
  jest.spyOn(console, 'error').mockImplementation(() => { });
});

describe('FormComponent', () => {
  it('devrait initialiser tous les champs à vide', () => {
    render(<FormComponent />);
    expect(screen.getByTestId('user-firstName').value).toBe('');
    expect(screen.getByTestId('user-lastName').value).toBe('');
    expect(screen.getByTestId('user-email').value).toBe('');
    expect(screen.getByTestId('user-dateOfBirth').value).toBe('');
    expect(screen.getByTestId('user-city').value).toBe('');
    expect(screen.getByTestId('user-postalCode').value).toBe('');
  });

  it('ne modifie pas le formulaire si le localStorage contient des données invalides', () => {
    localStorage.setItem('formData', JSON.stringify("not-an-object"));
    render(<FormComponent />);
    expect(screen.getByTestId('user-firstName').value).toBe('');
  });

  it('devrait activer le bouton quand tous les champs sont valides', async () => {
    validateName.mockReturnValue(true);
    validateEmail.mockReturnValue(true);
    validateDateOfBirth.mockReturnValue(true);
    validatePostalCode.mockReturnValue(true);

    render(<FormComponent />);

    fireEvent.change(screen.getByTestId('user-firstName'), { target: { value: 'Jean' } });
    fireEvent.change(screen.getByTestId('user-lastName'), { target: { value: 'Dupont' } });
    fireEvent.change(screen.getByTestId('user-email'), { target: { value: 'jean@example.com' } });
    fireEvent.change(screen.getByTestId('user-dateOfBirth'), { target: { value: '1990-01-01' } });
    fireEvent.change(screen.getByTestId('user-city'), { target: { value: 'Paris' } });
    fireEvent.change(screen.getByTestId('user-postalCode'), { target: { value: '75000' } });

    await waitFor(() => {
      const btn = screen.getByRole('button', { name: /enregistrer/i });
      expect(btn).toBeEnabled();
    });
  });

  it('devrait afficher un message de succès et vider les champs après enregistrement', async () => {
    validateName.mockReturnValue(true);
    validateEmail.mockReturnValue(true);
    validateDateOfBirth.mockReturnValue(true);
    validatePostalCode.mockReturnValue(true);
    axios.post.mockResolvedValue({ status: 200 });

    render(<FormComponent />);

    fireEvent.change(screen.getByTestId('user-firstName'), { target: { value: 'Jean' } });
    fireEvent.change(screen.getByTestId('user-lastName'), { target: { value: 'Dupont' } });
    fireEvent.change(screen.getByTestId('user-email'), { target: { value: 'jean@example.com' } });
    fireEvent.change(screen.getByTestId('user-dateOfBirth'), { target: { value: '1995-01-01' } });
    fireEvent.change(screen.getByTestId('user-city'), { target: { value: 'Paris' } });
    fireEvent.change(screen.getByTestId('user-postalCode'), { target: { value: '75000' } });

    fireEvent.click(screen.getByRole('button', { name: /enregistrer/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Utilisateur enregistré avec succès!');
      expect(window.dispatchEvent).toHaveBeenCalled();
    });

    expect(screen.getByTestId('user-firstName').value).toBe('');
  });

  it('devrait afficher une erreur si la requête POST échoue', async () => {
    validateName.mockReturnValue(true);
    validateEmail.mockReturnValue(true);
    validateDateOfBirth.mockReturnValue(true);
    validatePostalCode.mockReturnValue(true);
    axios.post.mockRejectedValue(new Error('Échec serveur'));

    render(<FormComponent />);

    fireEvent.change(screen.getByTestId('user-firstName'), { target: { value: 'Paul' } });
    fireEvent.change(screen.getByTestId('user-lastName'), { target: { value: 'Martin' } });
    fireEvent.change(screen.getByTestId('user-email'), { target: { value: 'paul@example.com' } });
    fireEvent.change(screen.getByTestId('user-dateOfBirth'), { target: { value: '1985-03-03' } });
    fireEvent.change(screen.getByTestId('user-city'), { target: { value: 'Nice' } });
    fireEvent.change(screen.getByTestId('user-postalCode'), { target: { value: '06000' } });

    fireEvent.click(screen.getByRole('button', { name: /enregistrer/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Erreur lors de l'enregistrement de l'utilisateur.");
    });
  });

  it('devrait afficher une erreur si la réponse HTTP est autre que 200', async () => {
    validateName.mockReturnValue(true);
    validateEmail.mockReturnValue(true);
    validateDateOfBirth.mockReturnValue(true);
    validatePostalCode.mockReturnValue(true);
    axios.post.mockResolvedValue({ status: 400 });

    render(<FormComponent />);

    fireEvent.change(screen.getByTestId('user-firstName'), { target: { value: 'Luc' } });
    fireEvent.change(screen.getByTestId('user-lastName'), { target: { value: 'Durand' } });
    fireEvent.change(screen.getByTestId('user-email'), { target: { value: 'luc@example.com' } });
    fireEvent.change(screen.getByTestId('user-dateOfBirth'), { target: { value: '1991-01-01' } });
    fireEvent.change(screen.getByTestId('user-city'), { target: { value: 'Lyon' } });
    fireEvent.change(screen.getByTestId('user-postalCode'), { target: { value: '69000' } });

    fireEvent.click(screen.getByRole('button', { name: /enregistrer/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Erreur lors de l'enregistrement de l'utilisateur.");
    });
  });

  it('devrait afficher les messages d’erreur si les champs sont invalides', async () => {
    validateName.mockReturnValueOnce(false); // pour firstName
    validateEmail.mockReturnValueOnce(false); // pour email

    render(<FormComponent />);

    fireEvent.change(screen.getByTestId('user-firstName'), { target: { value: 'Jean!@#' } });
    fireEvent.change(screen.getByTestId('user-email'), { target: { value: 'invalidemail' } });
    fireEvent.submit(screen.getByRole('button'));

    expect(await screen.findByText('Prénom invalide')).toBeInTheDocument();
    expect(await screen.findByText(/email invalide/i)).toBeInTheDocument();
  });

  it('devrait afficher une erreur si le code postal contient des lettres', () => {
    validatePostalCode.mockReturnValueOnce(false);
    render(<FormComponent />);
    fireEvent.change(screen.getByTestId('user-postalCode'), { target: { value: '75AB0' } });
    fireEvent.blur(screen.getByTestId('user-postalCode'));
    expect(screen.getByText('Code postal invalide')).toBeInTheDocument();
  });

  it('devrait stocker les données dans le localStorage après soumission', async () => {
    validateName.mockReturnValue(true);
    validateEmail.mockReturnValue(true);
    validateDateOfBirth.mockReturnValue(true);
    validatePostalCode.mockReturnValue(true);
    axios.post.mockResolvedValue({ status: 200 });

    render(<FormComponent />);

    fireEvent.change(screen.getByTestId('user-firstName'), { target: { value: 'Lucie' } });
    fireEvent.change(screen.getByTestId('user-lastName'), { target: { value: 'Moreau' } });
    fireEvent.change(screen.getByTestId('user-email'), { target: { value: 'lucie@example.com' } });
    fireEvent.change(screen.getByTestId('user-dateOfBirth'), { target: { value: '1990-02-02' } });
    fireEvent.change(screen.getByTestId('user-city'), { target: { value: 'Bordeaux' } });
    fireEvent.change(screen.getByTestId('user-postalCode'), { target: { value: '33000' } });

    fireEvent.click(screen.getByRole('button', { name: /enregistrer/i }));

    await waitFor(() => {
      expect(JSON.parse(localStorage.getItem('formData'))?.email).toBe('lucie@example.com');
    });
  });

  it('ne génère pas d’erreur pour un champ inconnu', () => {
    render(<FormComponent />);
    const input = screen.getByTestId('user-firstName');
    fireEvent.change(input, { target: { name: 'unknownField', value: 'valeur' } });
  });
});
