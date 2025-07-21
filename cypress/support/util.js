
// A função base da URL que você passará para clickAllConnects.
// Adapte-a conforme a sua necessidade, garantindo que o &page= esteja no final
// ou que a sua URL base termine antes do parâmetro 'page'.
const BASE_SEARCH_URL = "https://www.linkedin.com/search/results/people/?geoUrn=%5B%22106057199%22%5D&keywords=%22recruiter%22%20AND%20%22hiring%22%20AND%20%22qa%22&origin=FACETED_SEARCH";

// Você pode definir um limite máximo de páginas para evitar loops infinitos
const MAX_PAGES = 50; // Exemplo: para processar até a página 10

export function clickAllConnects(currentPage = 1) {
  // Constrói a URL completa para a página atual
  const currentUrl = `${BASE_SEARCH_URL}&page=${currentPage}&sid=y3r`; // Garanta que &sid=y3r esteja incluído se for fixo

  // Espera a página carregar completamente antes de interagir com os elementos
  cy.wait(4000); // Um tempo de espera razoável para a página renderizar após o cy.visit

  // 1. Busca todos os botões "Connect" visíveis e válidos
  // Mantemos um timeout generoso para a carga dos botões 'Connect' na nova página
  cy.get('.artdeco-button--secondary:visible', { timeout: 15000 }).then($buttons => {
    const connectButtons = $buttons.filter((i, btn) =>
      btn.innerText.trim().toLowerCase().includes('connect')
    );

    if (connectButtons.length > 0) {
      cy.wait(1200);
      // Se houver botões "Connect" na página atual
      cy.log(`Encontrado ${connectButtons.length} botões "Connect" na Página ${currentPage}. Clicando no primeiro...`);
      cy.wrap(connectButtons[0])
        .click({ force: true })
        .then(() => {
          cy.wait(800); // Pequena espera para a ação ser processada

          // Verifica se o pop-up "Send without a note" aparece e clica nele
          // Usamos cy.get() com um timeout curto e .then() para não falhar se o pop-up não aparecer.
          cy.get("[aria-label='Send without a note']", { timeout: 3000 }).then($sendWithoutNoteButton => {
            if ($sendWithoutNoteButton.length > 0) {
              cy.log('Pop-up "Send without a note" encontrado. Clicando...');
              cy.wrap($sendWithoutNoteButton).click({ force: true });
              cy.wait(1200); // Espera para o pop-up fechar
            } else {
              cy.log('Pop-up "Send without a note" não apareceu, continuando...');
            }
          });

          cy.wait(1000); // Espera adicional antes de procurar o próximo "Connect"

          // Chama a função novamente para processar o próximo "Connect" na mesma página
          // A lógica de navegação para a próxima página só ocorre quando não há mais connects.
          clickAllConnects(currentPage);
        });

    } else {
      cy.wait(1500);
      // 2. Se não há mais botões "Connect" nesta página, avança para a próxima URL
      cy.log(`Não há mais botões "Connect" na Página ${currentPage}. Preparando para a próxima página...`);

      const nextPage = currentPage + 1;
      cy.visit(currentUrl);

      // Verifica se atingimos o limite máximo de páginas
      if (nextPage <= MAX_PAGES) {
        cy.log(`Redirecionando para a Próxima Página: ${nextPage}`);
        cy.wait(1200);
        // Chama a função recursivamente com o novo número da página, que irá navegar via cy.visit
        clickAllConnects(nextPage);
      } else {
        cy.log(`Limite máximo de páginas (${MAX_PAGES}) atingido. Finalizando o processo de conexão.`);
      }
    }
  });
}