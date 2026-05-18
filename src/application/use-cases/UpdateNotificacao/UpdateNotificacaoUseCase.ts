import { Notificacao } from '../../../domain/entities/Notificacao'
import { INotificacaoRepository } from '../../../domain/repositories/INotificacaoRepository'

export class UpdateNotificacaoUseCase {
  constructor(private readonly repository: INotificacaoRepository) {}

  async execute(id: number, status: string): Promise<Notificacao> {
    const notificacao = await this.repository.findById(id)
    if (!notificacao) throw new Error(`Notificacao ${id} não encontrada`)

    if (status === 'ENVIADA') notificacao.marcarEnviada()
    else if (status === 'FALHOU') notificacao.marcarFalha()
    else if (status === 'LIDA')   notificacao.marcarLida()
    else throw new Error(`Status inválido: ${status}. Use ENVIADA, FALHOU ou LIDA.`)

    return this.repository.update(notificacao)
  }
}
