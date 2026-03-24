import { addDays } from '@/lib/formatters';

export interface Assessor {
  n: string;
  i: string;
}

export interface SubTask {
  lbl: string;
  done: boolean;
}

export interface Task {
  id: string;
  nome: string;
  ini: string;
  fim: string;
  resp: Assessor;
  subs: SubTask[];
}

export interface TaskGroup {
  nome: string;
  cor: string;
  tasks: Task[];
}

export interface Leilao {
  id: number;
  data: string;
  nome: string;
  tipo: string;
  local: string;
  animais: number;
  expectativa: number;
  metaBula: number;
  realizadoBula: number;
  assessores: Assessor[];
  img: string;
  concluido?: boolean;
}

export const LEILOES: Leilao[] = [
  { id: 1, data: '2026-06-03', nome: 'Nelore Cachoeirão', tipo: 'Touros P.O.', local: 'Campo Grande, MS', animais: 45, expectativa: 225000, metaBula: 90000, realizadoBula: 0, assessores: [{ n: 'Bulinha', i: 'B' }, { n: 'Peralta', i: 'P' }], img: '' },
  { id: 2, data: '2026-06-11', nome: 'Nelore Tresmar', tipo: 'Fêmeas P.O.', local: 'Uberaba, MG', animais: 35, expectativa: 175000, metaBula: 70000, realizadoBula: 0, assessores: [{ n: 'Leo', i: 'L' }, { n: 'Bulinha', i: 'B' }], img: '' },
  { id: 3, data: '2026-06-21', nome: 'Rancho da Matinha', tipo: 'Touros P.O.', local: 'Campo Grande, MS', animais: 220, expectativa: 1100000, metaBula: 440000, realizadoBula: 0, assessores: [{ n: 'Bulinha', i: 'B' }, { n: 'Peralta', i: 'P' }, { n: 'Leo', i: 'L' }], img: '' },
  { id: 4, data: '2026-07-05', nome: 'Agropecuária Bela Vista', tipo: 'Touros e Fêmeas', local: 'Goiânia, GO', animais: 80, expectativa: 400000, metaBula: 160000, realizadoBula: 0, assessores: [{ n: 'Peralta', i: 'P' }], img: '' },
  { id: 5, data: '2026-05-10', nome: 'Fazenda Santa Clara', tipo: 'Touros P.O.', local: 'Ribeirão Preto, SP', animais: 60, expectativa: 300000, metaBula: 120000, realizadoBula: 105000, assessores: [{ n: 'Bulinha', i: 'B' }, { n: 'Leo', i: 'L' }], img: '', concluido: true },
  { id: 6, data: '2026-05-18', nome: 'Nelore Elite – Fêmeas', tipo: 'Fêmeas P.O.', local: 'Uberaba, MG', animais: 40, expectativa: 200000, metaBula: 80000, realizadoBula: 92000, assessores: [{ n: 'Peralta', i: 'P' }, { n: 'Bulinha', i: 'B' }], img: '', concluido: true },
];

export function buildTasks(): Record<number, TaskGroup[]> {
  const tasks: Record<number, TaskGroup[]> = {};
  LEILOES.forEach(l => {
    const done = !!l.concluido;
    tasks[l.id] = [
      {
        nome: 'Pré-Leilão', cor: '#6B8F5C', tasks: [
          { id: 't1', nome: 'Visita à fazenda e seleção de animais', ini: '2026-04-15', fim: '2026-04-20', resp: { n: 'Bulinha', i: 'B' }, subs: [{ lbl: 'Agendar visita com proprietário', done: true }, { lbl: 'Avaliar lote disponível', done: true }, { lbl: 'Definir animais para catálogo', done }, { lbl: 'Registrar genealogia dos selecionados', done }] },
          { id: 't2', nome: 'Produção do catálogo', ini: '2026-04-21', fim: '2026-05-05', resp: { n: 'Leo', i: 'L' }, subs: [{ lbl: 'Sessão de fotos dos animais', done }, { lbl: 'Coleta de dados genealógicos', done }, { lbl: 'Diagramação e revisão', done: done || !done }, { lbl: 'Aprovação do cliente', done }] },
          { id: 't3', nome: 'Divulgação e marketing', ini: '2026-05-01', fim: '2026-05-28', resp: { n: 'Peralta', i: 'P' }, subs: [{ lbl: 'Criar artes para redes sociais', done: true }, { lbl: 'Enviar catálogo para mailing', done }, { lbl: 'Confirmar transmissão ao vivo', done }, { lbl: 'Publicar anúncios patrocinados', done: true }, { lbl: 'Contatar compradores potenciais', done }] },
        ]
      },
      {
        nome: 'Leilão', cor: '#C8A96E', tasks: [
          { id: 't4', nome: 'Montagem do evento', ini: l.data, fim: l.data, resp: { n: 'Bulinha', i: 'B' }, subs: [{ lbl: 'Conferir estrutura do local', done }, { lbl: 'Testar equipamentos de áudio/vídeo', done }, { lbl: 'Organizar lotes por ordem de entrada', done }] },
          { id: 't5', nome: 'Assessoria em pista', ini: l.data, fim: l.data, resp: { n: 'Peralta', i: 'P' }, subs: [{ lbl: 'Acompanhar apresentação dos lotes', done }, { lbl: 'Orientar lances e negociações', done }, { lbl: 'Registrar arrematantes', done }] },
        ]
      },
      {
        nome: 'Pós-Leilão', cor: '#4A8FBF', tasks: [
          { id: 't6', nome: 'Prestação de contas', ini: l.data, fim: addDays(l.data, 7), resp: { n: 'Leo', i: 'L' }, subs: [{ lbl: 'Consolidar valores arrematados', done }, { lbl: 'Emitir notas fiscais', done: false }, { lbl: 'Calcular e recolher comissões', done: false }, { lbl: 'Enviar relatório ao cliente', done: false }] },
          { id: 't7', nome: 'Logística de entrega', ini: l.data, fim: addDays(l.data, 14), resp: { n: 'Bulinha', i: 'B' }, subs: [{ lbl: 'Coordenar transporte dos animais', done: false }, { lbl: 'Emitir GTA (Guia de Trânsito Animal)', done: false }, { lbl: 'Confirmar recebimento pelo comprador', done: false }] },
        ]
      },
    ];
  });
  return tasks;
}

export interface KanbanCard {
  id: number;
  col: string;
  title: string;
  desc: string;
  prio: string;
  resp: Assessor[];
  venc: string;
  checks: { l: string; d: boolean }[];
  comments?: { av: string; name: string; date: string; text: string }[];
}

export const INITIAL_CARDS: KanbanCard[] = [
  { id: 1, col: 'backlog', title: 'Criar site institucional Bula', desc: 'Desenvolver site com portfólio de leilões, equipe e contato.', prio: 'media', resp: [{ n: 'Peralta', i: 'P' }], venc: '2026-08-15', checks: [{ l: 'Definir layout', d: false }, { l: 'Criar conteúdo', d: false }, { l: 'Contratar dev', d: false }] },
  { id: 2, col: 'backlog', title: 'Automatizar relatórios mensais', desc: 'Dashboard automático com dados de vendas e comissões.', prio: 'baixa', resp: [{ n: 'Leo', i: 'L' }], venc: '2026-09-01', checks: [{ l: 'Mapear métricas', d: false }, { l: 'Escolher ferramenta', d: false }] },
  { id: 3, col: 'backlog', title: 'Programa de fidelidade criadores', desc: 'Criar programa de benefícios para criadores recorrentes.', prio: 'baixa', resp: [{ n: 'Bulinha', i: 'B' }], venc: '2026-10-01', checks: [{ l: 'Pesquisar modelos', d: false }, { l: 'Definir regras', d: false }, { l: 'Apresentar proposta', d: false }] },
  { id: 4, col: 'afazer', title: 'Produção catálogo Tresmar', desc: 'Fotografia, genealogia e diagramação do catálogo completo.', prio: 'alta', resp: [{ n: 'Leo', i: 'L' }, { n: 'Peralta', i: 'P' }], venc: '2026-06-20', checks: [{ l: 'Sessão de fotos', d: true }, { l: 'Coleta genealogia', d: true }, { l: 'Diagramação', d: false }, { l: 'Revisão cliente', d: false }] },
  { id: 5, col: 'afazer', title: 'Confirmar transmissão Cachoeirão', desc: 'Acertar detalhes com equipe de transmissão ao vivo.', prio: 'alta', resp: [{ n: 'Bulinha', i: 'B' }], venc: '2026-05-30', checks: [{ l: 'Contatar equipe', d: true }, { l: 'Definir plataforma', d: false }, { l: 'Teste técnico', d: false }] },
  { id: 6, col: 'andamento', title: 'Campanha Instagram Cachoeirão', desc: 'Série de posts e stories para divulgar o leilão.', prio: 'alta', resp: [{ n: 'Peralta', i: 'P' }], venc: '2026-06-01', checks: [{ l: 'Criar 8 posts', d: true }, { l: 'Agendar stories', d: true }, { l: 'Patrocinar posts', d: false }, { l: 'Análise resultados', d: false }] },
  { id: 7, col: 'andamento', title: 'Contato compradores Matinha', desc: 'Ligar para lista de compradores potenciais.', prio: 'media', resp: [{ n: 'Bulinha', i: 'B' }, { n: 'Leo', i: 'L' }], venc: '2026-06-15', checks: [{ l: 'Lista de 50 compradores', d: true }, { l: 'Primeiras 20 ligações', d: true }, { l: 'Restante ligações', d: false }, { l: 'Follow-up interessados', d: false }] },
  { id: 8, col: 'concluido', title: 'Catálogo Santa Clara', desc: 'Catálogo finalizado e aprovado pelo cliente.', prio: 'alta', resp: [{ n: 'Leo', i: 'L' }], venc: '2026-05-01', checks: [{ l: 'Fotos', d: true }, { l: 'Genealogia', d: true }, { l: 'Diagramação', d: true }, { l: 'Aprovação', d: true }] },
  { id: 9, col: 'concluido', title: 'Prestação contas Santa Clara', desc: 'Relatório financeiro enviado ao cliente.', prio: 'media', resp: [{ n: 'Leo', i: 'L' }], venc: '2026-05-17', checks: [{ l: 'Consolidar valores', d: true }, { l: 'Notas fiscais', d: true }, { l: 'Comissões', d: true }, { l: 'Relatório', d: true }] },
];

export const COLUMNS = [
  { id: 'backlog', name: 'Backlog', color: '#555', dot: '#888' },
  { id: 'afazer', name: 'A Fazer', color: '#4A8FBF', dot: '#4A8FBF' },
  { id: 'andamento', name: 'Em Andamento', color: '#D4A843', dot: '#D4A843' },
  { id: 'concluido', name: 'Concluído', color: '#6B8F5C', dot: '#6B8F5C' },
];

export interface CrmDeal {
  id: number;
  stage: string;
  name: string;
  loc: string;
  valor: number;
  tel: string;
  email: string;
  temp: string;
  resp: Assessor;
  dias: number;
  lastInteract: string;
  notes: string;
  timeline: { type: string; date: string; text: string }[];
}

export interface CrmStage {
  id: string;
  cor: string;
  name: string;
}

export interface CrmFunnel {
  id: string;
  name: string;
  icon: string;
  stages: CrmStage[];
  deals: CrmDeal[];
}

export const CRM_FUNNELS: CrmFunnel[] = [
  {
    id: 'captacao', name: 'Captação de Leilões', icon: 'event_note',
    stages: [
      { id: 'lead', cor: '#555', name: 'Lead' },
      { id: 'contato', cor: '#4A8FBF', name: 'Contato' },
      { id: 'visita', cor: '#D4A843', name: 'Visita' },
      { id: 'proposta', cor: '#C8A96E', name: 'Proposta' },
      { id: 'fechado', cor: '#6B8F5C', name: 'Fechado' },
      { id: 'perdido', cor: '#C0504D', name: 'Perdido' },
    ],
    deals: [
      { id: 1, stage: 'lead', name: 'Fazenda Aurora', loc: 'Goiânia, GO', valor: 350000, tel: '(62) 99812-3456', email: 'aurora@email.com', temp: 'quente', resp: { n: 'Bulinha', i: 'B' }, dias: 3, lastInteract: '20/03/2026', notes: 'Proprietário demonstrou interesse em leilão de touros PO.', timeline: [{ type: 'Ligação', date: '20/03/2026', text: 'Primeiro contato por telefone. Proprietário tem 40 touros disponíveis.' }] },
      { id: 2, stage: 'lead', name: 'Agropec Silva', loc: 'Cuiabá, MT', valor: 200000, tel: '(65) 99734-5678', email: 'silva@agropec.com', temp: 'frio', resp: { n: 'Peralta', i: 'P' }, dias: 12, lastInteract: '10/03/2026', notes: '', timeline: [{ type: 'Email', date: '10/03/2026', text: 'Enviado apresentação da Bula Assessoria.' }] },
      { id: 3, stage: 'lead', name: 'Rancho Primavera', loc: 'Rondonópolis, MT', valor: 180000, tel: '(66) 99623-1234', email: '', temp: 'morno', resp: { n: 'Leo', i: 'L' }, dias: 5, lastInteract: '17/03/2026', notes: '', timeline: [{ type: 'Nota', date: '17/03/2026', text: 'Prospect encontrado na Expozebu 2026.' }] },
      { id: 4, stage: 'contato', name: 'Nelore Gold', loc: 'Ribeirão Preto, SP', valor: 500000, tel: '(16) 99456-7890', email: 'contato@neloregold.com.br', temp: 'quente', resp: { n: 'Bulinha', i: 'B' }, dias: 8, lastInteract: '14/03/2026', notes: 'Fazenda com plantel de 80 matrizes elite.', timeline: [{ type: 'Reunião', date: '14/03/2026', text: 'Reunião presencial. Proprietário quer leilão em setembro.' }] },
      { id: 5, stage: 'contato', name: 'Fazenda Esperança', loc: 'Uberaba, MG', valor: 280000, tel: '(34) 99867-4321', email: 'esperanca@fazenda.com', temp: 'morno', resp: { n: 'Peralta', i: 'P' }, dias: 15, lastInteract: '07/03/2026', notes: '', timeline: [{ type: 'Ligação', date: '07/03/2026', text: 'Segundo contato. Pediu proposta por email.' }] },
      { id: 6, stage: 'visita', name: 'Haras Santa Fé', loc: 'Campo Grande, MS', valor: 420000, tel: '(67) 99912-8765', email: 'santafe@haras.com', temp: 'quente', resp: { n: 'Bulinha', i: 'B' }, dias: 4, lastInteract: '18/03/2026', notes: 'Visita agendada para 25/03. Plantel excelente.', timeline: [{ type: 'Visita', date: '18/03/2026', text: 'Visita técnica realizada. 55 touros selecionados.' }] },
      { id: 7, stage: 'visita', name: 'Estância Boa Sorte', loc: 'Londrina, PR', valor: 300000, tel: '(43) 99845-6789', email: 'boasorte@estancia.com', temp: 'morno', resp: { n: 'Leo', i: 'L' }, dias: 10, lastInteract: '12/03/2026', notes: '', timeline: [{ type: 'Visita', date: '12/03/2026', text: 'Visita à propriedade. Bom plantel de Nelore PO.' }] },
      { id: 8, stage: 'proposta', name: 'Fazenda Três Irmãos', loc: 'Jataí, GO', valor: 600000, tel: '(64) 99978-2345', email: 'tresirmaos@fazenda.com', temp: 'quente', resp: { n: 'Bulinha', i: 'B' }, dias: 6, lastInteract: '16/03/2026', notes: 'Proposta enviada dia 16/03. Aguardando retorno.', timeline: [{ type: 'Proposta', date: '16/03/2026', text: 'Proposta comercial enviada. Leilão de 70 touros PO.' }] },
      { id: 9, stage: 'fechado', name: 'Fazenda Cachoeirão', loc: 'Campo Grande, MS', valor: 225000, tel: '(67) 99834-1234', email: 'cachoeirão@faz.com', temp: 'quente', resp: { n: 'Bulinha', i: 'B' }, dias: 0, lastInteract: '15/05/2026', notes: 'Contrato assinado.', timeline: [{ type: 'Contrato', date: '15/05/2026', text: 'Contrato de assessoria assinado.' }] },
      { id: 10, stage: 'fechado', name: 'Nelore Tresmar', loc: 'Uberaba, MG', valor: 175000, tel: '(34) 99823-5678', email: 'tresmar@nelore.com', temp: 'quente', resp: { n: 'Peralta', i: 'P' }, dias: 0, lastInteract: '20/04/2026', notes: 'Leilão confirmado para 11/06.', timeline: [{ type: 'Contrato', date: '20/04/2026', text: 'Contrato assinado.' }] },
      { id: 11, stage: 'perdido', name: 'Rancho Velho', loc: 'Araçatuba, SP', valor: 150000, tel: '(18) 99712-3456', email: '', temp: 'frio', resp: { n: 'Leo', i: 'L' }, dias: 30, lastInteract: '20/02/2026', notes: 'Fechou com concorrente.', timeline: [{ type: 'Nota', date: '20/02/2026', text: 'Proprietário optou pela Agro Partners.' }] },
    ]
  },
  {
    id: 'clientes', name: 'Clientes', icon: 'people',
    stages: [
      { id: 'lead', cor: '#555', name: 'Lead' },
      { id: 'qualificado', cor: '#4A8FBF', name: 'Qualificado' },
      { id: 'proposta', cor: '#D4A843', name: 'Proposta' },
      { id: 'negociacao', cor: '#C8A96E', name: 'Negociação' },
      { id: 'fechado', cor: '#6B8F5C', name: 'Fechado' },
      { id: 'perdido', cor: '#C0504D', name: 'Perdido' },
    ],
    deals: []
  },
];

export interface Lead {
  id: number;
  name: string;
  tel: string;
  regiao: string;
  rebanho: number;
  origem: string;
  status: string;
  interesse: string;
  orcamento: number;
}

export const LEADS: Lead[] = [
  { id: 1, name: 'Carlos Mendes', tel: '(67) 99812-4567', regiao: 'MS', rebanho: 450, origem: 'Instagram', status: 'novo', interesse: '', orcamento: 0 },
  { id: 2, name: 'Roberto Almeida', tel: '(62) 99734-2345', regiao: 'GO', rebanho: 800, origem: 'Google Ads', status: 'novo', interesse: '', orcamento: 0 },
  { id: 3, name: 'Marcos Ferreira', tel: '(34) 99856-7890', regiao: 'MG', rebanho: 200, origem: 'Instagram', status: 'atendimento', interesse: '', orcamento: 0 },
  { id: 4, name: 'João Batista', tel: '(16) 99423-1234', regiao: 'SP', rebanho: 320, origem: 'Facebook', status: 'novo', interesse: '', orcamento: 0 },
  { id: 5, name: 'Renato Silva', tel: '(65) 99678-5678', regiao: 'MT', rebanho: 1200, origem: 'Google Ads', status: 'qualificado', interesse: 'Touros PO', orcamento: 400000 },
  { id: 6, name: 'Pedro Nogueira', tel: '(43) 99345-9876', regiao: 'PR', rebanho: 150, origem: 'WhatsApp', status: 'novo', interesse: '', orcamento: 0 },
  { id: 7, name: 'Antônio Reis', tel: '(67) 99912-3456', regiao: 'MS', rebanho: 600, origem: 'Instagram', status: 'atendimento', interesse: '', orcamento: 0 },
  { id: 8, name: 'Fernando Costa', tel: '(62) 99567-8901', regiao: 'GO', rebanho: 350, origem: 'Site', status: 'novo', interesse: '', orcamento: 0 },
  { id: 9, name: 'Luiz Henrique', tel: '(34) 99234-5678', regiao: 'MG', rebanho: 90, origem: 'Facebook', status: 'novo', interesse: '', orcamento: 0 },
  { id: 10, name: 'Gustavo Pereira', tel: '(77) 99123-4567', regiao: 'BA', rebanho: 500, origem: 'Instagram', status: 'novo', interesse: '', orcamento: 0 },
  { id: 11, name: 'Ricardo Santos', tel: '(16) 99876-5432', regiao: 'SP', rebanho: 700, origem: 'Google Ads', status: 'atendimento', interesse: '', orcamento: 0 },
  { id: 12, name: 'Daniel Oliveira', tel: '(67) 99456-7890', regiao: 'MS', rebanho: 250, origem: 'Instagram', status: 'novo', interesse: '', orcamento: 0 },
  { id: 13, name: 'Eduardo Lima', tel: '(65) 99789-0123', regiao: 'MT', rebanho: 180, origem: 'WhatsApp', status: 'novo', interesse: '', orcamento: 0 },
  { id: 14, name: 'Marcelo Rocha', tel: '(62) 99345-6789', regiao: 'GO', rebanho: 1500, origem: 'Site', status: 'qualificado', interesse: 'Fêmeas PO', orcamento: 600000 },
  { id: 15, name: 'Paulo Ribeiro', tel: '(43) 99678-9012', regiao: 'PR', rebanho: 45, origem: 'Facebook', status: 'descartado', interesse: '', orcamento: 0 },
  { id: 16, name: 'Bruno Carvalho', tel: '(34) 99012-3456', regiao: 'MG', rebanho: 380, origem: 'Instagram', status: 'novo', interesse: '', orcamento: 0 },
  { id: 17, name: 'Thiago Nascimento', tel: '(67) 99234-5678', regiao: 'MS', rebanho: 900, origem: 'WhatsApp', status: 'novo', interesse: '', orcamento: 0 },
  { id: 18, name: 'André Moura', tel: '(16) 99567-8901', regiao: 'SP', rebanho: 60, origem: 'Instagram', status: 'novo', interesse: '', orcamento: 0 },
];

export const DRIVE_DATA: Record<string, { type: string; name: string; items?: number; size?: string; date?: string; thumb?: boolean }[]> = {
  '': [
    { type: 'folder', name: 'Leilões', items: 14 },
    { type: 'folder', name: 'Marketing', items: 8 },
    { type: 'folder', name: 'Catálogos', items: 5 },
    { type: 'folder', name: 'Contratos', items: 6 },
    { type: 'folder', name: 'Fotos Animais', items: 12 },
    { type: 'folder', name: 'Vídeos', items: 4 },
  ],
  'Leilões': [
    { type: 'folder', name: 'Nelore Cachoeirão', items: 6 },
    { type: 'folder', name: 'Nelore Tresmar', items: 4 },
    { type: 'folder', name: 'Rancho da Matinha', items: 5 },
    { type: 'folder', name: 'Fazenda Santa Clara', items: 4 },
  ],
  'Leilões/Nelore Cachoeirão': [
    { type: 'file', name: 'touro-principal.jpg', size: '4.2 MB', date: '28/05/2026', thumb: true },
    { type: 'file', name: 'lote-femeas.jpg', size: '3.8 MB', date: '28/05/2026', thumb: true },
    { type: 'file', name: 'catalogo-cachoeirão.pdf', size: '12.4 MB', date: '20/05/2026' },
    { type: 'file', name: 'contrato-assessoria.pdf', size: '340 KB', date: '15/04/2026' },
  ],
  'Marketing': [
    { type: 'file', name: 'post-instagram-01.jpg', size: '1.2 MB', date: '15/06/2026', thumb: true },
    { type: 'file', name: 'post-instagram-02.jpg', size: '1.4 MB', date: '12/06/2026', thumb: true },
    { type: 'file', name: 'banner-site.jpg', size: '2.1 MB', date: '08/06/2026', thumb: true },
    { type: 'file', name: 'apresentacao-comercial.pdf', size: '5.4 MB', date: '01/06/2026' },
    { type: 'file', name: 'video-institucional.mp4', size: '250 MB', date: '15/05/2026' },
  ],
  'Catálogos': [
    { type: 'file', name: 'catalogo-cachoeirão-2026.pdf', size: '12.4 MB', date: '20/05/2026' },
    { type: 'file', name: 'catalogo-tresmar-2026.pdf', size: '8.7 MB', date: '01/06/2026' },
    { type: 'file', name: 'catalogo-matinha-2026.pdf', size: '15.2 MB', date: '08/06/2026' },
  ],
  'Contratos': [
    { type: 'file', name: 'contrato-cachoeirão.pdf', size: '340 KB', date: '15/04/2026' },
    { type: 'file', name: 'contrato-tresmar.pdf', size: '310 KB', date: '20/04/2026' },
    { type: 'file', name: 'modelo-contrato-assessoria.docx', size: '85 KB', date: '01/01/2026' },
  ],
  'Fotos Animais': [
    { type: 'file', name: 'touro-nelore-01.jpg', size: '5.8 MB', date: '20/06/2026', thumb: true },
    { type: 'file', name: 'touro-nelore-02.jpg', size: '4.9 MB', date: '20/06/2026', thumb: true },
    { type: 'file', name: 'matriz-elite-01.jpg', size: '5.2 MB', date: '18/06/2026', thumb: true },
    { type: 'file', name: 'bezerro-campeonato.jpg', size: '3.8 MB', date: '15/06/2026', thumb: true },
  ],
  'Vídeos': [
    { type: 'file', name: 'leilao-cachoeirão-completo.mp4', size: '1.2 GB', date: '03/06/2026' },
    { type: 'file', name: 'entrevista-bulinha.mp4', size: '340 MB', date: '20/05/2026' },
  ],
};

export const SIDEBAR_FOLDERS = [
  { path: '', name: 'Todos os Arquivos', icon: 'home' },
  { path: 'Leilões', name: 'Leilões', icon: 'event_note' },
  { path: 'Marketing', name: 'Marketing', icon: 'campaign' },
  { path: 'Catálogos', name: 'Catálogos', icon: 'menu_book' },
  { path: 'Contratos', name: 'Contratos', icon: 'gavel' },
  { path: 'Fotos Animais', name: 'Fotos Animais', icon: 'photo_library' },
  { path: 'Vídeos', name: 'Vídeos', icon: 'video_library' },
];

export function calcLeadScore(lead: Lead) {
  let s = 0;
  if (lead.rebanho > 500) s += 50;
  else if (lead.rebanho > 200) s += 40;
  else if (lead.rebanho > 50) s += 25;
  else s += 10;
  if (['MS', 'GO', 'MG', 'SP'].includes(lead.regiao)) s += 20;
  else s += 10;
  if (['Google Ads', 'Site'].includes(lead.origem)) s += 15;
  else if (['Instagram', 'Facebook'].includes(lead.origem)) s += 10;
  else s += 5;
  if (lead.status === 'atendimento') s += 10;
  if (lead.status === 'qualificado') s += 15;
  return Math.min(s, 100);
}

export function scoreColor(s: number) {
  if (s >= 70) return 'hsl(var(--olive))';
  if (s >= 40) return 'hsl(var(--amber))';
  return 'hsl(var(--bula-red))';
}

export function getFileType(name: string) {
  const ext = name.split('.').pop()?.toLowerCase() || '';
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) return 'image';
  if (['mp4', 'mov', 'avi', 'mkv'].includes(ext)) return 'video';
  if (ext === 'pdf') return 'pdf';
  if (['doc', 'docx', 'txt'].includes(ext)) return 'doc';
  if (['xls', 'xlsx', 'csv'].includes(ext)) return 'xls';
  return 'other';
}

export const FILE_ICONS: Record<string, { icon: string; color: string }> = {
  folder: { icon: 'folder', color: 'hsl(var(--gold))' },
  image: { icon: 'image', color: '#7CB9A8' },
  video: { icon: 'videocam', color: '#C0504D' },
  pdf: { icon: 'picture_as_pdf', color: '#C0504D' },
  doc: { icon: 'description', color: '#4A8FBF' },
  xls: { icon: 'table_chart', color: '#6B8F5C' },
  other: { icon: 'draft', color: '#666' },
};

export const STATUS_LBL: Record<string, string> = { novo: 'Novo', atendimento: 'Em atendimento', qualificado: 'Qualificado', descartado: 'Descartado' };
export const ORIGEM_ICON: Record<string, string> = { Instagram: 'photo_camera', Facebook: 'thumb_up', 'Google Ads': 'search', WhatsApp: 'chat', Site: 'language' };
