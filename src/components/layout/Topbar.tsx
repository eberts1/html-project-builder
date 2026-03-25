import logoDark from '@/assets/logo/logo-dark.png';

interface TopbarProps {
  activePage: string;
  onPageChange: (page: string) => void;
}

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'space_dashboard' },
  { id: 'leiloes', label: 'Leilões', icon: 'event_note' },
  { id: 'arquivos', label: 'Arquivos', icon: 'folder' },
  { id: 'projetos', label: 'Projetos', icon: 'view_kanban' },
  { id: 'crm', label: 'CRM', icon: 'handshake' },
  { id: 'marketing', label: 'Marketing', icon: 'campaign' },
];

export default function Topbar({ activePage, onPageChange }: TopbarProps) {
  const today = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

  return (
    <div className="h-14 bg-surface border-b border-border flex items-center px-7 gap-3.5 sticky top-0 z-50">
      <span className="text-xl font-bold text-primary tracking-tight">BULA</span>

      <div className="flex h-full items-stretch gap-0.5 ml-2">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            onClick={() => onPageChange(item.id)}
            className={`bg-transparent border-none border-b-2 px-4 font-medium text-xs flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
              activePage === item.id
                ? 'text-primary border-b-primary'
                : 'text-t-3 border-b-transparent hover:text-t-2'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>

      <div className="flex-1" />

      <span className="text-[11px] text-t-3 bg-surface-2 border border-border px-3 py-1 rounded-full hidden md:block">
        {today}
      </span>

      <div className="w-9 h-9 bg-surface-2 border border-border rounded-lg flex items-center justify-center cursor-pointer text-t-2 relative">
        <span className="material-symbols-outlined text-[18px]">notifications</span>
        <div className="absolute top-[7px] right-[7px] w-1.5 h-1.5 bg-primary rounded-full" />
      </div>
    </div>
  );
}
