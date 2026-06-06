import { Notificacao } from '../../../domain/entities/Notificacao'
import { INotificacaoRepository } from '../../../domain/repositories/INotificacaoRepository'
import { CreateNotificacaoDTO } from '../../dtos/NotificacaoDTO'

export class CreateNotificacaoUseCase {
  constructor(private readonly repo: INotificacaoRepository) {}

  async execute(dto: CreateNotificacaoDTO): Promise<Notificacao> {
    // Cria a notificação (nasce PENDENTE)
    const n = new Notificacao({ ...dto, status: 'PENDENTE' })

    // ── Simula o envio pelo provedor (email/SMS/push) ──────────────────
    // Em produção: aqui chamaria SendGrid, Twilio, FCM, etc.
    // A regra de domínio marcarEnviada() altera o status e registra enviadoEm.
    n.marcarEnviada()

    return this.repo.create(n)
  }
}
