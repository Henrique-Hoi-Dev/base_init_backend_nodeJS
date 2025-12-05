# Node.js Base Architecture Template - TypeScript

> **Um ponto de partida moderno para serviços back-end escaláveis, seguros e testáveis usando TypeScript.**

---

## Índice

1. [Propósito e Objetivos](#propósito-e-objetivos)
2. [Stack Tecnológica](#stack-tecnológica)
3. [Estrutura do Projeto](#estrutura-do-projeto)
4. [Recursos Incluídos](#recursos-incluídos)
5. [Começando](#começando)
6. [Scripts Disponíveis](#scripts-disponíveis)
7. [Comandos de Banco de Dados](#comandos-de-banco-de-dados)
8. [Licença](#licença)

---

## Propósito e Objetivos

Este repositório fornece uma **arquitetura plug-and-play** para serviços Node.js com TypeScript. Foca em:

* **Consistência e convenções compartilhadas** entre equipes.
* **Produtividade do desenvolvedor** — tudo incluído, opinativo onde importa.
* **Futuro-prova** — dependências mínimas, upgrades fáceis, qualidade automatizada.
* **Observabilidade e segurança** integradas desde o início.
* **Type Safety** — TypeScript para maior segurança de tipos e melhor experiência de desenvolvimento.

---

## Stack Tecnológica

| Camada | Ferramenta / Biblioteca | Justificativa |
|--------|-------------------------|---------------|
| Runtime | **Node.js 20 LTS** | Última LTS, fetch nativo, top-level await |
| Linguagem | **TypeScript 5.7** | Type safety, melhor DX, suporte moderno |
| Framework HTTP | **Express 5** | Core pequeno, ecossistema enorme |
| Validação | **express-validation** | Validação de requisições |
| Banco de Dados | **PostgreSQL + Sequelize 6** | ORM com migrations e transações |
| Autenticação e Segurança | JWT (jsonwebtoken) + Helmet + Rate-limit | Tokens stateless, headers seguros |
| Logging | **Pino** | Saída JSON, alta performance |
| Testes | Jest + Supertest + ts-jest | Testes unitários e de integração |
| Linting | ESLint + Prettier | Qualidade de código automatizada |
| Containerização | Docker | Builds reproduzíveis e deployments |

---

## Estrutura do Projeto

```text
src/
├─ server.ts                    # Ponto de entrada da aplicação
├─ app/
│  ├─ main/
│  │  ├─ app.ts                 # Configuração Express
│  │  ├─ bootstrap.ts           # Carregamento de variáveis de ambiente
│  │  ├─ middleware.ts          # Middlewares customizados
│  │  ├─ routers.ts            # Definição de rotas
│  │  └─ validations_error_handler.ts
│  ├─ api/
│  │  └─ v1/
│  │     ├─ base/               # Classes base reutilizáveis
│  │     │  ├─ base_controller.ts
│  │     │  ├─ base_service.ts
│  │     │  ├─ base_error_handler.ts
│  │     │  ├─ base_resource_controller.ts
│  │     │  └─ base_integration.ts
│  │     └─ business/          # Lógica de negócio
│  │        └─ base/
│  │           ├─ base_model.ts
│  │           ├─ base_controller.ts
│  │           ├─ base_service.ts
│  │           ├─ base_router.ts
│  │           └─ base_validation.ts
│  └─ utils/                     # Utilitários
│     ├─ jwt.ts
│     ├─ logger.ts
│     ├─ validator.ts
│     └─ ...
├─ config/
│  └─ database.ts                # Configuração do banco de dados
└─ ...

database/
├─ migrations/                  # Migrations do Sequelize
└─ seeders/                      # Seeders do Sequelize

tests/                           # Testes Jest
config/                          # Configurações (sequelize.js)
locale/                          # Arquivos de internacionalização
```

---

## Recursos Incluídos

* **Health-check** (`/health`).
* **Tratamento centralizado de erros** – oculta stack traces em produção.
* **ESLint + Prettier** com hooks pre-commit (Husky).
* **TypeScript strict mode** habilitado.
* **Suporte completo a Sequelize** com migrations e seeds.
* **Autenticação JWT** integrada.
* **Logging estruturado** com Pino.
* **CORS configurável**.
* **Headers de segurança** (Helmet).

---

## Começando

```bash
# Navegar para o template TypeScript
$ cd base_api_node_postgres_ts

# Configurar variáveis de ambiente
$ cp env.sample .env.development

# Instalar dependências
$ npm install

# Iniciar stack com Docker
$ docker compose up -d --build

# Executar migrations do banco de dados
$ npm run db:migrate

# Executar seeds do banco de dados (opcional)
$ npm run db:seed

# Desenvolvimento local com hot-reload
$ npm run dev
```

A API estará disponível em `http://localhost:3000`.

---

## Scripts Disponíveis

```bash
npm run build          # Compilar TypeScript
npm run build:watch    # Compilar TypeScript em modo watch
npm run dev            # Desenvolvimento com hot-reload
npm run start          # Produção (executa código compilado)
npm run test           # Executar todos os testes
npm run test:unit      # Apenas testes unitários
npm run test:integration  # Apenas testes de integração
npm run coverage       # Cobertura de testes
npm run lint           # Lint do código
npm run lint:fix       # Corrigir problemas de lint
npm run format         # Formatar código
npm run format:check   # Verificar formatação do código
npm run depcheck       # Verificar dependências não utilizadas
```

---

## Comandos de Banco de Dados

```bash
# Criar banco de dados
npm run db:create

# Executar migrations
npm run db:migrate

# Reverter última migration
npm run db:migrate:undo

# Reverter todas as migrations
npm run db:migrate:undo:all

# Executar seeds
npm run db:seed

# Reverter último seed
npm run db:seed:undo

# Reverter todos os seeds
npm run db:seed:undo:all

# Remover banco de dados
npm run db:drop
```

---

## Diferenças da Versão JavaScript

Esta versão TypeScript mantém a mesma arquitetura do projeto base (`base_api_node_postgres`), mas com as seguintes melhorias:

* **Type Safety**: Todos os arquivos convertidos para TypeScript com tipos apropriados
* **Melhor IntelliSense**: Autocomplete e verificação de tipos em tempo de desenvolvimento
* **Detecção de Erros**: Erros detectados em tempo de compilação, não em runtime
* **Refatoração Segura**: Refatorações mais seguras com suporte do TypeScript
* **Documentação Implícita**: Tipos servem como documentação do código

---

## Licença

Lançado sob a **MIT License**. Veja `LICENSE` para detalhes.

