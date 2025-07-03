/* global cy */
describe('Connexion administrateur', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
    localStorage.clear();
  });

  it('affiche le formulaire de connexion', () => {
    cy.contains('Connexion administrateur');
    cy.get('[data-testid=admin-email]').should('exist');
    cy.get('[data-testid=admin-password]').should('exist');
  });

  it('refuse une connexion avec mauvais mot de passe', () => {
    cy.get('[data-testid=admin-email]').type('loise.fenoll@ynov.com');
    cy.get('[data-testid=admin-password]').type('wrongpassword');
    cy.get('button[type=submit]').click();
    cy.on('window:alert', (str) => {
      expect(str).to.include('Échec de l\'authentification');
    });
  });

  it('accepte une connexion valide et stocke le prénom', () => {
    cy.get('[data-testid=admin-email]').type('loise.fenoll@ynov.com');
    cy.get('[data-testid=admin-password]').type('PvdrTAzTeR247sDnAZBr');
    cy.get('button[type=submit]').click();
    cy.on('window:alert', (str) => {
      expect(str).to.include('Connexion réussie');
    });
    cy.window().then((win) => {
      // eslint-disable-next-line no-unused-expressions
      expect(win.localStorage.getItem('adminToken')).to.exist;
      // eslint-disable-next-line no-unused-expressions
      expect(win.localStorage.getItem('userFirstName')).to.exist;
    });
  });
});

