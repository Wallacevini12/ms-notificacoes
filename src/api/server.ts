import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'
import { initDatabase } from '../infrastructure/database/connection'
import { SqlNotificacaoRepository } from '../infrastructure/repositories/SqlNotificacaoRepository'
import { CreateNotificacaoUseCase }  from '../application/use-cases/CreateNotificacao/CreateNotificacaoUseCase'
import { GetNotificacaoUseCase }     from '../application/use-cases/GetNotificacao/GetNotificacaoUseCase'
import { ListNotificacoesUseCase }   from '../application/use-cases/ListNotificacoes/ListNotificacoesUseCase'
import { UpdateNotificacaoUseCase }  from '../application/use-cases/UpdateNotificacao/UpdateNotificacaoUseCase'
import { DeleteNotificacaoUseCase }  from '../application/use-cases/DeleteNotificacao/DeleteNotificacaoUseCase'

const app  = express()
const PORT = process.env.PORT ?? 3002
const repo = new SqlNotificacaoRepository()

app.use(cors())
app.use(express.json())

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: { title: 'MS Notificações — Unimed', version: '1.0.0', description: 'Microserviço de Notificações com Azure SQL' },
    servers: [{ url: `http://localhost:${PORT}` }],
  },
  apis: [__filename],
})

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'ms-notificacoes', timestamp: new Date() }))

/**
 * @swagger
 * /notificacoes:
 *   get:
 *     summary: Lista notificações
 *     tags: [Notificações]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [PENDENTE, ENVIADA, FALHOU, LIDA] }
 *       - in: query
 *         name: canal
 *         schema: { type: string, enum: [EMAIL, SMS, PUSH] }
 *       - in: query
 *         name: beneficiarioId
 *         schema: { type: string }
 *     responses:
 *       200: { description: Lista de notificações }
 */
app.get('/notificacoes', async (req, res) => {
  try {
    const data = await new ListNotificacoesUseCase(repo).execute({
      status:        req.query.status as string,
      beneficiarioId:req.query.beneficiarioId as string,
      canal:         req.query.canal as string,
    })
    res.json({ success: true, data, total: data.length })
  } catch (err: any) { res.status(500).json({ success: false, error: err.message }) }
})

/**
 * @swagger
 * /notificacoes/{id}:
 *   get:
 *     summary: Busca notificação por ID
 *     tags: [Notificações]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Notificação encontrada }
 *       404: { description: Não encontrada }
 */
app.get('/notificacoes/:id', async (req, res) => {
  try {
    const data = await new GetNotificacaoUseCase(repo).execute(Number(req.params.id))
    res.json({ success: true, data })
  } catch (err: any) { res.status(404).json({ success: false, error: err.message }) }
})

/**
 * @swagger
 * /notificacoes:
 *   post:
 *     summary: Cria notificação
 *     tags: [Notificações]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [agendamentoId, beneficiarioId, beneficiarioNome, tipo, canal, mensagem]
 *             properties:
 *               agendamentoId:    { type: string }
 *               beneficiarioId:   { type: string }
 *               beneficiarioNome: { type: string }
 *               tipo:  { type: string, enum: [CONFIRMACAO, LEMBRETE, CANCELAMENTO, AUTORIZACAO] }
 *               canal: { type: string, enum: [EMAIL, SMS, PUSH] }
 *               mensagem: { type: string }
 *     responses:
 *       201: { description: Criada }
 */
app.post('/notificacoes', async (req, res) => {
  try {
    const data = await new CreateNotificacaoUseCase(repo).execute(req.body)
    res.status(201).json({ success: true, data })
  } catch (err: any) { res.status(400).json({ success: false, error: err.message }) }
})

/**
 * @swagger
 * /notificacoes/{id}:
 *   put:
 *     summary: Atualiza status da notificação
 *     tags: [Notificações]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status: { type: string, enum: [ENVIADA, FALHOU, LIDA] }
 *     responses:
 *       200: { description: Atualizada }
 */
app.put('/notificacoes/:id', async (req, res) => {
  try {
    const data = await new UpdateNotificacaoUseCase(repo).execute(Number(req.params.id), req.body.status)
    res.json({ success: true, data })
  } catch (err: any) { res.status(400).json({ success: false, error: err.message }) }
})

/**
 * @swagger
 * /notificacoes/{id}:
 *   delete:
 *     summary: Remove notificação
 *     tags: [Notificações]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204: { description: Removida }
 */
app.delete('/notificacoes/:id', async (req, res) => {
  try {
    await new DeleteNotificacaoUseCase(repo).execute(Number(req.params.id))
    res.status(204).send()
  } catch (err: any) { res.status(404).json({ success: false, error: err.message }) }
})

async function bootstrap() {
  await initDatabase()
  app.listen(PORT, () => {
    console.log(`🚀 ms-notificacoes rodando em http://localhost:${PORT}`)
    console.log(`📚 Swagger em http://localhost:${PORT}/docs`)
  })
}

bootstrap().catch(err => { console.error(err); process.exit(1) })

export default app
