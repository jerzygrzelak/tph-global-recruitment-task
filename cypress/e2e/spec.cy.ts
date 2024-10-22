describe('template spec', () => {
  describe('Login Page', () => {
    beforeEach(() => {
      cy.visit('https://tph-global-recruitment-task.vercel.app/auth/login');
    });

    it('should display login instructions.', () => {
      cy.contains('Welcome back!').should('be.visible');
      cy.contains('login: quicktrader@crypto.com, password: 123').should('be.visible');
    });

    it('should prefill the email field.', () => {
      cy.get('input[name="email"]').should('have.value', 'quicktrader@crypto.com');
    });

    it('should allow user to log in and redirect to the main page.', () => {
      cy.get('input[name="password"]').type('123');
      cy.get('button[type="submit"]').click();

      cy.get('button[type="submit"]')
          .should('contain', 'Logging in...')
          .should('be.disabled');

      cy.url().should('eq', 'https://tph-global-recruitment-task.vercel.app/');
    });
  });

  describe('Main Page - Stocks and Summary Tables', () => {
    beforeEach(() => {
      cy.visit('https://tph-global-recruitment-task.vercel.app');
    });

    it('should display two tables, one for stocks and one for summary.', () => {
      cy.get('.ag-theme-alpine').should('have.length', 2);

      cy.get('h1').first().within(() => {
        cy.contains('Stocks').should('exist');
      });

      cy.get('h1').last().within(() => {
        cy.contains('Summary').should('exist');
      });
    });

    it('should display stock data in the Stocks table.', () => {
      cy.get('.ag-theme-alpine').first().within(() => {
        cy.get('.ag-row').should('have.length', 3);
      });
    });

    it('should display summary data in the Summary table.', () => {
      cy.get('.ag-theme-alpine').last().within(() => {
        cy.get('.ag-row').should('have.length', 1);
      });
    });

    it('should export the stock data to CSV when clicking the Export button.', () => {
      cy.contains('Export to CSV').should('exist').then(() => {
        cy.contains('Export to CSV').click();

        cy.readFile('cypress\\Downloads\\stock_data.csv').should('exist');
      });
    });

    it('should log out and redirect to the login page when clicking the logout button.', () => {
      cy.contains('Log out').should('exist').then(() => {
        cy.contains('Log out').click();

        cy.location('pathname').should('eq', '/auth/login')
      });
    });
  });
})