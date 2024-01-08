describe('MadreDeDiosComponent ', () => {
  beforeEach(() => {
    cy.visit('/');
  });
  it('la page se charge', () => {
    cy.get('[data-cy=title]').should('La Madre de Dios');
    cy.get('[data-cy=playBtn]').should('exist');
    cy.get('[data-cy=inputData]').should('exist');
  });
  it('Play', () => {
    cy.get('[data-cy=inputData]').type(
      `C - 3 - 4\nM - 1 - 0\nM - 2 - 1\nT - 0 - 3 - 2\nT - 1 - 3 - 3\nA - Lara - 1 - 1 - S - AADADAGGA`
    );
    cy.get('[data-cy=playBtn]').click();
  });
});
