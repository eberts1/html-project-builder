export function fmtDate(s: string) {
  const [y, m, d] = s.split('-');
  return `${d}/${m}/${y}`;
}

export function fmtDateShort(s: string) {
  const [, m, d] = s.split('-');
  return `${d}/${m}`;
}

export function fmtDateLong(s: string) {
  const dt = new Date(s + 'T12:00:00');
  return dt.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).replace('.', '');
}

export function fmtMoney(v: number) {
  if (v >= 1000000) return `R$ ${(v / 1000000).toFixed(1)}M`;
  if (v >= 1000) return `R$ ${(v / 1000).toFixed(0)}K`;
  return `R$ ${v.toLocaleString('pt-BR')}`;
}

export function fmtValorShort(v: number) {
  if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`;
  if (v >= 1000) return `${(v / 1000).toFixed(0)}K`;
  return v.toLocaleString('pt-BR');
}

export function addDays(dateStr: string, days: number) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

export function progColor(pct: number) {
  if (pct === 100) return 'hsl(var(--gold))';
  if (pct > 70) return 'hsl(var(--olive))';
  if (pct >= 30) return 'hsl(var(--amber))';
  return 'hsl(var(--bula-red))';
}

export function calcTaskProg(subs: { done: boolean }[]) {
  if (!subs.length) return 0;
  return Math.round(subs.filter(s => s.done).length / subs.length * 100);
}
