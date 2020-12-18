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

    // source filter
    cy.get('[title="source__filter"]').click();
    cy.get('[title="source__filter"]').find('span').contains('Data Source');
    cy.get('[data-cy=filter-sources]')
      .find('[data-cy=AirNow]')
      .should('length', 1);
    cy.get('[data-cy=filter-menu-item]').first().click();

    cy.get('[data-cy=filter-pill]').should('exist');

    cy.get('[data-cy=filter-clear]').contains('Clear Filters').should('exist');
    cy.get('[data-cy=filter-clear]').click();
    cy.get('[data-cy=filter-clear]').should('not.exist');
  });

  it('has some location cards', () => {
    cy.get('[data-cy=location-card]').should('exist');
    cy.get('[data-cy=location-card-title]').should('exist');
    cy.get('[data-cy=location-card-detail]').should('exist');
    cy.get('[data-cy=location-card-detail-label]').contains(
      'Collection started'
    );
    cy.get('[data-cy=location-card-detail-label]').contains('Measurements');
    cy.get('[data-cy=location-card-detail-label]').contains('Parameters');
    cy.get('[data-cy=location-card-detail-label]').contains('Source');
  });
});
