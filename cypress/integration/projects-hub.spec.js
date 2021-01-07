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
    // parameter filter
    cy.get('[title="type__filter"]').click();
    cy.get('[title="type__filter"]').find('span').contains('Parameter');
    ['O3', 'CO', 'NO2', 'CO2', 'SO2', 'BC'].forEach(parameter => {
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
    cy.get('[title="country__filter"]').click();
    cy.get('[title="country__filter"]').find('span').contains('Country');
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
