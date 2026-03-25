import { useState, useRef } from 'react';
import { CRM_FUNNELS, type CrmFunnel, type CrmDeal } from '@/data/mockData';
import { fmtValorShort } from '@/lib/formatters';
import NewDealDialog from '@/components/crm/NewDealDialog';
import DealCard from '@/components/crm/DealCard';

function tempClass(t: string) {
  return t === 'quente' ? 'bg-bula-red-bg text-bula-red' : t === 'morno' ? 'bg-amber-bg text-amber' : 'bg-bula-blue-bg text-bula-blue';
}

export default function CRMPage() {
  const [funnels, setFunnels] = useState<CrmFunnel[]>(() => JSON.parse(JSON.stringify(CRM_FUNNELS)));
  const [activeFunnel, setActiveFunnel] = useState('captacao');
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [filterPerson, setFilterPerson] = useState('todos');
  const [selectedDeal, setSelectedDeal] = useState<number | null>(null);
  const [newDealOpen, setNewDealOpen] = useState(false);
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);
  const dragDealId = useRef<number | null>(null);

  const funnel = funnels.find(f => f.id === activeFunnel)!;
  const deals = filterPerson === 'todos' ? funnel.deals : funnel.deals.filter(d => d.resp.n === filterPerson);
  const activeDeals = deals.filter(d => d.stage !== 'perdido');
  const valorTotal = activeDeals.reduce((s, d) => s + d.valor, 0);
  const fechados = activeDeals.filter(d => d.stage === 'fechado').length;
  const taxa = activeDeals.length ? Math.round(fechados / activeDeals.length * 100) : 0;
  const ticketMedio = activeDeals.length ? Math.round(valorTotal / activeDeals.length) : 0;

  const deal = selectedDeal !== null ? funnel.deals.find(d => d.id === selectedDeal) : null;
  const people = ['todos', 'Bulinha', 'Peralta', 'Leo'];

  // --- Drag and Drop ---
  function handleDragStart(_e: React.DragEvent, dealId: number) {
    dragDealId.current = dealId;
  }

  function handleDragOver(e: React.DragEvent, stageId: string) {
    e.preventDefault();
    setDragOverStage(stageId);
  }

  function handleDragLeave() {
    setDragOverStage(null);
  }

  function handleDrop(e: React.DragEvent, targetStage: string) {
    e.preventDefault();
    setDragOverStage(null);
    const id = dragDealId.current;
    if (id === null) return;

    setFunnels(prev => prev.map(f => {
      if (f.id !== activeFunnel) return f;
      const dealIdx = f.deals.findIndex(d => d.id === id);
      if (dealIdx === -1 || f.deals[dealIdx].stage === targetStage) return f;
      const updated = [...f.deals];
      const oldStage = updated[dealIdx].stage;
      updated[dealIdx] = {
        ...updated[dealIdx],
        stage: targetStage,
        timeline: [
          { type: 'Movido', date: new Date().toLocaleDateString('pt-BR'), text: `Movido de "${funnel.stages.find(s => s.id === oldStage)?.name}" para "${funnel.stages.find(s => s.id === targetStage)?.name}".` },
          ...updated[dealIdx].timeline,
        ],
      };
      return { ...f, deals: updated };
    }));
    dragDealId.current = null;
  }

  // --- Add new deal ---
  function handleAddDeal(newDeal: CrmDeal) {
    setFunnels(prev => prev.map(f => {
      if (f.id !== activeFunnel) return f;
      return { ...f, deals: [...f.deals, newDeal] };
    }));
  }

  return (
    <div className="px-7 pt-7 pb-10 max-w-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="flex-1 min-w-0">
          <div className="text-xl font-bold">CRM de Vendas</div>
          <div className="text-xs text-t-3 mt-1">Gerencie seus negócios e acompanhe o pipeline</div>
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

        <button onClick={() => setNewDealOpen(true)} className="bg-primary text-primary-foreground border-none py-2 px-5 rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1.5 hover:bg-gold-dark transition-colors">
          <span className="material-symbols-outlined text-[16px]">add</span> Novo Negócio
        </button>
      </div>

      {/* Funnel tabs */}
      <div className="flex items-center gap-1.5 mb-2 overflow-x-auto">
        {funnels.map(f => (
          <button key={f.id} onClick={() => setActiveFunnel(f.id)} className={`bg-surface-2 border rounded-full px-4 py-1.5 text-[11px] font-medium cursor-pointer flex items-center gap-1.5 whitespace-nowrap transition-all ${activeFunnel === f.id ? 'bg-gold-dim text-primary border-[rgba(200,169,110,0.3)] font-semibold' : 'text-t-3 border-border hover:text-t-2'}`}>
            <span className="material-symbols-outlined text-[14px]">{f.icon}</span>{f.name}
          </button>
        ))}
      </div>

      {/* KPIs */}
      <div className="flex gap-2.5 mb-5 flex-wrap">
        {[
          { val: activeDeals.length, label: 'Negócios ativos' },
          { val: fmtValorShort(valorTotal), label: 'Valor total pipeline', prefix: 'R$' },
          { val: fmtValorShort(ticketMedio), label: 'Ticket médio', prefix: 'R$' },
          { val: `${taxa}%`, label: 'Taxa conversão', color: 'hsl(var(--olive))' },
        ].map((kpi, i) => (
          <div key={i} className="bg-surface border border-border rounded-lg py-3 px-[18px] flex-1 min-w-[100px]">
            <div className="text-lg font-extrabold -tracking-wider" style={kpi.color ? { color: kpi.color } : {}}>
              {kpi.prefix && <span className="text-[10px] font-normal text-primary">{kpi.prefix}</span>}
              {kpi.val}
            </div>
            <div className="text-[9px] text-t-3 uppercase tracking-wide mt-0.5">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Kanban / List */}
      {viewMode === 'kanban' ? (
        <div className="flex gap-3.5 overflow-x-auto pb-4 items-start min-h-[calc(100vh-280px)]">
          {funnel.stages.map(stage => {
            const stDeals = deals.filter(d => d.stage === stage.id);
            const stVal = stDeals.reduce((s, d) => s + d.valor, 0);
            const isOver = dragOverStage === stage.id;
            return (
              <div
                key={stage.id}
                className={`min-w-[280px] max-w-[320px] flex-1 bg-surface-2 rounded-xl flex flex-col transition-all ${isOver ? 'ring-2 ring-primary/40 bg-gold-dim' : ''}`}
                onDragOver={e => handleDragOver(e, stage.id)}
                onDragLeave={handleDragLeave}
                onDrop={e => handleDrop(e, stage.id)}
              >
                <div className="p-3 flex items-center gap-2 rounded-t-xl">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: stage.cor }} />
                  <span className="text-[13px] font-bold">{stage.name}</span>
                  <span className="text-[10px] font-semibold text-t-3 bg-surface-3 px-2 py-0.5 rounded-full ml-auto">
                    {stDeals.length}{stVal > 0 ? ` · R$${fmtValorShort(stVal)}` : ''}
                  </span>
                </div>
                <div className="px-2.5 flex-1 flex flex-col gap-2.5 min-h-[40px] pb-2.5">
                  {stDeals.map(d => (
                    <DealCard key={d.id} deal={d} onClick={() => setSelectedDeal(d.id)} onDragStart={handleDragStart} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-xl overflow-hidden">
          <div className="grid grid-cols-[1fr_100px_100px_80px_110px] px-[18px] h-9 items-center bg-surface-2 border-b border-border text-[9px] font-semibold text-t-3 uppercase tracking-wider">
            <div>Nome</div><div>Valor</div><div>Etapa</div><div>Temp.</div><div>Responsável</div>
          </div>
          {deals.map(d => {
            const stage = funnel.stages.find(s => s.id === d.stage);
            return (
              <div key={d.id} onClick={() => setSelectedDeal(d.id)} className="grid grid-cols-[1fr_100px_100px_80px_110px] px-[18px] h-[46px] items-center border-b border-border last:border-b-0 cursor-pointer hover:bg-[rgba(200,169,110,0.04)] text-xs transition-colors">
                <div className="font-semibold truncate">{d.name}</div>
                <div className="font-bold text-primary">R$ {fmtValorShort(d.valor)}</div>
                <div><span className="text-[10px] font-semibold px-3 py-1 rounded-full" style={{ background: stage?.cor + '20', color: stage?.cor }}>{stage?.name}</span></div>
                <div><span className={`text-[9px] font-semibold px-2 py-0.5 rounded ${tempClass(d.temp)}`}>{d.temp === 'quente' ? 'Quente' : d.temp === 'morno' ? 'Morno' : 'Frio'}</span></div>
                <div className="flex items-center gap-1.5">
                  <span className="w-6 h-6 bg-surface-3 rounded-full flex items-center justify-center text-[9px] font-semibold text-t-2">{d.resp.i}</span>
                  <span className="text-[11px] text-t-2">{d.resp.n}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Deal Detail Modal */}
      {selectedDeal !== null && deal && (
        <>
          <div className="fixed inset-0 bg-[rgba(0,0,0,0.6)] z-[200]" onClick={() => setSelectedDeal(null)} />
          <div className="fixed top-0 right-0 w-[520px] max-w-full h-screen bg-surface border-l border-border z-[201] overflow-y-auto flex flex-col animate-in slide-in-from-right">
            <div className="p-6 pb-0 flex-shrink-0">
              <span className="material-symbols-outlined absolute top-5 right-5 cursor-pointer text-t-3 hover:text-primary transition-colors" onClick={() => setSelectedDeal(null)}>close</span>
              <div className="text-xl font-bold mb-1">{deal.name}</div>
              <div className="text-xs text-t-3 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">location_on</span>{deal.loc}</div>
              <div className="text-2xl font-extrabold text-primary mt-3">
                <span className="text-xs font-normal">R$ </span>{fmtValorShort(deal.valor)}
              </div>
            </div>
            <div className="h-px bg-border mx-7 my-4" />
            <div className="flex-1 overflow-y-auto px-7">
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <div className="text-[11px] font-semibold text-t-2 mb-2">Etapa</div>
                  <div className="text-xs px-3 py-2.5 bg-surface-2 border border-border rounded-lg" style={{ color: funnel.stages.find(s => s.id === deal.stage)?.cor }}>
                    {funnel.stages.find(s => s.id === deal.stage)?.name}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-t-2 mb-2">Temperatura</div>
                  <div className="text-xs px-3 py-2.5 bg-surface-2 border border-border rounded-lg">
                    <span className={`text-[9px] font-semibold px-2 py-0.5 rounded ${tempClass(deal.temp)}`}>{deal.temp === 'quente' ? 'Quente' : deal.temp === 'morno' ? 'Morno' : 'Frio'}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <div className="text-[11px] font-semibold text-t-2 mb-2">Telefone</div>
                  <div className="text-xs text-t-2">{deal.tel}</div>
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-t-2 mb-2">Responsável</div>
                  <div className="flex items-center gap-1.5 text-xs text-t-2">
                    <span className="w-6 h-6 bg-surface-3 rounded-full flex items-center justify-center text-[10px] font-semibold">{deal.resp.i}</span>
                    {deal.resp.n}
                  </div>
                </div>
              </div>

              {deal.notes && (
                <div className="mb-4">
                  <div className="text-[11px] font-semibold text-t-2 mb-2">Observações</div>
                  <div className="text-xs text-t-2 leading-relaxed">{deal.notes}</div>
                </div>
              )}

              {deal.timeline.length > 0 && (
                <>
                  <div className="h-px bg-border my-4" />
                  <div className="text-[11px] font-semibold text-t-2 mb-3">Timeline</div>
                  <div className="flex flex-col relative pl-5">
                    <div className="absolute left-[5px] top-1 bottom-1 w-0.5 bg-border" />
                    {deal.timeline.map((t, i) => (
                      <div key={i} className="relative pl-4 pb-4 border-b border-border last:border-b-0">
                        <div className="absolute -left-[11px] top-3.5 w-2.5 h-2.5 rounded-full bg-primary border-2 border-surface z-10" />
                        <div className="text-[9px] font-semibold text-primary uppercase tracking-wider mb-0.5">{t.type}</div>
                        <div className="text-[10px] text-t-4 mb-1">{t.date}</div>
                        <div className="text-xs text-t-2 leading-snug">{t.text}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="p-4 border-t border-border flex items-center gap-3 flex-shrink-0 bg-surface">
              <span className="flex-1" />
              <button onClick={() => setSelectedDeal(null)} className="bg-transparent border-none text-xs text-t-3 cursor-pointer hover:text-foreground transition-colors px-3.5 py-2">Fechar</button>
            </div>
          </div>
        </>
      )}

      {/* New Deal Dialog */}
      <NewDealDialog open={newDealOpen} onOpenChange={setNewDealOpen} stages={funnel.stages} onSave={handleAddDeal} />
    </div>
  );
}
