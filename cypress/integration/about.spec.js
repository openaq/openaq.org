// / <reference types="Cypress" />

describe('The About Page', () => {
  it('successfully loads', () => {
    cy.visit('/#/about');

    cy.get('header');
    cy.get('main');
    cy.get('footer');
    cy.get('h1');
  });
});
