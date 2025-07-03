import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PostForm from './PostForm';
import { ToastContainer } from 'react-toastify';

// Mock global fetch
global.fetch = jest.fn();

describe('PostForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('affiche le formulaire', () => {
    render(<PostForm />);
    expect(screen.getByPlaceholderText('Titre')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Contenu')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Auteur')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /publier/i })).toBeInTheDocument();
  });

  it('permet de saisir et soumettre un post', async () => {
    const onPostCreated = jest.fn();
    fetch.mockResolvedValueOnce({ ok: true });

    render(
      <>
        <PostForm onPostCreated={onPostCreated} />
        <ToastContainer />
      </>
    );

    fireEvent.change(screen.getByPlaceholderText('Titre'), { target: { value: 'Test titre' } });
    fireEvent.change(screen.getByPlaceholderText('Contenu'), { target: { value: 'Test contenu' } });
    fireEvent.change(screen.getByPlaceholderText('Auteur'), { target: { value: 'Jean' } });
    fireEvent.click(screen.getByRole('button', { name: /publier/i }));

    await waitFor(() => {
      expect(onPostCreated).toHaveBeenCalled();
    });
  });

  it("affiche un message d'erreur si la création de post échoue", async () => {
    fetch.mockResolvedValueOnce({ ok: false });

    render(
      <>
        <PostForm />
        <ToastContainer />
      </>
    );

    fireEvent.change(screen.getByPlaceholderText('Titre'), { target: { value: 'Titre erreur' } });
    fireEvent.change(screen.getByPlaceholderText('Contenu'), { target: { value: 'Contenu erreur' } });
    fireEvent.change(screen.getByPlaceholderText('Auteur'), { target: { value: 'Auteur erreur' } });
    fireEvent.click(screen.getByRole('button', { name: /publier/i }));

    // Vérifie la présence du toast d'erreur via son texte global
    const toast = await screen.findByText(/Erreur lors de la création du post/i);
    expect(toast).toBeInTheDocument();
  });

  it("soumet sans planter même si onPostCreated est undefined", async () => {
    fetch.mockResolvedValueOnce({ ok: true });

    render(
      <>
        <PostForm />
        <ToastContainer />
      </>
    );

    fireEvent.change(screen.getByPlaceholderText('Titre'), { target: { value: 'Test sans callback' } });
    fireEvent.change(screen.getByPlaceholderText('Contenu'), { target: { value: 'Contenu sans callback' } });
    fireEvent.change(screen.getByPlaceholderText('Auteur'), { target: { value: 'Auteur' } });

    fireEvent.click(screen.getByRole('button', { name: /publier/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });
  });
});
