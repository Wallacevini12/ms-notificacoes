import { Notificacao } from '../entities/Notificacao'

export interface INotificacaoRepository {
  create(notificacao: Notificacao): Promise<Notificacao>
  findById(id: number): Promise<Notificacao | null>
  findAll(filters?: { status?: string; beneficiarioId?: string; canal?: string }): Promise<Notificacao[]>
  update(notificacao: Notificacao): Promise<Notificacao>
  delete(id: number): Promise<void>
}
