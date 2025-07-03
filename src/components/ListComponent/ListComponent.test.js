import React from 'react';
import { render, screen, waitFor, act, fireEvent } from '@testing-library/react';
import ListComponent from './ListComponent';

// Mocker fetch global
global.fetch = jest.fn();

const mockUsers = [
  [1, 'Doe', 'John', 'john.doe@example.com', '1990-01-01', '75001', 'Paris'],
  [2, 'Smith', 'Jane', 'jane.smith@example.com', '1992-05-10', '69000', 'Lyon'],
];

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, 'error').mockImplementation(() => {});
  window.alert = jest.fn();
});

afterEach(() => {
  localStorage.clear();
});

describe('ListComponent', () => {
  test('affiche les utilisateurs récupérés via fetch', async () => {
    fetch.mockResolvedValueOnce({
      json: async () => ({
        utilisateurs: mockUsers,
      }),
    });

    render(<ListComponent />);

    await waitFor(() => {
      expect(screen.getByText(/John Doe - john.doe@example.com/)).toBeInTheDocument();
      expect(screen.getByText(/Jane Smith - jane.smith@example.com/)).toBeInTheDocument();
    });

    expect(screen.getByText('2 user(s) already registered')).toBeInTheDocument();
  });

  test('affiche un message si aucun utilisateur', async () => {
    fetch.mockResolvedValueOnce({
      json: async () => ({
        utilisateurs: [],
      }),
    });

    render(<ListComponent />);

    await waitFor(() => {
      expect(screen.getByText(/Aucun utilisateur enregistré/i)).toBeInTheDocument();
    });
  });

  test('met à jour la liste quand "userAdded" est dispatché', async () => {
    fetch
      .mockResolvedValueOnce({
        json: async () => ({ utilisateurs: [] }),
      })
      .mockResolvedValueOnce({
        json: async () => ({
          utilisateurs: [
            [1, 'Doe', 'John', 'john.doe@example.com', '1990-01-01', '75001', 'Paris'],
          ],
        }),
      });

    render(<ListComponent />);

    await waitFor(() => {
      expect(screen.getByText(/Aucun utilisateur enregistré/i)).toBeInTheDocument();
    });

    // Déclenchement manuel de l'event
    await act(async () => {
      window.dispatchEvent(new Event('userAdded'));
    });

    await waitFor(() => {
      const userItem = screen.getByTestId('user-1');
      expect(userItem).toBeInTheDocument();
      expect(userItem).toHaveTextContent('John Doe');
      expect(userItem).toHaveTextContent('john.doe@example.com');
    });
  });

  test('supprime un utilisateur après clic sur le bouton', async () => {
    localStorage.setItem('adminToken', 'fake-token');

    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ utilisateurs: mockUsers }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ utilisateurs: [] }),
      });

    render(<ListComponent />);

    const userItem = await screen.findByTestId('user-1');
    expect(userItem).toBeInTheDocument();

    const deleteButton = screen.getByRole('button', { name: /Supprimer John Doe/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Utilisateur supprimé avec succès !');
      expect(screen.queryByTestId('user-1')).not.toBeInTheDocument();
    });
  });

  test('affiche une alerte si la suppression échoue', async () => {
    localStorage.setItem('adminToken', 'fake-token');

    fetch
      .mockResolvedValueOnce({
        json: async () => ({ utilisateurs: mockUsers }),
      })
      .mockResolvedValueOnce({ ok: false }); // DELETE échoue

    render(<ListComponent />);

    const userItem = await screen.findByTestId('user-1');
    expect(userItem).toBeInTheDocument();

    const deleteButton = screen.getByTestId('delete-1');
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Erreur lors de la suppression de l'utilisateur.");
    });
  });
});
