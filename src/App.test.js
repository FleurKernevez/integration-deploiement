import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import '@testing-library/jest-dom';

// Mock des sous-composants pour isoler App
jest.mock('./components/FormComponent/FormComponent', () => () => <div data-testid="mock-form">Mock FormComponent</div>);
jest.mock('./components/ListComponent/ListComponent', () => () => <div data-testid="mock-list">Mock ListComponent</div>);
jest.mock('./components/AdminLoginForm/AdminLoginForm', () => () => <div data-testid="mock-admin">Mock AdminLoginForm</div>);
jest.mock('./components/Post/Post', () => () => <div data-testid="mock-post">Mock Post</div>);

describe('App component', () => {
  it('affiche le titre principal', () => {
    render(<App />);
    expect(screen.getByText(/Connection Admin/i)).toBeInTheDocument();
    expect(screen.getByText(/Mon formulaire/i)).toBeInTheDocument();
  });

  it('affiche tous les sous-composants', () => {
    render(<App />);
    expect(screen.getByTestId('mock-admin')).toBeInTheDocument();
    expect(screen.getByTestId('mock-form')).toBeInTheDocument();
    expect(screen.getByTestId('mock-list')).toBeInTheDocument();
    expect(screen.getByTestId('mock-post')).toBeInTheDocument();
  });
});
