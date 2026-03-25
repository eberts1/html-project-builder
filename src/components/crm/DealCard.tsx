import type { CrmDeal } from '@/data/mockData';
import { fmtValorShort } from '@/lib/formatters';

interface DealCardProps {
  deal: CrmDeal;
  onClick: () => void;
  onDragStart: (e: React.DragEvent, dealId: number) => void;
}

function tempClass(t: string) {
  return t === 'quente' ? 'bg-bula-red-bg text-bula-red' : t === 'morno' ? 'bg-amber-bg text-amber' : 'bg-bula-blue-bg text-bula-blue';
}

export default function DealCard({ deal, onClick, onDragStart }: DealCardProps) {
  return (
    <div
      draggable
      onDragStart={e => onDragStart(e, deal.id)}
      onClick={onClick}
      className="bg-surface border border-border rounded-lg p-3.5 cursor-grab active:cursor-grabbing transition-all hover:border-[rgba(200,169,110,0.25)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <div className="text-[13px] font-bold leading-snug">{deal.name}</div>
          <div className="text-[10px] text-t-3 mt-0.5 flex items-center gap-0.5">
            <span className="material-symbols-outlined text-[12px]">location_on</span>{deal.loc}
          </div>
        </div>
        <div className="text-[15px] font-extrabold text-primary whitespace-nowrap">
          <span className="text-[9px] font-normal">R$ </span>{fmtValorShort(deal.valor)}
        </div>
      </div>
      <div className="flex items-center gap-2 mb-2.5">
        <span className="text-[10px] text-t-2 flex items-center gap-0.5">
          <span className="material-symbols-outlined text-[13px] text-t-4">phone</span>{deal.tel}
        </span>
        <span className={`text-[9px] font-semibold px-2 py-0.5 rounded ${tempClass(deal.temp)}`}>
          {deal.temp === 'quente' ? 'Quente' : deal.temp === 'morno' ? 'Morno' : 'Frio'}
        </span>
      </div>
      <div className="flex items-center justify-between text-[9px] text-t-4">
        <span className="flex items-center gap-0.5"><span className="material-symbols-outlined text-[12px]">schedule</span>{deal.dias} dias</span>
        <span className="w-6 h-6 bg-surface-3 rounded-full flex items-center justify-center text-[9px] font-semibold text-t-2">{deal.resp.i}</span>
      </div>
    </div>
  );
}
