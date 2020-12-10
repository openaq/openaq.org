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
    cy.get('h1').should('contain', 'Browse by Country');
    cy.get('.inpage__introduction').should(
      'contain',
      'We are currently collecting data in 82 different countries and are always seeking to add more. We aggregate PM2.5, PM10, ozone (O3), sulfur dioxide (SO2), nitrogen dioxide (NO2), carbon monoxide (CO), and black carbon (BC) from real-time government and research grade sources. If you cannot find the location that you are looking for, please '
    );
  });

  it('has a results section with a list of country cards', () => {
    cy.get('.card').should('have.length', 82);
  });
});
