# Projeto FullStack

## Descrição

Um projeto full-stack utilizando Vue.js e NestJS para cálculos métricos.

# Índice

1. [Instalação Manual](#instalação-manual)
2. [Instalação com Docker](#instalação-com-docker)

## Instalação Manual

Antes de prosseguir com a instalação, é recomendado usar a versão 16.14.0 do Node.js e o gerenciador de pacotes NPM.

### Instalação do Node.js e NPM

Baixe e instale o Node.js no site oficial: [Node.js Downloads](https://nodejs.org/en/download/)

Verifique a instalação executando os seguintes comandos no seu terminal:

```bash
node --version
npm --version
```
### Configuração do Projeto

1 - Clone o repositório para a sua máquina local:
```bash
git clone https://github.com/alexpxmort/full-stack-project.git
```
2 - Navegue até o diretório do projeto:
```bash
cd full-stack-project
```
3 - Instale as dependências do projeto
```bash
npm run setup
```
4 - Inicie o backend NestJS:
```bash
npm run start:back
```
5 - Inicie o frontend Vue:
```bash
npm run start:front
```

Agora, o projeto fullstack deve estar em execução. Acesse http://localhost:8080 no seu navegador para interagir com a aplicação.


## Instalação com Docker

para instalar com docker basta ter o docker e docker-compose na sua máquina e executar os eguintes passos


1 - Clone o repositório para a sua máquina local:
```bash
git clone https://github.com/alexpxmort/full-stack-project.git
```
2 - Navegue até o diretório do projeto:
```bash
cd full-stack-project
```
3 - execute o comando de subida (up) do container
```bash
npm run up
```
Após executar os passos , o projeto fullstack deve estar em execução. Acesse http://localhost:8080 no seu navegador para interagir com a aplicação.