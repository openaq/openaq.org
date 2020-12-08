// / <reference types="Cypress" />

describe('The Countries Hub', () => {
  it('successfully loads', () => {
    cy.visit('/#/countries');

    cy.get('header');
    cy.get('main');
    cy.get('footer');
    cy.get('h1');
  });
});
