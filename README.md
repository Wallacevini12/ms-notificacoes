# MS Notificações — Sistema de Agendamento Unimed

Microsserviço responsável pelo domínio de **Notificações** (confirmações, lembretes e cancelamentos enviados por e-mail, SMS e push) do Sistema de Agendamento Unimed. Persiste os dados em **Azure SQL Database** e expõe uma API REST documentada via Swagger.

## Arquitetura

Este microsserviço segue **Clean Architecture** com quatro camadas isoladas e organização interna por **Vertical Slice**:

```
src/
├── domain/            # Entidades e interfaces de repositório
│   ├── entities/             -> Notificacao
│   └── repositories/         -> INotificacaoRepository
├── application/       # Casos de uso (Vertical Slice)
│   └── use-cases/
│       ├── CreateNotificacao/
│       ├── GetNotificacao/
│       ├── ListNotificacoes/
│       └── UpdateNotificacao/
├── infrastructure/    # Implementações concretas (Azure SQL via mssql)
│   ├── database/
│   └── repositories/         -> SqlNotificacaoRepository
└── api/               # Controllers REST e configuração Swagger
```

A conformidade com as regras de dependência é garantida por **testes de arquitetura** (ArchUnitTS).

### Comportamento de envio
Ao criar uma notificação, o caso de uso `CreateNotificacao` invoca a regra de domínio `marcarEnviada()`, que simula o disparo pelo provedor (e-mail/SMS/push). A notificação é persistida já com status **ENVIADA** e a data de envio registrada.

## Tecnologias

- **Node.js** + **TypeScript**
- **Express** (API REST)
- **Azure SQL Database** + **mssql** (persistência)
- **Swagger** (swagger-ui-express + swagger-jsdoc)
- **Jest** + **ts-jest** (testes unitários)
- **ArchUnitTS** (testes de arquitetura)
- **Docker**

## Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| GET    | /notificacoes | Lista notificações (filtros: status, canal) |
| GET    | /notificacoes/:id | Busca uma notificação por ID |
| POST   | /notificacoes | Cria uma notificação (nasce como ENVIADA) |
| PUT    | /notificacoes/:id | Atualiza o status da notificação |
| DELETE | /notificacoes/:id | Remove uma notificação |

Documentação completa em **http://localhost:3002/docs**

## Como rodar localmente

```bash
# 1. Instalar dependências
npm install

# 2. Criar o arquivo .env na raiz com:
#    PORT=3002
#    AZURE_SQL_SERVER=<seu-servidor>.database.windows.net
#    AZURE_SQL_DATABASE=<seu-banco>
#    AZURE_SQL_USER=<seu-usuario>
#    AZURE_SQL_PASSWORD=<sua-senha>
#    NODE_ENV=development

# 3. Rodar em modo desenvolvimento
npm run dev
```

O serviço sobe em **http://localhost:3002** e o Swagger em **http://localhost:3002/docs**.

## Testes

```bash
# Todos os testes
npm test

# Apenas testes de arquitetura
npm test -- --testPathPattern=architecture
```

## Docker

```bash
docker build -t wallacevini12/ms-notificacoes:v1 .
docker push wallacevini12/ms-notificacoes:v1
```

Imagem publicada: `wallacevini12/ms-notificacoes:v1`

## Vídeo de demonstração
https://youtu.be/yXW6vKhXH8o

## Equipe

- Gabriel Girotto
- Giovani Tortatto
- Lucas Cunha
- Matheus Garozi
- Wallace Vinicius

> Pontifícia Universidade Católica do Paraná (PUCPR) — Arquitetura e Soluções Cloud — 2026
