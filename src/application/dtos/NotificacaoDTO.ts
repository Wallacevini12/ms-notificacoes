// src/application/dtos/NotificacaoDTO.ts
import { NotificacaoCanal, NotificacaoStatus, NotificacaoTipo } from '../../domain/entities/Notificacao'

export interface CreateNotificacaoDTO {
  agendamentoId:   string
  beneficiarioId:  string
  beneficiarioNome:string
  tipo:            NotificacaoTipo
  canal:           NotificacaoCanal
  mensagem:        string
}

export interface UpdateNotificacaoDTO {
  status?: NotificacaoStatus
}
