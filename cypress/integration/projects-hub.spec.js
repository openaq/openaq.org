// / <reference types="Cypress" />

describe('The Projects Hub', () => {
  before(() => {
    cy.visit('/#/projects');
  });

  it('successfully loads', () => {
    cy.get('header');
    cy.get('main');
    cy.get('footer');
    cy.get('h1');
  });

  it('has a header with title and description', () => {
    cy.get('h1').should('contain', 'Datasets');
    cy.get('.inpage__introduction').should(
      'contain',
      'Lorem ipsum dolor sit amet'
    );
  });

  it('has a results section with a list of project cards', () => {
    cy.get('[data-cy=results-summary]')
      .invoke('text')
      .should('match', /A total of \d+ datasets were found/);

    cy.get('.card').should('have.length', 15);
    cy.get('.pagination').should('exist');
  });

  it('has some filters with dropdown menus', () => {
    cy.get('[title="type__filter"]').click();
    cy.get('[data-cy=filter-parameters]')
      .contains('li', 'BC')
      .should('length', 1);
    cy.get('[data-cy=filter-menu-item]').first().click();

    cy.get('[data-cy=filter-pill]').should('exist');

    cy.get('[data-cy=filter-clear]').contains('Clear Filters').should('exist');
    cy.get('[data-cy=filter-clear]').click();
  });
});
