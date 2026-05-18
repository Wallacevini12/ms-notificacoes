import { Notificacao } from '../../../domain/entities/Notificacao'
import { INotificacaoRepository } from '../../../domain/repositories/INotificacaoRepository'

export interface ListNotificacoesFilters {
  status?:        string
  beneficiarioId?: string
  canal?:         string
}

export class ListNotificacoesUseCase {
  constructor(private readonly repository: INotificacaoRepository) {}

  async execute(filters?: ListNotificacoesFilters): Promise<Notificacao[]> {
    return this.repository.findAll(filters)
  }
}
