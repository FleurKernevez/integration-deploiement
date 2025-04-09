import { render, screen, fireEvent, waitFor  } from '@testing-library/react';
import FormComponent from './FormComponent';

describe('Bouton activé/désactivé', () => {
  it('devrait désactiver le bouton si les champs ne sont pas tous remplis', () => {
    render(<FormComponent />);

    const submitButton = screen.getByRole('button', { name: /enregistrer/i });
    expect(submitButton).toBeDisabled();

    // On remplit seulement un champ
    const firstNameInput = screen.getByLabelText(/prénom/i);
    fireEvent.change(firstNameInput, { target: { value: 'Jean' } });

    // Le bouton doit toujours être désactivé
    expect(submitButton).toBeDisabled();
  });

  it('devrait activer le bouton quand tous les champs sont valides', () => {
    render(<FormComponent />);

    // Récupérer les champs du formulaire
    const inputs = {
      firstName: screen.getByLabelText('Prénom'),
      lastName: screen.getByLabelText('Nom'),
      email: screen.getByLabelText(/email/i),
      dateOfBirth: screen.getByLabelText(/date de naissance/i),
      city: screen.getByLabelText(/ville/i),
      postalCode: screen.getByLabelText(/code postal/i),
    };

    // Remplir tous les champs
    fireEvent.change(inputs.firstName, { target: { value: 'Jean' } });
    fireEvent.change(inputs.lastName, { target: { value: 'Dupont' } });
    fireEvent.change(inputs.email, { target: { value: 'jean.dupont@example.com' } });
    fireEvent.change(inputs.dateOfBirth, { target: { value: '1990-01-01' } });
    fireEvent.change(inputs.city, { target: { value: 'Paris' } });
    fireEvent.change(inputs.postalCode, { target: { value: '75000' } });

    // Vérifier que le bouton est activé
    const submitButton = screen.getByRole('button', { name: /enregistrer/i });
    expect(submitButton).toBeEnabled();
  });
});

describe('Toaster de succès', () => {
  it('devrait afficher un toaster de succès et vider les champs après la soumission', async () => {

    // Mock de la fonction alert
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(<FormComponent />);

    // Récupérer les champs du formulaire
    const firstNameInput = screen.getByLabelText('Prénom');
    const lastNameInput = screen.getByLabelText('Nom');
    const emailInput = screen.getByLabelText(/email/i);
    const dateOfBirthInput = screen.getByLabelText(/date de naissance/i);
    const cityInput = screen.getByLabelText(/ville/i);
    const postalCodeInput = screen.getByLabelText(/code postal/i);
    const submitButton = screen.getByRole('button', { name: /enregistrer/i });

    // Remplir tous les champs
    fireEvent.change(firstNameInput, { target: { value: 'Jean' } });
    fireEvent.change(lastNameInput, { target: { value: 'Dupont' } });
    fireEvent.change(emailInput, { target: { value: 'jean@example.com' } });
    fireEvent.change(dateOfBirthInput, { target: { value: '2000-01-01' } });
    fireEvent.change(cityInput, { target: { value: 'Paris' } });
    fireEvent.change(postalCodeInput, { target: { value: '75000' } });

    // Soumettre le formulaire
    fireEvent.click(submitButton);

    // Vérifier que l'alerte est appelée
    expect(alertMock).toHaveBeenCalledWith('Utilisateur enregistré avec succès!');

    // Vérifier que les champs sont vidés
    expect(firstNameInput.value).toBe('');
    expect(lastNameInput.value).toBe('');
    expect(emailInput.value).toBe('');
    expect(dateOfBirthInput.value).toBe('');
    expect(cityInput.value).toBe('');
    expect(postalCodeInput.value).toBe('');

    // Restauration de l'implémentation originale de alert
    alertMock.mockRestore();
  });
});

describe('Formulaire', () => {
  it('devrait afficher les erreurs en rouge si les champs sont invalides', async () => {

    render(<FormComponent />);

    // Récupérer les champs du formulaire
    const firstNameInput = screen.getByLabelText('Prénom');
    const emailInput = screen.getByLabelText(/email/i);
    
    // Remplir tous les champs
    fireEvent.change(firstNameInput, { target: { value: 'Jean!Charles' } });
    fireEvent.change(emailInput, { target: { value: 'jean-example.com' } });

    // Attendre et vérifier que les messages d'erreur sont affichés
    const nameError = await screen.findByText('Prénom invalide');
    const emailError = await screen.findByText(/email invalide/i);

    // Vérifier que les messages d'erreur sont affichés en rouge
    expect(nameError).toBeInTheDocument();
    expect(emailError).toBeInTheDocument();

    expect(nameError).toHaveStyle('color: red');
    expect(emailError).toHaveStyle('color:red');
  });
});

