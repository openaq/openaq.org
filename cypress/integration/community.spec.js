// / <reference types="Cypress" />

describe('The Community Page', () => {
  it('successfully loads', () => {
    cy.visit('/#/community');

    cy.get('header');
    cy.get('main');
    cy.get('footer');
    cy.get('h1');
  });
});
