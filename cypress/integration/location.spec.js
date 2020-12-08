// / <reference types="Cypress" />

describe('The Location Page', () => {
  it('successfully loads', () => {
    cy.visit('/#/location/2');

    cy.get('header');
    cy.get('main');
    cy.get('footer');
    cy.get('h1');
  });
});
