// / <reference types="Cypress" />

describe('The Compare Page', () => {
  it('successfully loads', () => {
    cy.visit('/#/compare');

    cy.get('header');
    cy.get('main');
    cy.get('footer');
    cy.get('h1');
  });

  it('can render with a location selected', () => {
    cy.visit('/#/compare/4724');

    cy.get('header');
    cy.get('main');
    cy.get('footer');
    cy.get('h1');
  });
});
