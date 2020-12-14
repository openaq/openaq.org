// / <reference types="Cypress" />

describe('The Community Workshops Page', () => {
  it('successfully loads', () => {
    cy.visit('/#/community/workshops');

    cy.get('header');
    cy.get('main');
    cy.get('footer');
    cy.get('h1');
  });
});
