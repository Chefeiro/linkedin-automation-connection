const cypress = require('cypress');
const path = require('path');
const fs = require('fs');
const readline = require('readline');
require('dotenv').config(); 

const mensagem1 = "----------------------------------------------------------------" +
                 "\n| Registro de Conta no .env não encontrado. Iniciando criação! |" +
                 "\n----------------------------------------------------------------";

const mensagem2 = "--------------------------------------" +
                 "\n| Documento com email e senha pronto |" +
                 "\n--------------------------------------";

const mensagem3 = "--------------------------------------------------" +
                 "\n| Iniciando automação de conexões do LinkedIn... |" +
                 "\n--------------------------------------------------";

const mensagem4 = "-------------------------------------------------------------" +
                 "\n| Documento .env encontrado. Usando credenciais existentes. |" +
                 "\n-------------------------------------------------------------";


                
const MAX_PAGES = 50; 

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function askQuestion(query, defaultValue = '') {
    return new Promise(resolve => rl.question(query, ans => {
        resolve(ans || defaultValue);
    }));
}

async function runLinkedInAutomation() {
    let linkedinEmail, linkedinPassword, searchTerm1, searchTerm2;

    const envFilePath = path.resolve(__dirname, '.env');
    const envExists = fs.existsSync(envFilePath);

    
    if (!envExists) {
        console.clear()
        console.log(mensagem1);
        linkedinEmail = await askQuestion('Digite seu email do LinkedIn: ');
        linkedinPassword = await askQuestion('Digite sua senha do LinkedIn: ');
        console.clear()

        let envContent = `LINKEDIN_EMAIL=${linkedinEmail}\nLINKEDIN_PASSWORD=${linkedinPassword}\n`;
        fs.writeFileSync(envFilePath, envContent);
        console.log(mensagem2);
    } else {
        console.clear()
        console.log(mensagem4);
        linkedinEmail = process.env.LINKEDIN_EMAIL;
        linkedinPassword = process.env.LINKEDIN_PASSWORD;

        if (!linkedinEmail || !linkedinPassword) {
            console.warn('AVISO: Email ou senha do LinkedIn não encontrados no documento .env! Por favor, edite o arquivo .env manualmente ou apague-o para recriar.');
            rl.close();
            return; 
        }
    }

   
    console.log('\n| Agora, digite os termos de pesquisa (deixe em branco para usar o padrão se existir no documento .env) |');
    searchTerm1 = await askQuestion(`Primeiro termo de pesquisa (Padrão: ${process.env.SEARCH_TERM_1 || 'recruiter'}): `, process.env.SEARCH_TERM_1 || 'recruiter');
    searchTerm2 = await askQuestion(`Segundo termo de pesquisa (Padrão: ${process.env.SEARCH_TERM_2 || 'qa'}): `, process.env.SEARCH_TERM_2 || 'qa');


    let currentEnvContent = fs.readFileSync(envFilePath, 'utf8');
    currentEnvContent = currentEnvContent.replace(/SEARCH_TERM_1=.*/, `SEARCH_TERM_1=${searchTerm1}`);
    currentEnvContent = currentEnvContent.replace(/SEARCH_TERM_2=.*/, `SEARCH_TERM_2=${searchTerm2}`);

    if (!currentEnvContent.includes('SEARCH_TERM_1')) {
        currentEnvContent += `\nSEARCH_TERM_1=${searchTerm1}`;
    }
    if (!currentEnvContent.includes('SEARCH_TERM_2')) {
        currentEnvContent += `\nSEARCH_TERM_2=${searchTerm2}`;
    }
    fs.writeFileSync(envFilePath, currentEnvContent);
    console.log('documento .env atualizado com os termos de pesquisa.');

    console.clear()
    console.log(mensagem3);
    for (let page = 1; page <= MAX_PAGES; page++) {
        console.log(`\n--- Processando Página ${page} ---`);

        try {
           const failed = await cypress.run({
                spec: path.resolve(__dirname, 'cypress/e2e/linkedin_page_processor.cy.js'),
                env: { 
                    pageNumber: page,
                    linkedinEmail: linkedinEmail,
                    linkedinPassword: linkedinPassword,
                    searchTerm1: searchTerm1,
                    searchTerm2: searchTerm2
                },
                headed: true, 
                browser: 'chrome',
                autoCancelAfterFailures: 1
            });
            if (failed.status === "failed")
              break;
            console.log(`Página ${page} processada com sucesso.`);
        } catch (error) {
            console.error(`Erro ao processar Página ${page}:`, error.message);
        }
    }
    console.clear()
    console.log('\n--- Automação de conexões do LinkedIn concluída! ---');
    rl.close();
}

runLinkedInAutomation();