import React from 'react';
import { render, screen, cleanup, waitFor, act } from '@testing-library/react';
import ListComponent from './ListComponent';

describe.skip('ListComponent', () => {
  afterEach(() => {
    localStorage.clear();
    cleanup();
  });

  test('met à jour la liste quand "userAdded" est dispatché', async () => {
    render(<ListComponent />);

    const newUser = {
      firstName: 'New',
      lastName: 'User',
      email: 'new.user@example.com',
      dateOfBirth: '1995-03-20',
      city: 'Nice',
      postalCode: '06000',
    };

    // On met à jour le localStorage AVANT le dispatch
    localStorage.setItem('formData', JSON.stringify([newUser]));

    // Act pour notifier React du changement
    await act(async () => {
      window.dispatchEvent(new Event('userAdded'));
    });

    // Attendre que le DOM se mette à jour
    await waitFor(() => {
      expect(screen.getByText(/New User - new.user@example.com/)).toBeInTheDocument();
    });
  });
});
