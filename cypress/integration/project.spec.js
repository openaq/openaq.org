// / <reference types="Cypress" />

describe('The Project Hub', () => {
  it('successfully loads', () => {
    cy.visit('/#/project/AirNow');

    cy.get('header');
    cy.get('main');
    cy.get('footer');
    cy.get('h1');
  });
});
