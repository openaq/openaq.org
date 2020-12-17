// / <reference types="Cypress" />

describe('The World Map', () => {
  it('successfully loads', () => {
    cy.visit('/#/map');

    cy.get('header');
    cy.get('main');
    cy.get('footer');
    cy.get('h1');
  });
});
