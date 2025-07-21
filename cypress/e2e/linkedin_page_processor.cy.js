
const BASE_SEARCH_URL = `https://www.linkedin.com/search/results/people/?geoUrn=%5B%22106057199%22%5D&keywords=%22${Cypress.env('searchTerm1')}%22%20AND%20%22hiring%22%20AND%20%22${Cypress.env('searchTerm2')}%22&origin=FACETED_SEARCH`;

const MAX_CLICKS_PER_PAGE = 5; 

describe('Processando Conexões do LinkedIn por Página', () => {
  let clicksMade = 0; 

  const currentPage = Cypress.env('pageNumber');
  const currentUrl = `${BASE_SEARCH_URL}&page=${currentPage}&sid=y3r`;

 
  before(() => {
 
    cy.visit('https://www.linkedin.com/login'); 
    cy.url().then(url => {
      if (!url.includes('feed')) { 
        cy.log('Não logado, realizando login...');
        cy.get('#username:visible', { timeout: 15000 }).type(Cypress.env('linkedinEmail'));
        cy.get('#password:visible', { timeout: 15000 }).type(Cypress.env('linkedinPassword'));
        cy.get('.login__form_action_container > button').click();
        cy.wait(1000); 
        cy.url().should('include', 'https://www.linkedin.com/feed/')
      } 
    });


    cy.visit(currentUrl);
    cy.wait(3000); 
  });

  it(`Deve clicar em todos os botões "Connect" na Página ${currentPage}`, () => {
    function clickNextConnectButton() {
      if (clicksMade >= MAX_CLICKS_PER_PAGE) {
        cy.log(`Limite de tentativas (${MAX_CLICKS_PER_PAGE}) atingido na Página ${currentPage}.`);
        return;
      }
      cy.get('.artdeco-button--secondary:visible', { timeout: 15000 }).then($buttons => {
        const connectButtons = $buttons.filter((i, btn) =>
          btn.innerText.trim().toLowerCase().includes('connect')
        );

        if (connectButtons.length > 0) {
          cy.wait(1200);
          cy.log(`Encontrado ${connectButtons.length} botões "Connect" na Página ${currentPage}. Clicando no ${clicksMade + 1}º...`);
          cy.wrap(connectButtons[0]).click({ force: true }).then(() => {
              cy.wait(800);

              cy.get("[aria-label='Send without a note']", { timeout: 3000 }).then($sendWithoutNoteButton => {
                if ($sendWithoutNoteButton.length > 0) {
                  cy.log('Pop-up "Send without a note" encontrado. Clicando...');
                  cy.wrap($sendWithoutNoteButton).click({ force: true });
                  cy.wait(1200);
                } else {
                  cy.log('Pop-up "Send without a note" não apareceu, continuando...');
                }
              });

              cy.wait(1000);
              clicksMade++;
              clickNextConnectButton(); 
            });
        } else {
          cy.log(`Não há mais botões "Connect" visíveis na Página ${currentPage}.`);
        }
      });
    }

 
    clickNextConnectButton();
  });
});