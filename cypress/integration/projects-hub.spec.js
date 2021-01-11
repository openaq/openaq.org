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
  });

  it('has some filters with dropdown menus', () => {
    // parameter filter
    cy.get('[title="View parameter options"]').click();
    cy.get('[title="View parameter options"]')
      .find('span')
      .contains('Parameter');
    ['1', '2', '3', '4', '5', '6'].forEach(parameter => {
      cy.get('[data-cy=filter-parameters]')
        .find(`[data-cy=${parameter}]`)
        .should('length', 1);
    });
    cy.get('[data-cy=filter-menu-item]').first().click();

    cy.get('[data-cy=filter-pill]').should('exist');

    cy.get('[data-cy=filter-clear]').contains('Clear Filters').should('exist');
    cy.get('[data-cy=filter-clear]').click();
    cy.get('[data-cy=filter-clear]').should('not.exist');

    // country filter
    cy.get('[title="View country options"]').click();
    cy.get('[title="View country options"]').find('span').contains('Country');
    cy.get('[data-cy=filter-countries]')
      .find('[data-cy=Australia]')
      .should('length', 1);
    cy.get('[data-cy=filter-menu-item]').first().click();

    cy.get('[data-cy=filter-pill]').should('exist');

    cy.get('[data-cy=filter-clear]').contains('Clear Filters').should('exist');
    cy.get('[data-cy=filter-clear]').click();
    cy.get('[data-cy=filter-clear]').should('not.exist');
  });

  it('has some project cards', () => {
    cy.get('[data-cy=project-card]').should('exist');
    cy.get('[data-cy=project-card-title]').should('exist');
    cy.get('[data-cy=project-card-detail]').should('exist');
    cy.get('[data-cy=project-card-detail-label]').contains('Locations');
    cy.get('[data-cy=project-card-detail-label]').contains('Measurements');
    cy.get('[data-cy=project-card-detail-label]').contains('Collection dates');
    cy.get('[data-cy=project-card-detail-label]').contains('Parameters');
  });
});
