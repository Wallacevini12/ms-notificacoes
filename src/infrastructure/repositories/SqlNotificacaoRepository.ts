import sql from 'mssql'
import { Notificacao } from '../../domain/entities/Notificacao'
import { INotificacaoRepository } from '../../domain/repositories/INotificacaoRepository'
import { getPool } from '../database/connection'

export class SqlNotificacaoRepository implements INotificacaoRepository {
  async create(n: Notificacao): Promise<Notificacao> {
    const pool = await getPool()
    const result = await pool.request()
      .input('AgendamentoId',   sql.NVarChar, n.agendamentoId)
      .input('BeneficiarioId',  sql.NVarChar, n.beneficiarioId)
      .input('BeneficiarioNome',sql.NVarChar, n.beneficiarioNome)
      .input('Tipo',            sql.NVarChar, n.tipo)
      .input('Canal',           sql.NVarChar, n.canal)
      .input('Mensagem',        sql.NVarChar, n.mensagem)
      .input('Status',          sql.NVarChar, n.status)
      .query(`
        INSERT INTO Notificacoes (AgendamentoId, BeneficiarioId, BeneficiarioNome, Tipo, Canal, Mensagem, Status)
        OUTPUT INSERTED.*
        VALUES (@AgendamentoId, @BeneficiarioId, @BeneficiarioNome, @Tipo, @Canal, @Mensagem, @Status)
      `)
    return this.toDomain(result.recordset[0])
  }

  async findById(id: number): Promise<Notificacao | null> {
    const pool = await getPool()
    const result = await pool.request()
      .input('Id', sql.Int, id)
      .query('SELECT * FROM Notificacoes WHERE Id = @Id')
    if (!result.recordset[0]) return null
    return this.toDomain(result.recordset[0])
  }

  async findAll(filters?: { status?: string; beneficiarioId?: string; canal?: string }): Promise<Notificacao[]> {
    const pool    = await getPool()
    const request = pool.request()
    let   query   = 'SELECT * FROM Notificacoes WHERE 1=1'

    if (filters?.status)        { query += ' AND Status = @Status';              request.input('Status',        sql.NVarChar, filters.status) }
    if (filters?.beneficiarioId){ query += ' AND BeneficiarioId = @BeneficiarioId'; request.input('BeneficiarioId', sql.NVarChar, filters.beneficiarioId) }
    if (filters?.canal)         { query += ' AND Canal = @Canal';                request.input('Canal',         sql.NVarChar, filters.canal) }

    query += ' ORDER BY CreatedAt DESC'
    const result = await request.query(query)
    return result.recordset.map((r: any) => this.toDomain(r))
  }

  async update(n: Notificacao): Promise<Notificacao> {
    const pool = await getPool()
    const result = await pool.request()
      .input('Id',         sql.Int,      n.id)
      .input('Status',     sql.NVarChar, n.status)
      .input('Tentativas', sql.Int,      n.tentativas)
      .input('EnviadoEm',  sql.DateTime, n.enviadoEm)
      .input('UpdatedAt',  sql.DateTime, new Date())
      .query(`
        UPDATE Notificacoes
        SET Status=@Status, Tentativas=@Tentativas, EnviadoEm=@EnviadoEm, UpdatedAt=@UpdatedAt
        OUTPUT INSERTED.*
        WHERE Id=@Id
      `)
    return this.toDomain(result.recordset[0])
  }

  async delete(id: number): Promise<void> {
    const pool = await getPool()
    await pool.request().input('Id', sql.Int, id).query('DELETE FROM Notificacoes WHERE Id=@Id')
  }

  private toDomain(row: any): Notificacao {
    return new Notificacao({
      id:              row.Id,
      agendamentoId:   row.AgendamentoId,
      beneficiarioId:  row.BeneficiarioId,
      beneficiarioNome:row.BeneficiarioNome,
      tipo:            row.Tipo,
      canal:           row.Canal,
      mensagem:        row.Mensagem,
      status:          row.Status,
      tentativas:      row.Tentativas,
      enviadoEm:       row.EnviadoEm,
      createdAt:       row.CreatedAt,
      updatedAt:       row.UpdatedAt,
    })
  }
}
