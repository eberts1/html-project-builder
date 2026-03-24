import { useState } from 'react';
import { LEADS, calcLeadScore, scoreColor, STATUS_LBL, ORIGEM_ICON, type Lead } from '@/data/mockData';

const MKT_INVEST = 18600;

export default function MarketingPage() {
  const [leads, setLeads] = useState<Lead[]>(() => JSON.parse(JSON.stringify(LEADS)));
  const [filterStatus, setFilterStatus] = useState('todos');
  const [qualModalId, setQualModalId] = useState<number | null>(null);

  const total = leads.length;
  const quals = leads.filter(l => l.status === 'qualificado').length;
  const cpl = total ? Math.round(MKT_INVEST / total) : 0;
  const cpmql = quals ? Math.round(MKT_INVEST / quals) : 0;

  const filtered = filterStatus === 'todos' ? [...leads] : leads.filter(l => l.status === filterStatus);
  const sorted = filtered.sort((a, b) => calcLeadScore(b) - calcLeadScore(a));

  // Region distribution
  const regioes: Record<string, number> = {};
  leads.forEach(l => { regioes[l.regiao] = (regioes[l.regiao] || 0) + 1; });
  const regSorted = Object.entries(regioes).sort((a, b) => b[1] - a[1]);
  const regMax = regSorted[0]?.[1] || 1;

  // Herd distribution
  const faixas = [{ lbl: 'Até 50', min: 0, max: 50, cnt: 0 }, { lbl: '51-200', min: 51, max: 200, cnt: 0 }, { lbl: '201-500', min: 201, max: 500, cnt: 0 }, { lbl: '500+', min: 501, max: 99999, cnt: 0 }];
  let totalReb = 0;
  leads.forEach(l => { totalReb += l.rebanho; faixas.forEach(f => { if (l.rebanho >= f.min && l.rebanho <= f.max) f.cnt++; }); });
  const mediaReb = Math.round(totalReb / leads.length);
  const fxMax = Math.max(...faixas.map(f => f.cnt));

  // Origin
  const origens: Record<string, number> = {};
  leads.forEach(l => { origens[l.origem] = (origens[l.origem] || 0) + 1; });
  const oriSorted = Object.entries(origens).sort((a, b) => b[1] - a[1]);
  const oriMax = oriSorted[0]?.[1] || 1;
  const oriColors: Record<string, string> = { Instagram: '#E1306C', Facebook: '#4267B2', 'Google Ads': '#34A853', WhatsApp: '#25D366', Site: 'hsl(var(--gold))' };

  const statuses = ['todos', 'novo', 'atendimento', 'qualificado', 'descartado'];
  const statusCls: Record<string, string> = { novo: 'bg-bula-blue-bg text-bula-blue', atendimento: 'bg-bula-amber-bg text-bula-amber', qualificado: 'bg-olive-bg text-olive', descartado: 'bg-surface-3 text-t-3' };

  const qualLead = qualModalId !== null ? leads.find(l => l.id === qualModalId) : null;

  return (
    <div className="max-w-[1200px] mx-auto px-7 pt-7 pb-10">
      <div className="flex items-center mb-5">
        <div>
          <div className="text-xl font-bold">Marketing</div>
          <div className="text-xs text-t-3 mt-1">Gestão de leads, scoring e qualificação</div>
        </div>
      </div>

      {/* KPIs */}
      <div className="flex gap-2.5 mb-5 flex-wrap">
        {[
          { val: total, label: 'Leads gerados' },
          { val: `${(MKT_INVEST / 1000).toFixed(1)}K`, label: 'Investimento', prefix: 'R$' },
          { val: cpl, label: 'CPL', prefix: 'R$' },
          { val: cpmql > 0 ? (cpmql >= 1000 ? `${(cpmql / 1000).toFixed(1)}K` : cpmql) : '--', label: 'CPMQL', prefix: 'R$' },
        ].map((kpi, i) => (
          <div key={i} className="bg-surface border border-border rounded-lg py-3 px-[18px] flex-1 min-w-[100px]">
            <div className="text-lg font-extrabold -tracking-wider">
              {kpi.prefix && <span className="text-[10px] font-normal text-primary">{kpi.prefix}</span>}
              {kpi.val}
            </div>
            <div className="text-[9px] text-t-3 uppercase tracking-wide mt-0.5">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mb-6">
        <Card title="Distribuição por Região">
          {regSorted.map(([r, c]) => (
            <div key={r} className="flex items-center gap-2 mb-[7px] last:mb-0">
              <span className="text-[10px] text-t-2 min-w-[28px] font-medium">{r}</span>
              <div className="flex-1 h-1.5 bg-surface-3 rounded overflow-hidden">
                <div className="h-full rounded bg-primary" style={{ width: `${Math.round(c / regMax * 100)}%` }} />
              </div>
              <span className="text-[10px] font-semibold text-t-3 min-w-[20px] text-right">{c}</span>
            </div>
          ))}
        </Card>

        <Card title="Rebanho">
          <div className="text-center mb-3.5">
            <div className="text-[28px] font-extrabold text-primary">{mediaReb.toLocaleString('pt-BR')}</div>
            <div className="text-[10px] text-t-3 uppercase tracking-wider">Média de cabeças</div>
          </div>
          {faixas.map(f => (
            <div key={f.lbl} className="flex items-center gap-2 mb-[7px] last:mb-0">
              <span className="text-[10px] text-t-2 min-w-[50px] font-medium">{f.lbl}</span>
              <div className="flex-1 h-1.5 bg-surface-3 rounded overflow-hidden">
                <div className="h-full rounded bg-bula-blue" style={{ width: `${Math.round(f.cnt / fxMax * 100)}%` }} />
              </div>
              <span className="text-[10px] font-semibold text-t-3 min-w-[20px] text-right">{f.cnt}</span>
            </div>
          ))}
        </Card>

        <Card title="Origem dos Leads">
          {oriSorted.map(([o, c]) => {
            const pct = Math.round(c / leads.length * 100);
            return (
              <div key={o} className="flex items-center gap-2 mb-[7px] last:mb-0">
                <span className="text-[10px] text-t-2 min-w-[80px] font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]" style={{ color: oriColors[o] || 'hsl(var(--text-3))' }}>{ORIGEM_ICON[o] || 'help'}</span>
                  {o}
                </span>
                <div className="flex-1 h-1.5 bg-surface-3 rounded overflow-hidden">
                  <div className="h-full rounded" style={{ width: `${Math.round(c / oriMax * 100)}%`, background: oriColors[o] || 'hsl(var(--gold))' }} />
                </div>
                <span className="text-[10px] font-semibold text-t-3 min-w-[48px] text-right">{c} ({pct}%)</span>
              </div>
            );
          })}
        </Card>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1.5 mb-4 overflow-x-auto">
        {statuses.map(s => {
          const count = s === 'todos' ? leads.length : leads.filter(l => l.status === s).length;
          return (
            <button key={s} onClick={() => setFilterStatus(s)} className={`bg-surface-2 border rounded-full px-4 py-1.5 text-[11px] font-medium cursor-pointer whitespace-nowrap transition-all ${filterStatus === s ? 'bg-gold-dim text-primary border-[rgba(200,169,110,0.3)] font-semibold' : 'text-t-3 border-border hover:text-t-2'}`}>
              {s === 'todos' ? `Todos (${count})` : `${STATUS_LBL[s]} (${count})`}
            </button>
          );
        })}
      </div>

      {/* Leads table */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="grid grid-cols-[1fr_100px_50px_70px_90px_80px_80px_70px] px-[18px] h-9 items-center bg-surface-2 border-b border-border text-[9px] font-semibold text-t-3 uppercase tracking-wider">
          <div>Nome</div><div>Telefone</div><div>Região</div><div>Rebanho</div><div>Origem</div><div>Score</div><div>Status</div><div>Ação</div>
        </div>
        {sorted.map(l => {
          const score = calcLeadScore(l);
          const sColor = scoreColor(score);
          return (
            <div key={l.id} className="grid grid-cols-[1fr_100px_50px_70px_90px_80px_80px_70px] px-[18px] h-[46px] items-center border-b border-border last:border-b-0 text-xs hover:bg-[rgba(200,169,110,0.04)] transition-colors">
              <div className="font-semibold truncate">{l.name}</div>
              <div className="text-t-2 text-[11px]">{l.tel}</div>
              <div className="text-t-2">{l.regiao}</div>
              <div className="text-t-2">{l.rebanho.toLocaleString('pt-BR')}</div>
              <div className="flex items-center gap-1 text-t-2">
                <span className="material-symbols-outlined text-[13px]">{ORIGEM_ICON[l.origem] || 'help'}</span>
                <span className="text-[11px]">{l.origem}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-[50px] h-1.5 bg-surface-3 rounded overflow-hidden">
                  <div className="h-full rounded" style={{ width: `${score}%`, background: sColor }} />
                </div>
                <span className="text-[10px] font-bold min-w-[22px]" style={{ color: sColor }}>{score}</span>
              </div>
              <div>
                <span className={`text-[10px] font-semibold px-3 py-1 rounded-full ${statusCls[l.status] || 'bg-bula-blue-bg text-bula-blue'}`}>{STATUS_LBL[l.status]}</span>
              </div>
              <div>
                {(l.status === 'novo' || l.status === 'atendimento') ? (
                  <button onClick={() => setQualModalId(l.id)} className="bg-primary text-primary-foreground border-none px-3 py-1 rounded text-[10px] font-semibold cursor-pointer hover:bg-gold-dark transition-colors">Qualificar</button>
                ) : (
                  <span className="text-t-4">—</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Qualification Modal */}
      {qualModalId !== null && qualLead && (
        <>
          <div className="fixed inset-0 bg-[rgba(0,0,0,0.6)] z-[200]" onClick={() => setQualModalId(null)} />
          <div className="fixed top-0 right-0 w-[520px] max-w-full h-screen bg-surface border-l border-border z-[201] overflow-y-auto flex flex-col animate-in slide-in-from-right">
            <div className="p-6 pb-0">
              <span className="material-symbols-outlined absolute top-5 right-5 cursor-pointer text-t-3 hover:text-primary transition-colors" onClick={() => setQualModalId(null)}>close</span>
              <div className="text-xl font-bold">Qualificar Lead</div>
            </div>
            <div className="h-px bg-border mx-7 my-4" />
            <div className="flex-1 overflow-y-auto px-7">
              <div className="mb-4">
                <label className="text-[11px] font-semibold text-t-2 mb-2 block">Nome</label>
                <input className="w-full bg-surface-2 border border-border rounded-lg px-3.5 py-2.5 text-[13px] text-foreground outline-none focus:border-primary transition-colors font-sans" defaultValue={qualLead.name} />
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="text-[11px] font-semibold text-t-2 mb-2 block">Telefone</label>
                  <input className="w-full bg-surface-2 border border-border rounded-lg px-3.5 py-2.5 text-xs text-foreground outline-none focus:border-primary transition-colors font-sans" defaultValue={qualLead.tel} />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-t-2 mb-2 block">Região</label>
                  <input className="w-full bg-surface-2 border border-border rounded-lg px-3.5 py-2.5 text-xs text-foreground outline-none focus:border-primary transition-colors font-sans" defaultValue={qualLead.regiao} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="text-[11px] font-semibold text-t-2 mb-2 block">Rebanho (cabeças)</label>
                  <input type="number" className="w-full bg-surface-2 border border-border rounded-lg px-3.5 py-2.5 text-xs text-foreground outline-none focus:border-primary transition-colors font-sans" defaultValue={qualLead.rebanho} />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-t-2 mb-2 block">Interesse</label>
                  <select className="w-full bg-surface-2 border border-border rounded-lg px-3.5 py-2.5 text-xs text-foreground outline-none focus:border-primary transition-colors font-sans appearance-none cursor-pointer">
                    <option value="">Selecione...</option>
                    <option value="Touros PO">Touros PO</option>
                    <option value="Fêmeas PO">Fêmeas PO</option>
                    <option value="Sêmen">Sêmen</option>
                    <option value="Misto">Misto</option>
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <label className="text-[11px] font-semibold text-t-2 mb-2 block">Orçamento Estimado (R$)</label>
                <input type="number" placeholder="Ex: 300000" className="w-full bg-surface-2 border border-border rounded-lg px-3.5 py-2.5 text-xs text-foreground outline-none focus:border-primary transition-colors font-sans placeholder:text-t-4" />
              </div>
            </div>
            <div className="p-4 border-t border-border flex items-center gap-3 flex-shrink-0 bg-surface">
              <span className="flex-1" />
              <button onClick={() => setQualModalId(null)} className="bg-transparent border-none text-xs text-t-3 cursor-pointer hover:text-foreground transition-colors px-3.5 py-2">Cancelar</button>
              <button
                onClick={() => {
                  setLeads(leads.map(l => l.id === qualModalId ? { ...l, status: 'qualificado' } : l));
                  setQualModalId(null);
                }}
                className="bg-primary text-primary-foreground border-none py-2 px-5 rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1.5 hover:bg-gold-dark transition-colors"
              >
                <span className="material-symbols-outlined text-[15px]">verified</span> Qualificar e Enviar ao CRM
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden">
      <div className="px-[18px] py-[13px] border-b border-border">
        <span className="text-[10px] font-semibold text-t-3 uppercase tracking-wider">{title}</span>
      </div>
      <div className="p-[18px] pt-4">{children}</div>
    </div>
  );
}
