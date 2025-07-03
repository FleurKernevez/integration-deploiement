/* global cy */
describe('Posts', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
    localStorage.clear();
    // Simule un user connecté avec prénom
    window.localStorage.setItem('userFirstName', 'Jean');
  });

  it('affiche le formulaire de post', () => {
    cy.contains('Créer un nouveau post');
    cy.get('input[placeholder="Titre"]').should('exist');
    cy.get('textarea[placeholder="Contenu"]').should('exist');
    cy.get('input[placeholder="Auteur"]').should('exist');
  });

  it('crée un post et l’affiche', () => {
    cy.get('input[placeholder="Titre"]').type('Mon post e2e');
    cy.get('textarea[placeholder="Contenu"]').type('Ceci est un test e2e');
    cy.get('input[placeholder="Auteur"]').type('Auteur aléatoire');
    cy.get('button[type=submit]').click();
    cy.contains('Mon post e2e');
    cy.contains('Ceci est un test e2e');
    cy.contains('Par Auteur aléatoire');
  });

}); 