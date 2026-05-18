import { Notificacao } from '../../../domain/entities/Notificacao'
import { INotificacaoRepository } from '../../../domain/repositories/INotificacaoRepository'

export class GetNotificacaoUseCase {
  constructor(private readonly repository: INotificacaoRepository) {}

  async execute(id: number): Promise<Notificacao> {
    const notificacao = await this.repository.findById(id)
    if (!notificacao) throw new Error(`Notificacao ${id} não encontrada`)
    return notificacao
  }
}
