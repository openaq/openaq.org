// / <reference types="Cypress" />

describe('The About Page', () => {
  before(() => {
    cy.visit('/#/about');
  });

  it('successfully loads', () => {
    cy.get('header');
    cy.get('main');
    cy.get('footer');
    cy.get('h1');
  });

  it('renders 3 principles', () => {
    cy.get('.principles-list .card--principle').should('have.length', 3);
  });

  it('renders 21 team and board members', () => {
    cy.get('.team-list .team-member').should('have.length', 21);
  });

  it('renders 22 sponsors', () => {
    cy.get('.sponsor').should('have.length', 22);
  });

  it('provides the Form 990 to download', () => {
    cy.get('.button-book-download').should(
      'have.attr',
      'href',
      '/assets/files/openaq-990-2020.pdf'
    );
  });
});
