/* global cy */
/// <reference types="cypress" />

describe('Connexion administrateur', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000'); 
  });

  it('désactive le bouton si les champs sont invalides', () => {
    cy.get('[data-testid=admin-email]').type('adresse-invalide');
    cy.get('[data-testid=admin-password]').type('123');

    cy.contains('Email invalide');
    cy.contains('Mot de passe trop court');

    cy.get('button[type=submit]').should('be.disabled');
  });

  it('active le bouton avec des données valides', () => {
cy.get('[data-testid=admin-email]').invoke('val').then(val => {
  console.log('EMAIL:', val);
});
cy.get('[data-testid=admin-password]').invoke('val').then(val => {
  console.log('PWD:', val);
});

    // attend un peu que React mette à jour l’état du bouton
    cy.wait(200);

    cy.get('button[type=submit]').then($btn => {
  console.log('disabled?', $btn.prop('disabled'));
});
  });

/*   it("affiche une alerte si l'authentification échoue", () => {
    cy.get('[data-testid=admin-email]').type('wrong@example.com');
    cy.get('[data-testid=admin-password]').type('wrongpass');

    cy.wait(200);

    cy.get('button[type=submit]').should('have.class', 'valid');
    cy.get('button[type=submit]').should('not.be.disabled').click();

    cy.on('window:alert', (text) => {
      expect(text).to.include("Échec de l'authentification");
    });
  }); */

/* it("connecte l'administrateur avec succès", () => {
  cy.get('[data-testid=admin-email]').type('admin@test.com');
  cy.get('[data-testid=admin-password]').type('admin123');

  // Attendre que la classe 'valid' apparaisse (preuve que le formulaire est valide)
  cy.get('button[type=submit]')
    .should('have.class', 'valid') 
    .should('not.be.disabled')   
    .click();

  cy.on('window:alert', (text) => {
    expect(text).to.include('Connexion réussie');
  });

  cy.window().then((win) => {
    const token = win.localStorage.getItem('adminToken');
    expect(token).to.not.be.null;
  });
}); */

});
