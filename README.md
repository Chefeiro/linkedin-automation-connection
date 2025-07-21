
# Automação de Conexões no LinkedIn com Cypress e Node.js

Este projeto oferece uma solução robusta e otimizada para automatizar o envio de pedidos de conexão no LinkedIn, buscando perfis com base em termos específicos. Ele foi desenvolvido com Cypress para interações no navegador e Node.js para orquestrar o processo, garantindo eficiência e evitando problemas de memória em automações de longa duração.

## 🚀 Visão Geral do Projeto 🚀 

Este projeto foi criado para simplificar e otimizar o processo de fazer novas conexões no LinkedIn. Sabe quando você precisa se conectar com várias pessoas de uma área específica (tipo "recrutadores de QA")? Fazer isso na mão pode levar horas!

A principal inovação deste projeto reside na sua arquitetura, que permite processar centenas (ou milhares!) de páginas do LinkedIn sem estourar a memória RAM. Isso é conseguido através de:

Execuções Isoladas do Cypress: Cada página do LinkedIn é processada em uma nova instância do Cypress, garantindo que o histórico e os dados temporários sejam liberados, otimizando o consumo de memória.

Orquestração via Node.js: Um script Node.js externo gerencia o fluxo de trabalho, iterando sobre as páginas e invocando o Cypress para cada uma, de forma sequencial e controlada.

Termos de Pesquisa Dinâmicos: A URL de busca do LinkedIn pode ser facilmente configurada com seus próprios termos de pesquisa (ex: "recruiter", "QA", "developer"), tornando a automação flexível para diferentes nichos.

## 🛠️ Pré-requisitos 🛠️

Para rodar este projeto na sua máquina, você vai precisar do seguinte:

• Node.js e npm: Certifique-se de ter o Node.js instalado (versão 14 ou superior é recomendada). O npm (Node Package Manager) já vem junto com o Node.js.

Você pode baixar o Node.js em nodejs.org.

• Google Chrome: O Cypress funciona melhor com o Chrome para automação web.

## 📦 Instalação e Configuração 📦

Siga estes passos para configurar e rodar o projeto:

Clone o Repositório:
Se você estiver usando Git, clone este repositório para o seu computador:

    git clone <https://github.com/Chefeiro/linkedin-automation-connection.git>
    cd <nome-da-pasta-do-seu-repositorio>

Instale as Dependências:
Dentro da pasta do projeto, instale as dependências do Node.js & Cypress:

    npm install 


# 🚀 Como Usar 🚀

Com tudo configurado, você pode iniciar a automação:

Abra o Terminal: Navegue até a pasta raiz do projeto no seu terminal.

Execute o Script de Automação:

    npm run linkedin

Na primeira vez que você for executar, o sistema pedirá seu e-mail e senha diretamente no terminal. Em seguida, um arquivo .env será criado automaticamente para guardar essas informações de forma segura.

Depois, você poderá escolher os termos de pesquisa que deseja usar, com "recruiter" e "qa" como opções padrão.

Feito isso, a automação será iniciada.
###  ⚠️ Observações Importantes ⚠️

Autenticação: Por padrão, o projeto inclui um passo de login no beforeEach para autenticação com e-mail e senha padrão do LinkedIn. No entanto, ele não suporta métodos de login via Gmail ou Microsoft (Sign In com Google/Microsoft). Para esses métodos, seria necessário adaptar o script de login.

Velocidade da Internet e Timeouts: Ajuste os cy.wait() e os timeout nos cy.get() dentro de linkedin_page_processor.cy.js conforme a sua velocidade de conexão e a capacidade de carregamento do site, para evitar falhas por elementos não encontrados a tempo.

 # 🪐Jonas Silva🪐

> QA Enginner | Cypress Automation

<a href="https://www.linkedin.com/in/jonas-ferreira-a78200232/"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" /> 

