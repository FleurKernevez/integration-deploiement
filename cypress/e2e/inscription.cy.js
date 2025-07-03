/* global cy */
describe('Formulaire d’inscription', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
    localStorage.clear();
  });

  it('remplit et soumet le formulaire avec succès', () => {
    cy.get('[data-testid=user-firstName]').type('Jean');
    cy.get('[data-testid=user-lastName]').type('Dupont');
    cy.get('[data-testid=user-email]').type('jean.dupont@test.com');
    cy.get('[data-testid=user-dateOfBirth]').type('2000-01-01');
    cy.get('[data-testid=user-city]').type('Paris');
    cy.get('[data-testid=user-postalCode]').type('75000');
    cy.get('button[type=submit]').should('not.be.disabled').click();
    cy.on('window:alert', (str) => {
      expect(str).to.include('Utilisateur enregistré avec succès');
    });
    cy.window().then((win) => {
      // eslint-disable-next-line no-unused-expressions
      expect(win.localStorage.getItem('formData')).to.exist;
    });
  });

  it('affiche des messages d’erreur si des champs sont invalides', () => {
    cy.get('[data-testid=user-email]').type('email-invalide');
    cy.get('[data-testid=user-postalCode]').type('abc');
    cy.get('[data-testid=user-firstName]').clear().type('1');
    cy.get('[data-testid=user-lastName]').clear().type('1');
    cy.get('[data-testid=user-dateOfBirth]').clear().type('2024-01-01');
    cy.get('[data-testid=user-city]').clear().type('1');
    cy.contains('Email invalide');
    cy.contains('Code postal invalide');
    cy.contains('Nom invalide');
    cy.contains('Prénom invalide');
    cy.contains("La date doit être valide et l'utilisateur majeur");
    cy.contains('Nom de ville invalide');
    cy.get('button[type=submit]').should('be.disabled');
  });
});
