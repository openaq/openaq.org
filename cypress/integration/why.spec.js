// / <reference types="Cypress" />

describe('The Why Page', () => {
  it('successfully loads', () => {
    cy.visit('/#/why');

    cy.get('header');
    cy.get('main');
    cy.get('footer');
    cy.get('h1');
  });
});
