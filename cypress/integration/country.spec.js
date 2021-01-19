// / <reference types="Cypress" />
// import country from '../fixtures/country.json';

describe('The Country Page', () => {
  it('successfully loads', () => {
    cy.visit('/#/countries/CY');

    cy.get('header');
    cy.get('main');
    cy.get('footer');
    cy.get('h1');
  });

  it('displays header with all its content', () => {
    cy.get('[data-cy=country-page').should('exist');
    cy.get('[data-cy=country-header-tagline').contains('Country');
    cy.get('[data-cy=country-header-title').contains('Cyprus');

    cy.get('[data-cy=country-header-stats').should('exist');
    cy.get('[data-cy=country-header-stat-locations').should('exist');
    cy.get('[data-cy=country-header-stat-measurements').should('exist');
    cy.get('[data-cy=country-header-stat-sources').should('exist');

    // tests that the link should open in a new tab
    cy.get('[data-cy=header-apidocs-btn').should(
      'have.attr',
      'target',
      '_blank'
    );

    cy.get('[data-cy=header-download-btn').contains('Download');
  });

  it('displays a map', () => {
    // cy.get('[data-cy=loading-message').should('exist');
    // TODO: plug in fixture to display map
  });

  it('displays a displays region sections with cards', () => {
    cy.get('[data-cy=country-list').should('exist');
    // TODO: add more tests
  });
});
