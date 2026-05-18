import sql from 'mssql'

const password = (process.env.AZURE_SQL_PASSWORD ?? '').replace(/^"|"$/g, '')

const config: sql.config = {
  server:   process.env.AZURE_SQL_SERVER   ?? '',
  database: process.env.AZURE_SQL_DATABASE ?? '',
  user:     process.env.AZURE_SQL_USER     ?? '',
  password,
  port:     1433,
  options: {
    encrypt:                true,
    trustServerCertificate: false,
    enableArithAbort:       true,
    connectTimeout:         30000,
  },
  pool: { max: 10, min: 0, idleTimeoutMillis: 30000 },
}

let pool: sql.ConnectionPool | null = null

export async function getPool(): Promise<sql.ConnectionPool> {
  if (!pool) {
    pool = await sql.connect(config)
    console.log('✅ Azure SQL conectado com sucesso')
  }
  return pool
}

export async function initDatabase(): Promise<void> {
  const p = await getPool()
  await p.request().query(`
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Notificacoes' AND xtype='U')
    CREATE TABLE Notificacoes (
      Id              INT IDENTITY(1,1) PRIMARY KEY,
      AgendamentoId   NVARCHAR(100) NOT NULL,
      BeneficiarioId  NVARCHAR(100) NOT NULL,
      BeneficiarioNome NVARCHAR(200) NOT NULL,
      Tipo            NVARCHAR(50)  NOT NULL,
      Canal           NVARCHAR(20)  NOT NULL,
      Mensagem        NVARCHAR(MAX) NOT NULL,
      Status          NVARCHAR(20)  NOT NULL DEFAULT 'PENDENTE',
      Tentativas      INT           NOT NULL DEFAULT 0,
      EnviadoEm       DATETIME      NULL,
      CreatedAt       DATETIME      NOT NULL DEFAULT GETDATE(),
      UpdatedAt       DATETIME      NOT NULL DEFAULT GETDATE()
    )
  `)
  console.log('✅ Tabela Notificacoes verificada/criada')
}