import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PostForm from './PostForm';

global.fetch = jest.fn();

describe('PostForm (minimal)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('rend le formulaire', () => {
    render(<PostForm />);
    expect(screen.getByPlaceholderText('Titre')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Contenu')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Auteur')).toBeInTheDocument();
  });

  it('appelle fetch lors de la soumission', async () => {
    fetch.mockResolvedValueOnce({ ok: true });
    render(<PostForm />);
    fireEvent.change(screen.getByPlaceholderText('Titre'), { target: { value: 'T' } });
    fireEvent.change(screen.getByPlaceholderText('Contenu'), { target: { value: 'C' } });
    fireEvent.change(screen.getByPlaceholderText('Auteur'), { target: { value: 'A' } });
    fireEvent.click(screen.getByRole('button', { name: /publier/i }));
    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });
  });
}); 