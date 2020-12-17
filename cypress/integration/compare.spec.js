// / <reference types="Cypress" />

describe('The Compare Page', () => {
  it('successfully loads', () => {
    cy.visit('/#/compare');

    cy.get('header');
    cy.get('main');
    cy.get('footer');
    cy.get('h1');
  });
});
