// / <reference types="Cypress" />

describe('The Locations Hub', () => {
  it('successfully loads', () => {
    cy.visit('/#/locations');

    cy.get('header');
    cy.get('main');
    cy.get('footer');
    cy.get('h1');
  });
});
