/// <reference types="cypress" />

context('Navigation', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('renders the navigation menu', () => {
    cy.get('#page-prime-nav').should('exist');

    cy.get('.global-menu')
      .find('a')
      .contains('Home')
      .parent()
      .should('have.attr', 'href', '#/');

    cy.get('.global-menu')
      .find('a')
      .contains('Why open air quality?')
      .parent()
      .should('have.attr', 'href', '#/why');

    cy.get('.global-menu')
      .find('a')
      .contains('Open data')
      .parent()
      .should('have.attr', 'href', '#nav-group-open-data');

    cy.get('.global-menu')
      .find('a')
      .contains('Community')
      .parent()
      .should('have.attr', 'href', '#nav-group-community');

    cy.get('.global-menu')
      .find('a')
      .contains('Blog')
      .parent()
      .should('have.attr', 'href', 'https://medium.com/@openaq');

    cy.get('.global-menu')
      .find('a')
      .contains('About us')
      .parent()
      .should('have.attr', 'href', '#nav-group-about');
  });

  it("going back or forward in the browser's history is possible", () => {
    // https://on.cypress.io/go

    cy.get('nav').contains('Why').click({ force: true });
    cy.location('hash').should('contain', 'why');

    cy.go('back');
    cy.location('hash').should('not.contain', 'why');

    cy.go('forward');
    cy.location('hash').should('contain', 'why');

    // clicking back
    cy.go(-1);
    cy.location('hash').should('not.contain', 'why');

    // clicking forward
    cy.go(1);
    cy.location('hash').should('contain', 'why');
  });

  it('reloading the page maintains the url', () => {
    // https://on.cypress.io/reload

    cy.get('nav').contains('Why').click({ force: true });
    cy.location('hash').should('contain', 'why');

    cy.reload();
    cy.location('hash').should('contain', 'why');

    // reload the page without using the cache
    cy.reload(true);
    cy.location('hash').should('contain', 'why');
  });

  it('visiting a remote url directly loads the respective page', () => {
    // https://on.cypress.io/visit

    cy.visit('/#/why', {
      timeout: 50000, // increase total time for the visit to resolve
      onBeforeLoad(contentWindow) {
        // contentWindow is the remote page's window object
        expect(typeof contentWindow === 'object').to.be.true;
      },
      onLoad(contentWindow) {
        // contentWindow is the remote page's window object
        expect(typeof contentWindow === 'object').to.be.true;
      },
    });

    cy.location('hash').should('contain', 'why');
    cy.get('main').contains('Why open air quality?');
  });
});
