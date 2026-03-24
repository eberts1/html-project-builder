import { useState, useMemo } from 'react';
import { LEILOES, buildTasks } from '@/data/mockData';
import { fmtDate, fmtDateLong, fmtValorShort, progColor, calcTaskProg } from '@/lib/formatters';

export default function LeiloesPage() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const TASKS = useMemo(() => buildTasks(), []);

  const sorted = useMemo(() => [...LEILOES].sort((a, b) => a.data.localeCompare(b.data)), []);

  function getOverallProg(id: number) {
    const groups = TASKS[id];
    if (!groups) return 0;
    const totalSubs = groups.reduce((s, g) => s + g.tasks.reduce((s2, t) => s2 + t.subs.length, 0), 0);
    const doneSubs = groups.reduce((s, g) => s + g.tasks.reduce((s2, t) => s2 + t.subs.filter(x => x.done).length, 0), 0);
    return totalSubs ? Math.round(doneSubs / totalSubs * 100) : 0;
  }

  if (selectedId !== null) {
    const l = LEILOES.find(x => x.id === selectedId)!;
    const groups = TASKS[selectedId];
    const prog = getOverallProg(selectedId);
    const pc = progColor(prog);

    return (
      <div className="max-w-[1200px] mx-auto px-7 pt-7 pb-10">
        <button onClick={() => setSelectedId(null)} className="inline-flex items-center gap-1.5 text-xs text-t-3 cursor-pointer mb-5 hover:text-primary transition-colors bg-transparent border-none">
          <span className="material-symbols-outlined text-[16px]">arrow_back</span> Voltar para Agenda
        </button>

        <div className="flex gap-5 mb-6 flex-col md:flex-row">
          <div className="w-full md:w-[280px] h-[200px] rounded-xl overflow-hidden flex-shrink-0 bg-surface border border-border">
            <div className="w-full h-full bg-surface-2 flex items-center justify-center flex-col gap-1.5 text-t-4">
              <span className="material-symbols-outlined text-[40px]">photo_camera</span>
              <span className="text-[10px]">Foto do leilão</span>
            </div>
          </div>

          <div className="bg-surface border border-border rounded-xl p-6 flex-1 relative overflow-hidden">
            <div className="absolute -top-[30px] -right-[30px] w-[150px] h-[150px] bg-[radial-gradient(circle,hsl(var(--gold-dim))_0%,transparent_70%)] pointer-events-none" />
            <div className="mb-4">
              <div className="text-lg font-bold mb-1">{l.nome}</div>
              <div className="text-[11px] text-t-3 flex items-center gap-3 flex-wrap">
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px] text-t-4">event</span> {fmtDate(l.data)}</span>
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px] text-t-4">location_on</span> {l.local}</span>
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px] text-t-4">category</span> {l.tipo}</span>
              </div>
            </div>
            <div className="flex gap-3 flex-wrap">
              {[
                { v: l.animais, l: 'Animais' },
                { v: fmtValorShort(l.expectativa), l: 'Expectativa', prefix: 'R$' },
                { v: fmtValorShort(l.metaBula), l: 'Meta Bula', prefix: 'R$' },
                { v: l.realizadoBula > 0 ? fmtValorShort(l.realizadoBula) : '--', l: 'Realizado', prefix: 'R$' },
                { v: `${prog}%`, l: 'Progresso', color: pc },
              ].map((kpi, i) => (
                <div key={i} className="text-center min-w-[60px] px-3 py-2 bg-surface-2 rounded-lg">
                  <div className="text-base font-extrabold -tracking-wider" style={kpi.color ? { color: kpi.color } : {}}>
                    {kpi.prefix && <span className="text-[9px] font-normal text-primary">{kpi.prefix}</span>}
                    {kpi.v}
                  </div>
                  <div className="text-[8px] text-t-3 uppercase tracking-wider mt-0.5">{kpi.l}</div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1.5 mt-3.5">
              <span className="text-[9px] text-t-3 uppercase tracking-wider mr-1">Escalados</span>
              {l.assessores.map((a, i) => (
                <div key={i} className="w-[26px] h-[26px] bg-surface-3 border-2 border-surface rounded-full flex items-center justify-center text-[10px] font-semibold text-t-2 -ml-1.5 first:ml-0">{a.i}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Board */}
        {groups.map((g, gi) => {
          const gProg = g.tasks.length ? Math.round(g.tasks.reduce((s, t) => s + calcTaskProg(t.subs), 0) / g.tasks.length) : 0;
          return (
            <div key={gi} className="mb-3.5 rounded-xl overflow-hidden border border-border bg-surface">
              <div className="flex items-center px-[18px] h-10 gap-2.5" style={{ background: g.cor }}>
                <span className="text-[13px] font-bold text-foreground">{g.nome}</span>
                <div className="ml-auto flex items-center gap-2">
                  <div className="w-20 h-1.5 bg-[rgba(255,255,255,0.2)] rounded overflow-hidden">
                    <div className="h-full bg-foreground rounded" style={{ width: `${gProg}%` }} />
                  </div>
                  <span className="text-[10px] font-semibold text-[rgba(255,255,255,0.8)] min-w-[28px] text-right">{gProg}%</span>
                </div>
              </div>

              <div className="hidden md:grid grid-cols-[1fr_90px_90px_140px_120px] px-[18px] h-[30px] items-center bg-surface-2 border-b border-border text-[9px] font-semibold text-t-3 uppercase tracking-wider">
                <div>Tarefa</div>
                <div className="text-center">Início</div>
                <div className="text-center">Fim</div>
                <div>Responsável</div>
                <div>Progresso</div>
              </div>

              {g.tasks.map(task => {
                const tProg = calcTaskProg(task.subs);
                const tpc = progColor(tProg);
                return (
                  <div key={task.id} className="grid grid-cols-1 md:grid-cols-[1fr_90px_90px_140px_120px] px-[18px] min-h-[42px] items-center border-b border-border text-xs">
                    <div className="flex items-center gap-2 py-2 md:py-0">
                      <span className="font-medium">{task.nome}</span>
                    </div>
                    <div className="hidden md:block text-[11px] text-t-2 text-center">{task.ini.slice(5).replace('-', '/')}</div>
                    <div className="hidden md:block text-[11px] text-t-2 text-center">{task.fim.slice(5).replace('-', '/')}</div>
                    <div className="hidden md:flex items-center gap-2">
                      <div className="w-6 h-6 bg-surface-3 rounded-full flex items-center justify-center text-[10px] font-semibold text-t-2">{task.resp.i}</div>
                      <span className="text-[11px] text-t-2">{task.resp.n}</span>
                    </div>
                    <div className="flex items-center gap-2 pb-2 md:pb-0">
                      <div className="flex-1 h-[7px] bg-surface-3 rounded overflow-hidden">
                        <div className="h-full rounded" style={{ width: `${tProg}%`, background: tpc }} />
                      </div>
                      <span className="text-[10px] font-bold min-w-[30px] text-right" style={{ color: tpc }}>{tProg}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-7 pt-7 pb-10">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-2.5">
        <div>
          <div className="text-xl font-bold">Agenda de Leilões</div>
          <div className="text-xs text-t-3 mt-1">Leilões confirmados e seus checklists operacionais</div>
        </div>
        <button className="bg-primary text-primary-foreground border-none py-2 px-5 rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1.5 hover:bg-gold-dark transition-colors">
          <span className="material-symbols-outlined text-[16px]">add</span> Novo Leilão
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sorted.map(l => {
          const prog = getOverallProg(l.id);
          const pc = progColor(prog);
          return (
            <div key={l.id} onClick={() => setSelectedId(l.id)} className="bg-surface border border-border rounded-xl overflow-hidden cursor-pointer transition-all hover:border-[rgba(200,169,110,0.3)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)]">
              <div className="w-full h-40 bg-surface-2 flex items-center justify-center flex-col gap-1.5 text-t-4">
                <span className="material-symbols-outlined text-[36px]">photo_camera</span>
                <span className="text-[10px]">Foto do leilão</span>
              </div>
              <div className="p-4">
                <div className="text-[10px] font-semibold text-primary uppercase tracking-widest mb-1.5">{fmtDateLong(l.data)}</div>
                <div className="text-[15px] font-bold mb-0.5">{l.nome}</div>
                <div className="text-[11px] text-t-3 mb-3.5 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">location_on</span> {l.local} — {l.tipo}
                </div>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {[
                    { v: l.animais, l: 'Animais' },
                    { v: fmtValorShort(l.expectativa), l: 'Expectativa', prefix: 'R$' },
                    { v: fmtValorShort(l.metaBula), l: 'Meta Bula', prefix: 'R$' },
                  ].map((s, i) => (
                    <div key={i} className="text-center py-2 px-1 bg-surface-2 rounded-lg">
                      <div className="text-[13px] font-bold">
                        {s.prefix && <span className="text-[9px] font-normal text-primary">{s.prefix}</span>}
                        {s.v}
                      </div>
                      <div className="text-[8px] text-t-3 uppercase tracking-wide mt-0.5">{s.l}</div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {l.assessores.map((a, i) => (
                      <div key={i} className="w-[26px] h-[26px] bg-surface-3 border-2 border-surface rounded-full flex items-center justify-center text-[10px] font-semibold text-t-2 -ml-1.5 first:ml-0">{a.i}</div>
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-[60px] h-[5px] bg-surface-3 rounded overflow-hidden">
                      <div className="h-full rounded" style={{ width: `${prog}%`, background: pc }} />
                    </div>
                    <span className="text-[10px] font-bold" style={{ color: pc }}>{prog}%</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
