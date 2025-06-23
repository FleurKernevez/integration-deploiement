/* global cy */
/// <reference types="cypress" />

describe('Liste des utilisateurs', () => {
    beforeEach(() => {
        // Simule un admin connecté
        window.localStorage.setItem('adminToken', 'fake-admin-token');

        cy.visit('http://localhost:3000');
    });

    it('affiche la liste des utilisateurs', () => {
    cy.get('[data-testid^=user-]').should('have.length.at.least', 1);
    cy.get('[data-testid^=user-email-]').first().should('contain.text', '@');
    });


  it('affiche les infos de base d’un utilisateur', () => {
    cy.get('li[data-testid^=user-]').first().within(() => {
        cy.contains('id:');
        cy.contains('Né(e) le');
        cy.contains('@');
    });
  });

  it('n’affiche pas de bouton de suppression sans token admin', () => {
    // Simule un utilisateur non admin
    window.localStorage.removeItem('adminToken');

    cy.visit('http://localhost:3000');

    cy.get('[data-testid^=delete-]').should('not.exist');
  });

  it('affiche un message s’il n’y a aucun utilisateur', () => {
    cy.intercept('GET', '**/users', {
      statusCode: 200,
      body: { utilisateurs: [] },
    });

    cy.visit('http://localhost:3000');
    cy.contains('Aucun utilisateur enregistré.');
  });
});
