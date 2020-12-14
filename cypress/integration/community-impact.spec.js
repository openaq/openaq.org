// / <reference types="Cypress" />

describe('The Community Impact Page', () => {
  it('successfully loads', () => {
    cy.visit('/#/community/projects');

    cy.get('header');
    cy.get('main');
    cy.get('footer');
    cy.get('h1');
  });
});
