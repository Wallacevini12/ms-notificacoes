import { INotificacaoRepository } from '../../../domain/repositories/INotificacaoRepository'

export class DeleteNotificacaoUseCase {
  constructor(private readonly repository: INotificacaoRepository) {}

  async execute(id: number): Promise<void> {
    const notificacao = await this.repository.findById(id)
    if (!notificacao) throw new Error(`Notificacao ${id} não encontrada`)
    await this.repository.delete(id)
  }
}
