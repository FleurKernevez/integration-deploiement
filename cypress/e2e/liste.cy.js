/* global cy */
describe('Liste des utilisateurs', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
    localStorage.clear();
  });

  it('affiche la liste des utilisateurs', () => {
    cy.get('h2').contains('Liste des inscrits');
    cy.get('li[data-testid^=user-]').should('exist');
  });

  it('affiche les infos de base d’un utilisateur', () => {
    cy.get('li[data-testid^=user-]').first().within(() => {
      cy.contains('id:');
      cy.contains('Né(e) le');
      cy.contains('@');
    });
  });

  it('n’affiche pas de bouton de suppression sans token admin', () => {
    cy.get('[data-testid^=delete-]').should('not.exist');
  });

  it('affiche le bouton de suppression en mode admin', () => {
    window.localStorage.setItem('adminToken', 'fake-admin-token');
    cy.visit('http://localhost:3000');
    cy.get('[data-testid^=delete-]').should('exist');
  });
});
