import { Notificacao } from '../../src/domain/entities/Notificacao'

describe('Notificacao Entity', () => {
  const makeN = () => new Notificacao({
    agendamentoId:   'ag-001',
    beneficiarioId:  'b-001',
    beneficiarioNome:'Maria Silva',
    tipo:            'CONFIRMACAO',
    canal:           'EMAIL',
    mensagem:        'Sua consulta foi confirmada.',
    status:          'PENDENTE',
  })

  it('deve criar notificação com status PENDENTE', () => {
    const n = makeN()
    expect(n.status).toBe('PENDENTE')
    expect(n.tentativas).toBe(0)
  })

  it('deve marcar como enviada', () => {
    const n = makeN()
    n.marcarEnviada()
    expect(n.status).toBe('ENVIADA')
    expect(n.tentativas).toBe(1)
    expect(n.enviadoEm).not.toBeNull()
  })

  it('deve marcar como falha', () => {
    const n = makeN()
    n.marcarFalha()
    expect(n.status).toBe('FALHOU')
    expect(n.tentativas).toBe(1)
  })

  it('deve marcar como lida após enviada', () => {
    const n = makeN()
    n.marcarEnviada()
    n.marcarLida()
    expect(n.status).toBe('LIDA')
  })

  it('não deve marcar como lida se não foi enviada', () => {
    const n = makeN()
    expect(() => n.marcarLida()).toThrow()
  })

  it('deve lançar erro se mensagem vazia', () => {
    expect(() => new Notificacao({
      agendamentoId:'ag', beneficiarioId:'b', beneficiarioNome:'X',
      tipo:'LEMBRETE', canal:'SMS', mensagem:'', status:'PENDENTE'
    })).toThrow('mensagem é obrigatória')
  })
})
