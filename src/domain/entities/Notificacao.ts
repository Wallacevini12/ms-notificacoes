export type NotificacaoCanal  = 'EMAIL' | 'SMS' | 'PUSH'
export type NotificacaoTipo   = 'CONFIRMACAO' | 'LEMBRETE' | 'CANCELAMENTO' | 'AUTORIZACAO'
export type NotificacaoStatus = 'PENDENTE' | 'ENVIADA' | 'FALHOU' | 'LIDA'

export interface NotificacaoProps {
  id?:             number
  agendamentoId:   string
  beneficiarioId:  string
  beneficiarioNome:string
  tipo:            NotificacaoTipo
  canal:           NotificacaoCanal
  mensagem:        string
  status:          NotificacaoStatus
  tentativas?:     number
  enviadoEm?:      Date | null
  createdAt?:      Date
  updatedAt?:      Date
}

export class Notificacao {
  readonly id?:            number
  readonly agendamentoId:  string
  readonly beneficiarioId: string
  readonly beneficiarioNome: string
  readonly tipo:           NotificacaoTipo
  readonly canal:          NotificacaoCanal
  readonly mensagem:       string
  status:                  NotificacaoStatus
  tentativas:              number
  enviadoEm:               Date | null
  readonly createdAt:      Date
  updatedAt:               Date

  constructor(props: NotificacaoProps) {
    if (!props.agendamentoId)  throw new Error('agendamentoId é obrigatório')
    if (!props.beneficiarioId) throw new Error('beneficiarioId é obrigatório')
    if (!props.mensagem)       throw new Error('mensagem é obrigatória')

    this.id              = props.id
    this.agendamentoId   = props.agendamentoId
    this.beneficiarioId  = props.beneficiarioId
    this.beneficiarioNome= props.beneficiarioNome
    this.tipo            = props.tipo
    this.canal           = props.canal
    this.mensagem        = props.mensagem
    this.status          = props.status ?? 'PENDENTE'
    this.tentativas      = props.tentativas ?? 0
    this.enviadoEm       = props.enviadoEm ?? null
    this.createdAt       = props.createdAt ?? new Date()
    this.updatedAt       = props.updatedAt ?? new Date()
  }

  marcarEnviada(): void {
    this.status    = 'ENVIADA'
    this.enviadoEm = new Date()
    this.tentativas += 1
    this.updatedAt  = new Date()
  }

  marcarFalha(): void {
    this.status    = 'FALHOU'
    this.tentativas += 1
    this.updatedAt  = new Date()
  }

  marcarLida(): void {
    if (this.status !== 'ENVIADA') throw new Error('Apenas notificações ENVIADAS podem ser marcadas como lidas')
    this.status    = 'LIDA'
    this.updatedAt  = new Date()
  }

  toJSON(): NotificacaoProps {
    return {
      id:              this.id,
      agendamentoId:   this.agendamentoId,
      beneficiarioId:  this.beneficiarioId,
      beneficiarioNome:this.beneficiarioNome,
      tipo:            this.tipo,
      canal:           this.canal,
      mensagem:        this.mensagem,
      status:          this.status,
      tentativas:      this.tentativas,
      enviadoEm:       this.enviadoEm,
      createdAt:       this.createdAt,
      updatedAt:       this.updatedAt,
    }
  }
}
