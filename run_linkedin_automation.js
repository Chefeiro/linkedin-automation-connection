const cypress = require('cypress');
const path = require('path');

const MAX_PAGES = 100; // Seu limite máximo de páginas

async function runLinkedInAutomation() {
  console.log('Iniciando automação de conexões do LinkedIn...');
  for (let page = 1; page <= MAX_PAGES; page++) {
    console.log(`\n--- Processando Página ${page} ---`);
    try {
      await cypress.run({
        spec: path.resolve(__dirname, 'cypress/e2e/linkedin_page_processor.cy.js'),
        env: { // Passa o número da página como variável de ambiente
          pageNumber: page
        },
        headed: true, // true para ver o navegador, false para headless
        browser: 'chrome' // Opcional: especifique o navegador
      });
      console.log(`Página ${page} processada com sucesso.`);
    } catch (error) {
      console.error(`Erro ao processar Página ${page}:`, error.message);
      // Opcional: Você pode decidir se quer parar a automação ou continuar para a próxima página
      // Por exemplo, se um erro ocorrer, você pode querer parar:
      // process.exit(1);
    }
  }
  console.log('\n--- Automação de conexões do LinkedIn concluída! ---');
}

runLinkedInAutomation();