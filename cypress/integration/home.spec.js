// / <reference types="Cypress" />

describe('The Home Page', () => {
  it('successfully loads', () => {
    cy.visit('/');

    cy.get('header');
    cy.get('main');
    cy.get('footer');
    cy.get('h1');
  });
})
;
