import { fmtValorShort, progColor, calcTaskProg } from '@/lib/formatters';
import { LEILOES, buildTasks } from '@/data/mockData';

const TASKS = buildTasks();

export default function Dashboard({ onNavigate }: { onNavigate: (page: string) => void }) {
  const revenueData = [
    { month: 'Jan', value: 320000, pct: 28 },
    { month: 'Fev', value: 480000, pct: 42 },
    { month: 'Mar', value: 610000, pct: 54 },
    { month: 'Abr', value: 520000, pct: 46 },
    { month: 'Mai', value: 890000, pct: 78 },
    { month: 'Jun', value: 1100000, pct: 97 },
    { month: 'Jul', value: 0, pct: 70, projected: true },
    { month: 'Ago', value: 0, pct: 5, projected: true },
    { month: 'Set', value: 0, pct: 5, projected: true },
    { month: 'Out', value: 0, pct: 5, projected: true },
    { month: 'Nov', value: 0, pct: 5, projected: true },
    { month: 'Dez', value: 0, pct: 5, projected: true },
  ];

  const upcomingLeiloes = [...LEILOES].filter(l => !l.concluido).sort((a, b) => a.data.localeCompare(b.data)).slice(0, 4);

  const leadsPerMonth = [
    { month: 'Jan', value: 85, pct: 25 },
    { month: 'Fev', value: 120, pct: 35 },
    { month: 'Mar', value: 180, pct: 53 },
    { month: 'Abr', value: 210, pct: 62 },
    { month: 'Mai', value: 305, pct: 90 },
    { month: 'Jun', value: 340, pct: 100 },
  ];

  return (
    <div>
      {/* Banner */}
      <div className="rounded-xl mx-auto max-w-[1200px] mt-6 mb-8 p-9 bg-surface border border-border relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-[200px] h-[200px] bg-[radial-gradient(circle,hsl(var(--gold-dim))_0%,transparent_70%)] pointer-events-none" />
        <div className="text-xs text-t-3 mb-2">Bula Assessoria Pecuária</div>
        <div className="text-xl font-bold leading-snug">
          Bem-vindo(a) ao painel da <span className="text-primary">maior assessoria</span> do Brasil.
        </div>
        <div className="text-xs text-t-3 mt-1.5">Painel de Gestão — 2026</div>
      </div>

      <div className="max-w-[1200px] mx-auto px-7 pb-10">
        {/* KPIs */}
        <SectionLabel>Dados Gerais</SectionLabel>
        <KpiRow items={[
          { value: '4.72M', prefix: 'R$', label: 'Valor vendido' },
          { value: '142.8K', prefix: 'R$', label: 'Comissão recebida', tag: '+18%' },
          { value: '1.847', label: 'Animais vendidos' },
          { value: '2.555', prefix: 'R$', label: 'Ticket médio' },
          { value: '26', label: 'Leilões realizados' },
        ]} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-7">
          {/* Revenue Chart */}
          <Card title="Receita Mensal">
            <div className="flex items-end gap-1 h-[110px]">
              {revenueData.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                  <span className="text-[8px] font-semibold text-t-3">{d.value ? fmtValorShort(d.value) : ''}</span>
                  <div
                    className={`w-full rounded-t min-h-[2px] ${d.projected ? 'bg-surface-4' : 'bg-primary'}`}
                    style={{ height: `${d.pct}%` }}
                  />
                  <span className="text-[9px] text-t-4 pt-0.5 border-t border-border w-full text-center">{d.month}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Upcoming Events */}
          <Card title="Próximos Leilões" action={{ label: 'Ver tudo', onClick: () => onNavigate('leiloes') }}>
            <div className="-mx-[18px] -mb-4">
              {upcomingLeiloes.map(l => {
                const [, m, d] = l.data.split('-');
                const months = ['', 'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
                return (
                  <div key={l.id} className="flex items-center gap-3.5 px-[18px] py-2.5 border-b border-border last:border-b-0 cursor-pointer hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                    <div className="w-[34px] text-center flex-shrink-0">
                      <div className="text-lg font-extrabold text-primary leading-none">{d}</div>
                      <div className="text-[9px] uppercase text-t-3 tracking-widest">{months[parseInt(m)]}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium truncate">{l.nome}</div>
                      <div className="text-[10px] text-t-3 mt-0.5">{l.tipo} — {l.local}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold">{l.animais}</div>
                      <div className="text-[9px] text-t-3">cab.</div>
                    </div>
                    <span className="text-[9px] font-medium px-2 py-0.5 rounded bg-gold-dim text-primary">Conf.</span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Team */}
        <SectionLabel>Equipe de Assessoria</SectionLabel>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mb-7">
          <Card title="Ranking">
            <div className="-mx-[18px] -mb-4">
              {[
                { pos: 1, name: 'Bulinha', ini: 'B', value: 'R$ 2.1M', highlight: true },
                { pos: 2, name: 'Peralta', ini: 'P', value: 'R$ 1.6M' },
                { pos: 3, name: 'Leo', ini: 'L', value: 'R$ 1.0M' },
              ].map(t => (
                <div key={t.pos} className={`flex items-center gap-2.5 px-[18px] py-[11px] border-b border-border last:border-b-0 ${t.highlight ? 'bg-gold-dim' : ''}`}>
                  <div className={`w-[22px] h-[22px] rounded-full flex items-center justify-center text-[10px] font-bold ${t.pos === 1 ? 'bg-gold-dim text-primary' : t.pos === 2 ? 'bg-[rgba(180,180,180,0.1)] text-[#aaa]' : 'bg-[rgba(180,120,60,0.1)] text-[#B48040]'}`}>{t.pos}</div>
                  <div className="w-7 h-7 bg-surface-3 rounded-full flex items-center justify-center text-[11px] font-semibold text-t-2">{t.ini}</div>
                  <div className="text-xs font-semibold flex-1">{t.name}</div>
                  <div className={`text-base font-extrabold ${t.highlight ? 'text-primary' : 'text-t-2'}`}>{t.value}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Animais Vendidos">
            <HBar items={[
              { label: 'Bulinha', value: 892, pct: 100, color: 'hsl(var(--gold))' },
              { label: 'Peralta', value: 623, pct: 70, color: 'hsl(var(--gold))', opacity: 0.7 },
              { label: 'Leo', value: 332, pct: 37, color: 'hsl(var(--gold))', opacity: 0.5 },
            ]} />
          </Card>

          <Card title="Comissão Recebida">
            <HBar items={[
              { label: 'Bulinha', value: 'R$ 63.6K', pct: 100, color: 'hsl(var(--olive))', valueColor: 'hsl(var(--olive))' },
              { label: 'Peralta', value: 'R$ 47.4K', pct: 74, color: 'hsl(var(--olive))', opacity: 0.7, valueColor: 'hsl(var(--olive))' },
              { label: 'Leo', value: 'R$ 31.8K', pct: 50, color: 'hsl(var(--olive))', opacity: 0.5, valueColor: 'hsl(var(--olive))' },
            ]} />
          </Card>
        </div>

        {/* Marketing */}
        <SectionLabel>Marketing</SectionLabel>
        <KpiRow items={[
          { value: '1.240', label: 'Leads gerados', tag: '+22%' },
          { value: '186', label: 'Qualificados', tag: '15% conv.', tagMuted: true },
          { value: '18.6K', prefix: 'R$', label: 'Investimento' },
          { value: '15', prefix: 'R$', label: 'CPL' },
          { value: '100', prefix: 'R$', label: 'CPMQL' },
        ]} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-7">
          <Card title="Funil de Conversão">
            <div className="flex flex-col gap-0.5">
              {[
                { label: 'Leads', value: '1.240', pct: 100, pctLabel: '100%', color: 'hsl(var(--gold))' },
                { label: 'Qualificados', value: '186', pct: 65, pctLabel: '15%', color: 'hsl(var(--bula-blue))' },
                { label: 'Propostas', value: '52', pct: 35, pctLabel: '4.2%', color: 'hsl(var(--amber))' },
                { label: 'Fechados', value: '26', pct: 18, pctLabel: '2.1%', color: 'hsl(var(--olive))' },
              ].map((step, i, arr) => (
                <div key={step.label}>
                  <div className="flex items-center gap-2.5">
                    <span className="text-[10px] text-t-2 min-w-[70px]">{step.label}</span>
                    <div className="flex-1 flex justify-center">
                      <div
                        className="h-7 rounded flex items-center justify-center text-[11px] font-bold text-foreground"
                        style={{ width: `${step.pct}%`, background: step.color }}
                      >{step.value}</div>
                    </div>
                    <span className="text-[9px] text-t-3 min-w-[32px] text-right">{step.pctLabel}</span>
                  </div>
                  {i < arr.length - 1 && (
                    <div className="text-center text-t-4 text-xs py-0 px-[18px]">
                      <span className="material-symbols-outlined text-xs">arrow_downward</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>

          <Card title="Leads por Mês">
            <div className="flex items-end gap-1 h-[100px]">
              {leadsPerMonth.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                  <span className="text-[8px] font-semibold text-t-3">{d.value}</span>
                  <div className="w-full rounded-t min-h-[2px] bg-bula-blue" style={{ height: `${d.pct}%` }} />
                  <span className="text-[9px] text-t-4 pt-0.5 border-t border-border w-full text-center">{d.month}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Market */}
        <SectionLabel>Dados de Mercado</SectionLabel>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <Card title="Market Share">
            <div className="flex items-center gap-5 flex-wrap justify-center">
              <div
                className="w-[120px] h-[120px] rounded-full relative flex items-center justify-center flex-shrink-0"
                style={{ background: 'conic-gradient(hsl(var(--gold)) 0deg 126deg, hsl(var(--surface-4)) 126deg 216deg, hsl(var(--surface-5)) 216deg 277deg, hsl(var(--input)) 277deg 324deg, hsl(var(--surface-3)) 324deg 360deg)' }}
              >
                <div className="w-[76px] h-[76px] bg-surface rounded-full flex flex-col items-center justify-center z-10">
                  <div className="text-[22px] font-extrabold text-primary -tracking-wider">35%</div>
                  <div className="text-[9px] text-t-3">Bula</div>
                </div>
              </div>
              <div className="flex flex-col gap-[7px]">
                {[
                  { label: 'Bula Assessoria', pct: '35%', color: 'hsl(var(--gold))' },
                  { label: 'Agro Partners', pct: '25%', color: 'hsl(var(--surface-4))' },
                  { label: 'Nelore Select', pct: '17%', color: 'hsl(var(--surface-5))' },
                  { label: 'Pecuária Prime', pct: '13%', color: 'hsl(var(--input))' },
                  { label: 'Outros', pct: '10%', color: 'hsl(var(--surface-3))' },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-2 text-[11px] text-t-2">
                    <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: item.color }} />
                    {item.label}
                    <span className="ml-auto text-[10px] text-t-3 min-w-[28px] text-right">{item.pct}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card title="Assessorias Concorrentes">
            <div className="-mx-[18px] -mb-4">
              {[
                { pos: 1, name: 'Bula Assessoria', sales: 'R$ 4.72M', share: '35%', team: '3', me: true },
                { pos: 2, name: 'Agro Partners', sales: 'R$ 3.38M', share: '25%', team: '5' },
                { pos: 3, name: 'Nelore Select', sales: 'R$ 2.30M', share: '17%', team: '4' },
                { pos: 4, name: 'Pecuária Prime', sales: 'R$ 1.76M', share: '13%', team: '3' },
              ].map(c => (
                <div key={c.pos} className={`flex items-center gap-2.5 px-[18px] py-2.5 border-b border-border last:border-b-0 text-xs ${c.me ? 'bg-gold-dim' : ''}`}>
                  <span className="text-[10px] font-bold text-t-3 w-4 text-center">{c.pos}</span>
                  <span className="font-semibold flex-1">{c.name}</span>
                  <div className="flex gap-3.5">
                    {[{ l: 'Vendas', v: c.sales }, { l: 'Share', v: c.share }, { l: 'Equipe', v: c.team }].map(s => (
                      <div key={s.l} className="text-right min-w-[50px]">
                        <div className="text-[8px] text-t-4 uppercase">{s.l}</div>
                        <div className={`text-[11px] font-semibold ${c.me ? 'text-primary' : 'text-t-2'}`}>{s.v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Shared sub-components
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] font-semibold text-t-3 uppercase tracking-[1.5px] mb-3.5 flex items-center gap-2">
      {children}
      <span className="flex-1 h-px bg-border" />
    </div>
  );
}

function KpiRow({ items }: { items: { value: string; prefix?: string; label: string; tag?: string; tagMuted?: boolean }[] }) {
  return (
    <div className="flex bg-surface border border-[rgba(200,169,110,0.25)] rounded-xl overflow-hidden mb-5 relative flex-wrap">
      <div className="absolute inset-[-1px] rounded-xl bg-[linear-gradient(135deg,rgba(200,169,110,0.15),transparent_50%,rgba(200,169,110,0.08))] pointer-events-none z-0" />
      {items.map((item, i) => (
        <div key={i} className="flex-1 min-w-[100px] py-5 px-4 text-center relative z-[1]">
          <div className="text-[22px] font-extrabold -tracking-wider leading-none mb-1.5">
            {item.prefix && <span className="text-[11px] font-normal text-primary">{item.prefix}</span>}
            {item.value}
          </div>
          <div className="text-[9px] text-t-3 tracking-wide">{item.label}</div>
          {item.tag && <div className={`text-[9px] font-medium mt-1 ${item.tagMuted ? 'text-t-3' : 'text-olive'}`}>{item.tag}</div>}
        </div>
      ))}
    </div>
  );
}

function Card({ title, children, action }: { title: string; children: React.ReactNode; action?: { label: string; onClick: () => void } }) {
  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden">
      <div className="px-[18px] py-[13px] border-b border-border flex items-center justify-between">
        <span className="text-[10px] font-semibold text-t-3 uppercase tracking-wider">{title}</span>
        {action && (
          <button onClick={action.onClick} className="text-[11px] text-t-3 flex items-center gap-1 cursor-pointer hover:text-primary transition-colors bg-transparent border-none">
            {action.label} <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        )}
      </div>
      <div className="p-[18px] pt-4">{children}</div>
    </div>
  );
}

function HBar({ items }: { items: { label: string; value: string | number; pct: number; color: string; opacity?: number; valueColor?: string }[] }) {
  return (
    <div className="flex flex-col gap-[7px]">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="text-[10px] text-t-2 min-w-[70px] font-medium">{item.label}</span>
          <div className="flex-1 h-1.5 bg-surface-3 rounded overflow-hidden">
            <div className="h-full rounded" style={{ width: `${item.pct}%`, background: item.color, opacity: item.opacity || 1 }} />
          </div>
          <span className="text-[10px] font-semibold text-t-3 min-w-[70px] text-right" style={{ color: item.valueColor }}>{item.value}</span>
        </div>
      ))}
    </div>
  );
}
