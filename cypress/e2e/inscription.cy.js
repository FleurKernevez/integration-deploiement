/* global cy */
/// <reference types="cypress" />

describe('Formulaire d’inscription', () => {
  beforeEach(() => {
    // Visite la page d’accueil contenant le FormComponent
    cy.visit('http://localhost:3000');
  });

   /* it('remplit et soumet le formulaire avec succès', () => {
    cy.get('[data-testid=user-firstName]').type('Jean').should('have.value', 'Jean');
    cy.get('[data-testid=user-lastName]').type('Dupont').should('have.value', 'Dupont');
    cy.get('[data-testid=user-email]').type('jean.dupont@test.com').should('have.value', 'jean.dupont@test.com');
    cy.get('[data-testid=user-dateOfBirth]').type('2000-01-01').should('have.value', '2000-01-01');
    cy.get('[data-testid=user-city]').type('Paris').should('have.value', 'Paris');
    cy.get('[data-testid=user-postalCode]').type('75000').should('have.value', '75000');

    // Attendre un peu pour laisser React mettre à jour isFormValid
    cy.wait(200); // ← Essentiel ici

    cy.get('button[type=submit]').should('not.be.disabled').click();

    cy.on('window:alert', (str) => {
      expect(str).to.include('Utilisateur enregistré avec succès!');
    });
  });
 */

  it('affiche des messages d’erreur si des champs sont invalides', () => {
    // Remplit les champs avec des valeurs invalides
    cy.get('[data-testid=user-email]').type('email-invalide');
    cy.get('[data-testid=user-postalCode]').type('abc');
    cy.get('[data-testid=user-firstName]').clear().type('1');
    cy.get('[data-testid=user-lastName]').clear().type('1');
    cy.get('[data-testid=user-dateOfBirth]').clear().type('2024-01-01'); // trop jeune
    cy.get('[data-testid=user-city]').clear().type('1');

    // Vérifie la présence des messages d’erreur
    cy.contains('Email invalide');
    cy.contains('Code postal invalide');
    cy.contains('Nom invalide');
    cy.contains('Prénom invalide');
    cy.contains("La date doit être valide et l'utilisateur majeur");
    cy.contains('Nom de ville invalide');

    // Le bouton doit rester désactivé
    cy.get('button[type=submit]').should('be.disabled');
  });
});
