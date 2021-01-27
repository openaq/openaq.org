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
    cy.get('h1').should('contain', 'Location');
    cy.get('.inpage__introduction').should(
      'contain',
      'We are currently collecting data in'
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
    cy.get('.hub-filters').should('exist');

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

    // source filter
    cy.get('[title="View source options"]').click();
    cy.get('[title="View source options"]')
      .find('span')
      .contains('Data Source');
    cy.get('[data-cy=filter-sources]')
      .find('[data-cy=boston_methane]')
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
    cy.get('[data-cy=location-card-detail-label]').contains('Collection dates');
    cy.get('[data-cy=location-card-detail-label]').contains('Measurements');
    cy.get('[data-cy=location-card-detail-label]').contains('Parameters');
    cy.get('[data-cy=location-card-detail-label]').contains('Source');
  });

  it('Pagination is reset on filter change', () => {
    cy.get('.pages__page[aria-label="Page 2"]').click();
    cy.location().should(loc => {
      const search = loc.href.split('?');
      expect(search).to.include('page=2');
    });

    cy.get('[title="View country options"]').click();
    cy.get('[title="View country options"]').find('span').contains('Country');
    cy.get('[data-cy=filter-countries]')
      .find('[data-cy=Australia]')
      .should('length', 1);
    cy.get('[data-cy=filter-menu-item]').first().click();
    cy.location().should(loc => {
      expect(loc.hash).to.include('page=1');
    });
  });
});
