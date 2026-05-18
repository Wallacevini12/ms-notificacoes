# MS Notificações — Unimed

> Microserviço responsável pelo domínio de Notificações e Comunicação  
> **Stack:** Node.js · TypeScript · Express · Azure SQL Database · Clean Architecture

**Equipe:** Gabriel Girotto | Giovani Tortatto | Lucas Cunha | Matheus Garozi | Wallace Vinicius

---

## Arquitetura

```
src/
├── domain/                         # Camada de Domínio
│   ├── entities/Notificacao.ts     # Entidade com regras (marcarEnviada, marcarLida...)
│   └── repositories/               # Interface INotificacaoRepository
├── application/                    # Camada de Aplicação
│   ├── dtos/                       # DTOs de entrada/saída
│   └── use-cases/                  # Vertical Slice por feature
│       ├── CreateNotificacao/
│       └── notificacao.use-cases.ts (Get, List, Update, Delete)
├── infrastructure/                 # Camada de Infraestrutura
│   ├── database/connection.ts      # Conexão Azure SQL + criação de tabela
│   └── repositories/               # SqlNotificacaoRepository (mssql)
└── api/server.ts                   # Express + Swagger + rotas
```

---

## Tecnologias

| Tecnologia | Versão | Uso |
|-----------|--------|-----|
| Node.js | 20 LTS | Runtime |
| TypeScript | 5.3 | Tipagem estática |
| Express | 4.18 | Framework HTTP |
| mssql | 10.x | Driver Azure SQL |
| Azure SQL Database | Free 1 DTU | Banco de dados |
| Swagger UI | 5.x | Documentação |
| Jest | 29 | Testes |

---

## Como rodar localmente

### 1. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

```
PORT=3002
AZURE_SQL_SERVER=seu-server.database.windows.net
AZURE_SQL_DATABASE=notificacoes
AZURE_SQL_USER=seu-usuario
AZURE_SQL_PASSWORD=sua-senha
```

> A tabela `Notificacoes` é criada automaticamente na primeira execução.

### 2. Instalar e rodar

```bash
npm install
npm run dev
```

### 3. Acessar

| URL | Descrição |
|-----|-----------|
| http://localhost:3002/notificacoes | API REST |
| http://localhost:3002/docs | Swagger UI |
| http://localhost:3002/health | Health check |

### 4. Rodar testes

```bash
npm test
```

---

## Docker

```bash
docker build -t dockerhubuser/pjbl/ms-notificacoes:v1 .
docker push dockerhubuser/pjbl/ms-notificacoes:v1
```

---

## Exemplo de request

```bash
# Criar notificação
curl -X POST http://localhost:3002/notificacoes \
  -H "Content-Type: application/json" \
  -d '{
    "agendamentoId": "ag-001",
    "beneficiarioId": "b-001",
    "beneficiarioNome": "Maria Silva",
    "tipo": "CONFIRMACAO",
    "canal": "EMAIL",
    "mensagem": "Sua consulta foi confirmada para 10/05 às 09:00."
  }'

# Marcar como enviada
curl -X PUT http://localhost:3002/notificacoes/1 \
  -H "Content-Type: application/json" \
  -d '{ "status": "ENVIADA" }'
```
