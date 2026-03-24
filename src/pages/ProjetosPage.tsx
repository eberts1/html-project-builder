import { useState, useMemo } from 'react';
import { INITIAL_CARDS, COLUMNS, type KanbanCard } from '@/data/mockData';
import { progColor, calcTaskProg } from '@/lib/formatters';

export default function ProjetosPage() {
  const [cards, setCards] = useState<KanbanCard[]>(() => JSON.parse(JSON.stringify(INITIAL_CARDS)));
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [filterPerson, setFilterPerson] = useState('todos');
  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  const people = ['todos', 'Bulinha', 'Peralta', 'Leo'];
  const filtered = filterPerson === 'todos' ? cards : cards.filter(c => c.resp.some(r => r.n === filterPerson));

  function cardProg(card: KanbanCard) {
    if (!card.checks.length) return 0;
    return Math.round(card.checks.filter(c => c.d).length / card.checks.length * 100);
  }

  function prioLabel(p: string) {
    return p === 'alta' ? 'Alta' : p === 'media' ? 'Média' : 'Baixa';
  }

  function prioClass(p: string) {
    return p === 'alta' ? 'bg-bula-red-bg text-bula-red' : p === 'media' ? 'bg-bula-amber-bg text-bula-amber' : 'bg-olive-bg text-olive';
  }

  function closeModal() {
    setSelectedCard(null);
  }

  const card = selectedCard !== null ? cards.find(c => c.id === selectedCard) : null;

  return (
    <div className="px-7 pt-7 pb-10 max-w-full">
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="flex-1 min-w-0">
          <div className="text-xl font-bold">Projetos</div>
          <div className="text-xs text-t-3 mt-1">Gerencie tarefas e acompanhe o progresso da equipe</div>
        </div>

        <div className="flex gap-1.5 overflow-x-auto">
          {people.map(p => (
            <button key={p} onClick={() => setFilterPerson(p)} className={`bg-surface-2 border rounded-full px-3 py-1.5 text-[11px] font-medium cursor-pointer flex items-center gap-1.5 whitespace-nowrap transition-all ${filterPerson === p ? 'bg-gold-dim text-primary border-[rgba(200,169,110,0.3)]' : 'text-t-3 border-border hover:text-t-2'}`}>
              {p !== 'todos' && <span className="w-[18px] h-[18px] bg-surface-3 rounded-full flex items-center justify-center text-[8px] font-semibold">{p[0]}</span>}
              {p === 'todos' ? 'Todos' : p}
            </button>
          ))}
        </div>

        <div className="hidden md:flex bg-surface-2 border border-border rounded-lg overflow-hidden">
          {(['kanban', 'list'] as const).map(mode => (
            <button key={mode} onClick={() => setViewMode(mode)} className={`bg-transparent border-none px-2.5 py-1.5 cursor-pointer flex items-center transition-all ${viewMode === mode ? 'bg-gold-dim text-primary' : 'text-t-3 hover:text-t-2'}`}>
              <span className="material-symbols-outlined text-[16px]">{mode === 'kanban' ? 'view_kanban' : 'view_list'}</span>
            </button>
          ))}
        </div>

        <button className="bg-primary text-primary-foreground border-none py-2 px-5 rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1.5 hover:bg-gold-dark transition-colors">
          <span className="material-symbols-outlined text-[16px]">add</span> Novo Card
        </button>
      </div>

      {viewMode === 'kanban' ? (
        <div className="flex gap-3.5 overflow-x-auto pb-4 items-start min-h-[calc(100vh-180px)]">
          {COLUMNS.map(col => {
            const colCards = filtered.filter(c => c.col === col.id);
            return (
              <div key={col.id} className="min-w-[280px] max-w-[320px] flex-1 bg-surface-2 rounded-xl flex flex-col">
                <div className="p-3 flex items-center gap-2 rounded-t-xl">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: col.dot }} />
                  <span className="text-[13px] font-bold">{col.name}</span>
                  <span className="text-[10px] font-semibold text-t-3 bg-surface-3 px-2 py-0.5 rounded-full ml-auto">{colCards.length}</span>
                </div>
                <div className="px-2.5 flex-1 flex flex-col gap-2.5 min-h-[40px] pb-2.5">
                  {colCards.map(card => {
                    const pct = cardProg(card);
                    const doneCh = card.checks.filter(c => c.d).length;
                    const overdue = new Date(card.venc) < new Date();
                    return (
                      <div key={card.id} onClick={() => setSelectedCard(card.id)} className="bg-surface border border-border rounded-lg p-3.5 cursor-pointer transition-all hover:border-[rgba(200,169,110,0.25)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
                        <span className={`inline-flex text-[9px] font-semibold px-2 py-0.5 rounded mb-2 ${prioClass(card.prio)}`}>{prioLabel(card.prio)}</span>
                        <div className="text-[13px] font-semibold mb-1.5 leading-snug">{card.title}</div>
                        {card.desc && <div className="text-[11px] text-t-3 mb-2.5 leading-snug line-clamp-2">{card.desc}</div>}
                        <div className="flex items-center gap-2 text-[10px] text-t-3">
                          <span className={`flex items-center gap-0.5 ${overdue ? 'text-bula-red' : ''}`}>
                            <span className="material-symbols-outlined text-[13px]">schedule</span>
                            {card.venc.slice(5).replace('-', '/')}
                          </span>
                          {card.checks.length > 0 && (
                            <span className={`flex items-center gap-0.5 ${doneCh === card.checks.length ? 'text-olive' : ''}`}>
                              <span className="material-symbols-outlined text-[13px]">check_circle</span>
                              {doneCh}/{card.checks.length}
                            </span>
                          )}
                          <div className="ml-auto flex">
                            {card.resp.map((r, i) => (
                              <div key={i} className="w-6 h-6 bg-surface-3 border-2 border-surface rounded-full flex items-center justify-center text-[9px] font-semibold text-t-2 -ml-1.5 first:ml-0">{r.i}</div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-xl overflow-hidden">
          <div className="grid grid-cols-[1fr_110px_80px_120px_100px] px-[18px] h-9 items-center bg-surface-2 border-b border-border text-[9px] font-semibold text-t-3 uppercase tracking-wider">
            <div>Tarefa</div><div>Status</div><div>Prioridade</div><div>Responsável</div><div>Progresso</div>
          </div>
          {filtered.map(card => {
            const pct = cardProg(card);
            const pc = progColor(pct);
            const col = COLUMNS.find(c => c.id === card.col);
            return (
              <div key={card.id} onClick={() => setSelectedCard(card.id)} className="grid grid-cols-[1fr_110px_80px_120px_100px] px-[18px] h-[46px] items-center border-b border-border last:border-b-0 cursor-pointer hover:bg-[rgba(200,169,110,0.04)] text-xs transition-colors">
                <div className="font-semibold truncate">{card.title}</div>
                <div><span className="text-[10px] font-semibold px-3 py-1 rounded-full" style={{ background: col?.color + '20', color: col?.color }}>{col?.name}</span></div>
                <div><span className={`text-[9px] font-semibold px-2 py-0.5 rounded ${prioClass(card.prio)}`}>{prioLabel(card.prio)}</span></div>
                <div className="flex items-center gap-1.5">
                  {card.resp.map((r, i) => (
                    <span key={i} className="w-6 h-6 bg-surface-3 rounded-full flex items-center justify-center text-[9px] font-semibold text-t-2">{r.i}</span>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-[7px] bg-surface-3 rounded overflow-hidden"><div className="h-full rounded" style={{ width: `${pct}%`, background: pc }} /></div>
                  <span className="text-[10px] font-bold" style={{ color: pc }}>{pct}%</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Card Modal */}
      {selectedCard !== null && card && (
        <>
          <div className="fixed inset-0 bg-[rgba(0,0,0,0.6)] z-[200]" onClick={closeModal} />
          <div className="fixed top-0 right-0 w-[520px] max-w-full h-screen bg-surface border-l border-border z-[201] overflow-y-auto flex flex-col animate-in slide-in-from-right">
            <div className="p-6 pb-0 flex-shrink-0">
              <span className="material-symbols-outlined absolute top-5 right-5 cursor-pointer text-t-3 hover:text-primary transition-colors" onClick={closeModal}>close</span>
              <div className="text-xl font-bold mb-1">{card.title}</div>
              <div className="text-xs text-t-3">{card.desc}</div>
            </div>
            <div className="h-px bg-border mx-7 my-4" />
            <div className="flex-1 overflow-y-auto px-7">
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <div className="text-[11px] font-semibold text-t-2 mb-2 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-primary">flag</span> Status
                  </div>
                  <div className="text-xs px-3 py-2.5 bg-surface-2 border border-border rounded-lg" style={{ color: COLUMNS.find(c => c.id === card.col)?.color }}>
                    {COLUMNS.find(c => c.id === card.col)?.name}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-t-2 mb-2 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-primary">priority_high</span> Prioridade
                  </div>
                  <div className={`text-xs px-3 py-2.5 bg-surface-2 border border-border rounded-lg`}>
                    <span className={`text-[9px] font-semibold px-2 py-0.5 rounded ${prioClass(card.prio)}`}>{prioLabel(card.prio)}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <div className="text-[11px] font-semibold text-t-2 mb-2 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-primary">event</span> Prazo
                  </div>
                  <div className="text-xs px-3 py-2.5 bg-surface-2 border border-border rounded-lg text-t-2">{card.venc}</div>
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-t-2 mb-2 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-primary">group</span> Responsáveis
                  </div>
                  <div className="flex gap-2">
                    {card.resp.map((r, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs text-t-2">
                        <span className="w-6 h-6 bg-surface-3 rounded-full flex items-center justify-center text-[10px] font-semibold">{r.i}</span>
                        {r.n}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {card.checks.length > 0 && (
                <>
                  <div className="h-px bg-border my-4" />
                  <div className="text-[11px] font-semibold text-t-2 mb-3 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-primary">checklist</span> Checklist
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex-1 h-1.5 bg-surface-3 rounded overflow-hidden">
                      <div className="h-full rounded" style={{ width: `${cardProg(card)}%`, background: progColor(cardProg(card)) }} />
                    </div>
                    <span className="text-[10px] font-semibold" style={{ color: progColor(cardProg(card)) }}>{cardProg(card)}%</span>
                  </div>
                  {card.checks.map((ch, i) => (
                    <div key={i} className="flex items-center gap-2.5 py-2 border-b border-border last:border-b-0 text-xs text-t-2">
                      <input
                        type="checkbox"
                        checked={ch.d}
                        onChange={() => {
                          const next = [...cards];
                          const c = next.find(x => x.id === card.id)!;
                          c.checks[i].d = !c.checks[i].d;
                          setCards(next);
                        }}
                        className="w-4 h-4 accent-primary cursor-pointer"
                      />
                      <span className={ch.d ? 'line-through text-t-4' : ''}>{ch.l}</span>
                    </div>
                  ))}
                </>
              )}
            </div>

            <div className="p-4 border-t border-border flex items-center gap-3 flex-shrink-0 bg-surface">
              <button onClick={() => { setCards(cards.filter(c => c.id !== card.id)); closeModal(); }} className="bg-transparent border-none text-xs text-bula-red cursor-pointer flex items-center gap-1 hover:opacity-80 transition-opacity">
                <span className="material-symbols-outlined text-[16px]">delete</span> Excluir
              </button>
              <span className="flex-1" />
              <button onClick={closeModal} className="bg-transparent border-none text-xs text-t-3 cursor-pointer hover:text-foreground transition-colors px-3.5 py-2">Cancelar</button>
              <button onClick={closeModal} className="bg-primary text-primary-foreground border-none py-2 px-5 rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1.5 hover:bg-gold-dark transition-colors">
                <span className="material-symbols-outlined text-[15px]">save</span> Salvar
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
