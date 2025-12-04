# Base Backend Node.js - Templates de Arquitetura

> **Templates modernos e prontos para uso de APIs Node.js com diferentes bancos de dados**

Este repositório contém dois templates completos de arquitetura para APIs Node.js, cada um otimizado para um banco de dados específico: **MongoDB** e **PostgreSQL**.

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Templates Disponíveis](#templates-disponíveis)
3. [Stack Tecnológica](#stack-tecnológica)
4. [Estrutura dos Projetos](#estrutura-dos-projetos)
5. [Início Rápido](#início-rápido)
6. [Comparação entre Templates](#comparação-entre-templates)
7. [Recursos Comuns](#recursos-comuns)
8. [Contribuindo](#contribuindo)
9. [Licença](#licença)

---

## 🎯 Visão Geral

Estes templates foram criados para fornecer uma base sólida e consistente para desenvolvimento de APIs Node.js, focando em:

* **Consistência e convenções compartilhadas** entre equipes
* **Produtividade do desenvolvedor** — tudo incluído, opinativo onde importa
* **Futuro-prova** — dependências mínimas, upgrades fáceis, qualidade automatizada
* **Observabilidade e segurança** integradas desde o início

---

## 📦 Templates Disponíveis

### 🍃 `base_api_node_mongodb`
Template otimizado para **MongoDB** usando **Mongoose** como ODM.

**Ideal para:**
- Aplicações que precisam de flexibilidade no schema
- Dados não relacionais ou semi-estruturados
- Prototipagem rápida
- Escalabilidade horizontal

**Características:**
- Mongoose 8 com suporte a hooks e transações
- Validação de ObjectId integrada
- Paginação com mongoose-paginate-v2

### 🐘 `base_api_node_postgres`
Template otimizado para **PostgreSQL** usando **Sequelize** como ORM.

**Ideal para:**
- Aplicações que precisam de relacionamentos complexos
- Dados relacionais estruturados
- Migrations versionadas
- Integridade referencial

**Características:**
- Sequelize 6 com migrations e seeds
- Suporte a transações ACID
- Pool de conexões configurável
- Suporte a SSL para produção

---

## 🛠 Stack Tecnológica

### Tecnologias Comuns

| Camada | Ferramenta | Versão |
|--------|-----------|--------|
| Runtime | Node.js | 20 LTS |
| Framework HTTP | Express | 5.x |
| Validação | express-validation | 4.x |
| Autenticação | JWT (jsonwebtoken) | 9.x |
| Logging | Pino | 9.x |
| Testes | Jest + Supertest | 29.x |
| Linting | ESLint | 9.x |
| Formatação | Prettier | 3.x |
| Containerização | Docker | - |

### Diferenças por Template

| Recurso | MongoDB | PostgreSQL |
|---------|---------|------------|
| ODM/ORM | Mongoose 8 | Sequelize 6 |
| Paginação | mongoose-paginate-v2 | Sequelize nativo |
| Migrations | Não | Sim (Sequelize CLI) |
| Seeds | Não | Sim (Sequelize CLI) |
| Validação de ID | ObjectId | Integer/UUID |

---

## 📁 Estrutura dos Projetos

```
base_api_node_[mongodb|postgres]/
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── base/              # Classes base reutilizáveis
│   │       │   ├── base_controller.js
│   │       │   ├── base_service.js
│   │       │   └── base_error_handler.js
│   │       └── business/          # Lógica de negócio
│   │           └── base/
│   │               ├── base_model.js
│   │               ├── base_controller.js
│   │               ├── base_service.js
│   │               └── base_router.js
│   ├── main/
│   │   ├── app.js                 # Configuração Express
│   │   ├── middleware.js          # Middlewares customizados
│   │   └── routers.js             # Definição de rotas
│   └── utils/                     # Utilitários
│       ├── jwt.js
│       ├── logger.js
│       └── ...
├── config/
│   └── database.js                # Configuração do banco
├── database/                      # Apenas PostgreSQL
│   ├── migrations/
│   └── seeders/
├── tests/
│   ├── unit/
│   └── integration/
├── docker-compose.yml
├── Dockerfile
├── package.json
└── server.js
```

---

## 🚀 Início Rápido

### MongoDB Template

```bash
# Navegar para o template MongoDB
cd base_api_node_mongodb

# Configurar variáveis de ambiente
cp env.sample .env.development

# Instalar dependências
npm install

# Iniciar com Docker
docker compose up -d --build

# Desenvolvimento local
npm run dev
```

### PostgreSQL Template

```bash
# Navegar para o template PostgreSQL
cd base_api_node_postgres

# Configurar variáveis de ambiente
cp env.sample .env.development

# Instalar dependências
npm install

# Iniciar com Docker
docker compose up -d --build

# Executar migrations
npm run db:migrate

# Executar seeds (opcional)
npm run db:seed

# Desenvolvimento local
npm run dev
```

### Scripts Disponíveis

**Comuns a ambos:**
```bash
npm run dev          # Desenvolvimento com hot-reload
npm run start        # Produção
npm run test         # Executar todos os testes
npm run test:unit    # Testes unitários
npm run test:integration  # Testes de integração
npm run coverage     # Cobertura de testes
npm run lint         # Verificar código
npm run lint:fix     # Corrigir problemas de lint
npm run format       # Formatar código
npm run format:check # Verificar formatação
npm run depcheck     # Verificar dependências não utilizadas
```

**Apenas PostgreSQL:**
```bash
npm run db:create          # Criar banco de dados
npm run db:migrate         # Executar migrations
npm run db:migrate:undo    # Reverter última migration
npm run db:migrate:undo:all # Reverter todas as migrations
npm run db:seed            # Executar seeds
npm run db:seed:undo        # Reverter último seed
npm run db:seed:undo:all    # Reverter todos os seeds
npm run db:drop            # Dropar banco de dados
```

---

## ⚖️ Comparação entre Templates

### Quando usar MongoDB?

✅ **Use MongoDB quando:**
- Você precisa de flexibilidade no schema
- Dados são documentos ou não relacionais
- Precisa de escalabilidade horizontal fácil
- Prototipagem rápida é prioridade
- Dados têm estrutura variável

### Quando usar PostgreSQL?

✅ **Use PostgreSQL quando:**
- Você precisa de relacionamentos complexos
- Integridade referencial é crítica
- Precisa de transações ACID
- Quer migrations versionadas
- Dados são altamente estruturados

---

## ✨ Recursos Comuns

Ambos os templates incluem:

### Segurança
- ✅ Helmet.js para headers de segurança
- ✅ CORS configurável
- ✅ HPP (HTTP Parameter Pollution) protection
- ✅ JWT para autenticação stateless
- ✅ Validação de entrada com express-validation

### Qualidade de Código
- ✅ ESLint configurado
- ✅ Prettier para formatação
- ✅ Husky para git hooks
- ✅ Lint-staged para validação pré-commit
- ✅ Jest para testes unitários e de integração

### Observabilidade
- ✅ Pino para logging estruturado
- ✅ Tratamento centralizado de erros
- ✅ Health check endpoint (`/health`)
- ✅ Internacionalização (i18n) para mensagens de erro

### Arquitetura
- ✅ Padrão MVC/Service Layer
- ✅ Classes base reutilizáveis
- ✅ Separação de responsabilidades
- ✅ Estrutura escalável

---

## 📝 Variáveis de Ambiente

### Comuns

```env
NODE_ENV=development
PORT_SERVER=3000

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=24h

# CORS
CORS_ORIGIN=*
CORS_CREDENTIALS=false
CORS_MAX_AGE=86400
```

### MongoDB Específicas

```env
DB_URL=mongodb://localhost:27017/base_db
MONGO_DEBUG=false
```

### PostgreSQL Específicas

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=base_db
DB_USER=postgres
DB_PASSWORD=postgres
DB_DEBUG=false
DB_SSL=false

# Pool Configuration
DB_POOL_MAX=5
DB_POOL_MIN=0
DB_POOL_ACQUIRE=30000
DB_POOL_IDLE=10000
```

---

## 🧪 Testes

Ambos os templates incluem configuração completa de testes:

```bash
# Executar todos os testes
npm run test

# Apenas testes unitários
npm run test:unit

# Apenas testes de integração
npm run test:integration

# Com cobertura
npm run coverage
```

---

## 🐳 Docker

Ambos os templates incluem:
- `Dockerfile` otimizado
- `docker-compose.yml` com banco de dados
- Configuração de volumes para persistência

### MongoDB
```yaml
services:
  ms-base-db:
    image: mongo
    ports: ['27017:27017']
```

### PostgreSQL
```yaml
services:
  ms-base-db:
    image: postgres:16-alpine
    ports: ['5432:5432']
    volumes:
      - postgres_data:/var/lib/postgresql/data
```

---

## 🤝 Contribuindo

1. Fork o repositório
2. Crie sua branch: `git checkout -b feature/minha-feature`
3. Execute lint e testes: `npm run lint && npm test`
4. Commit suas mudanças: `git commit -m 'feat: adiciona nova feature'`
5. Push para a branch: `git push origin feature/minha-feature`
6. Abra um Pull Request

Seguimos **Conventional Commits** — mantenha as mensagens organizadas.

---

## 📄 Licença

Este projeto está licenciado sob a **MIT License**. Veja o arquivo `LICENSE` em cada template para mais detalhes.

---

## 📚 Documentação Adicional

- [Documentação MongoDB Template](./base_api_node_mongodb/README.md)
- [Documentação PostgreSQL Template](./base_api_node_postgres/README.md)

---

## 🗺 Roadmap

- [ ] Adicionar suporte a TypeScript
- [ ] Adicionar camada de cache (Redis)
- [ ] Adicionar testes de contrato (Pact)
- [ ] Scaffold para Serverless (AWS Lambda)
- [ ] Adicionar suporte a GraphQL
- [ ] Adicionar documentação Swagger/OpenAPI

---

**Desenvolvido com ❤️ para facilitar o desenvolvimento de APIs Node.js**

