import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import '@testing-library/jest-dom';

describe('Composant App', () => {
  it('affiche le titre principal', () => {
    render(<App />);
    const heading = screen.getByText(/mon formulaire/i);
    expect(heading).toBeInTheDocument();
  });

  it('affiche le FormComponent', () => {
    render(<App />);
    const button = screen.getByRole('button', { name: /enregistrer/i });
    expect(button).toBeInTheDocument();
  });
});
