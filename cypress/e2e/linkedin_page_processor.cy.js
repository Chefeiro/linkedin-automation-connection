// user.json e onde esta localizado email e senha para login!
import user from '../fixtures/user.json'


// Termos de pesquisa filtradas por 2 palavras chaves
// 1 palavra : Recrutador
// 2 palavra : cargo desejado
const searchTerm1 = "recruiter";
const searchTerm2 = "qa";


// A função base da URL que você passará para clickAllConnects.
// Adapte-a conforme a sua necessidade, garantindo que o &page= esteja no final
// ou que a sua URL base termine antes do parâmetro 'page'.
const BASE_SEARCH_URL = `https://www.linkedin.com/search/results/people/?geoUrn=%5B%22106057199%22%5D&keywords=%22${searchTerm1}%22%20AND%20%22hiring%22%20AND%20%22${searchTerm2}%22&origin=FACETED_SEARCH`;
const MAX_CLICKS_PER_PAGE = 5; // Um limite para evitar loops infinitos em uma única página

describe('Processando Conexões do LinkedIn por Página', () => {
  let clicksMade = 0; // Contador para cliques nesta página

  // Recebe o número da página via variável de ambiente
  const currentPage = Cypress.env('pageNumber');
  const currentUrl = `${BASE_SEARCH_URL}&page=${currentPage}&sid=y3r`;

  // Antes de cada teste
  before(() => {
    cy.visit('https://www.linkedin.com/login/pt')
    cy.get('#username').type(user.email)
    cy.wait(1000)
    cy.get('#password').type(user.senha)
    cy.wait(1000)
    cy.get('.btn__primary--large').click()
    cy.visit(currentUrl);
    cy.wait(4000); // Espera inicial para a página carregar
  });

  it(`Deve clicar em todos os botões "Connect" na Página ${currentPage}`, () => {
    function clickNextConnectButton() {
      if (clicksMade >= MAX_CLICKS_PER_PAGE) {
        cy.log(`Limite de cliques (${MAX_CLICKS_PER_PAGE}) atingido na Página ${currentPage}.`);
        return; // Sai da repetição
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
                  cy.log('Pop-up "Send without a note" não apareceu, continuando.. :)');
                }
              });

              cy.wait(1000);
              clicksMade++; // Incrementa o contador de cliques
              clickNextConnectButton(); // Chama para o próximo botão na mesma página
            });
        } else {
          cy.log(`Não há mais botões "Connect" visíveis na Página ${currentPage}.`);
        }
      });
    }

    // Inicia o processo de cliques para esta página
    clickNextConnectButton();
  });
});