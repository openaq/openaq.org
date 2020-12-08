// / <reference types="Cypress" />

describe('The Projects Hub', () => {
  it('successfully loads', () => {
    cy.visit('/#/projects');

    cy.get('header');
    cy.get('main');
    cy.get('footer');
    cy.get('h1');
  });
});
