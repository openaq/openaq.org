// / <reference types="Cypress" />

describe('The Countries Hub', () => {
  before(() => {
    cy.visit('/#/countries');
  });

  it('successfully loads', () => {
    cy.get('header');
    cy.get('main');
    cy.get('footer');
    cy.get('h1');
  });

  it('has a header with title and description', () => {
    cy.get('h1').should('contain', 'Country');
    cy.get('.inpage__introduction').should(
      'contain',
      'We are currently collecting data in'
    );
  });

  it('has a results section with a list of country cards', () => {
    cy.get('.card').should('have.length.gt', 2);
  });
});
