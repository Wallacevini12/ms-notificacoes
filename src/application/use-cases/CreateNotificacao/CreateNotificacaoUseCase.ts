import { Notificacao } from '../../../domain/entities/Notificacao'
import { INotificacaoRepository } from '../../../domain/repositories/INotificacaoRepository'
import { CreateNotificacaoDTO } from '../../dtos/NotificacaoDTO'

export class CreateNotificacaoUseCase {
  constructor(private readonly repo: INotificacaoRepository) {}
  async execute(dto: CreateNotificacaoDTO): Promise<Notificacao> {
    const n = new Notificacao({ ...dto, status: 'PENDENTE' })
    return this.repo.create(n)
  }
}
