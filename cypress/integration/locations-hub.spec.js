// / <reference types="Cypress" />

describe('The Locations Hub', () => {
  before(() => {
    cy.visit('/#/locations');
  });

  it('successfully loads', () => {
    cy.get('header');
    cy.get('main');
    cy.get('footer');
    cy.get('h1');
  });

  it('has a header with title and description', () => {
    cy.get('h1').should('contain', 'Locations');
    cy.get('.inpage__introduction').should(
      'contain',
      'Lorem ipsum dolor sit amet'
    );
  });

  it('has a results section with a list of location cards', () => {
    cy.get('.results-summary')
      .invoke('text')
      .should('match', /A total of \d+ locations were found/);

    cy.get('.card').should('have.length', 15);
    cy.get('.pagination').should('exist');
  });

  it('has some filters with dropdown menus', () => {
    cy.get('.filters').should('exist');

    cy.get('[title="type__filter"]').click();
    cy.get('.drop__menu-item').first().click();

    cy.get('.button--filter-pill').should('exist').and('be.visible');
    cy.get('button').contains('Clear Filters').should('exist');

    cy.get('.button--filter-pill').click();
    cy.get('.button--filter-pill').should('not.exist');
  });
});
