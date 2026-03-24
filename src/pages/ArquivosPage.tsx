import { useState } from 'react';
import { DRIVE_DATA, SIDEBAR_FOLDERS, getFileType, FILE_ICONS } from '@/data/mockData';

export default function ArquivosPage() {
  const [currentPath, setCurrentPath] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');

  const items = DRIVE_DATA[currentPath] || [];
  const folders = items.filter(i => i.type === 'folder');
  let files = items.filter(i => i.type === 'file');
  if (search) files = files.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

  const allFiles = Object.values(DRIVE_DATA).flat().filter(i => i.type === 'file');
  const images = allFiles.filter(f => getFileType(f.name) === 'image').length;
  const videos = allFiles.filter(f => getFileType(f.name) === 'video').length;
  const docs = allFiles.filter(f => ['pdf', 'doc', 'xls'].includes(getFileType(f.name))).length;

  const parts = currentPath ? currentPath.split('/') : [];

  return (
    <div className="flex gap-0 min-h-[calc(100vh-56px)]">
      {/* Sidebar */}
      <div className="w-[220px] bg-surface border-r border-border py-5 flex-shrink-0 overflow-y-auto hidden md:block">
        <div className="text-[9px] font-semibold text-t-3 uppercase tracking-[1.2px] px-[18px] mb-2.5">Pastas</div>
        {SIDEBAR_FOLDERS.map(f => (
          <div
            key={f.path}
            onClick={() => { setCurrentPath(f.path); setSearch(''); }}
            className={`flex items-center gap-2.5 px-[18px] py-[9px] cursor-pointer transition-all text-xs border-l-2 ${
              currentPath === f.path ? 'bg-gold-dim text-primary border-l-primary font-semibold' : 'text-t-2 border-l-transparent hover:bg-[rgba(255,255,255,0.03)]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">{f.icon}</span>
            {f.name}
          </div>
        ))}
        <div className="h-px bg-border mx-[18px] my-3" />
        <div className="px-[18px]">
          <div className="text-[9px] text-t-4 uppercase tracking-wider mb-1.5">Armazenamento</div>
          <div className="h-1 bg-surface-3 rounded overflow-hidden mb-1">
            <div className="h-full bg-primary rounded" style={{ width: '34%' }} />
          </div>
          <div className="text-[10px] text-t-3">1.7 GB de 5 GB</div>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 p-7 overflow-y-auto min-w-0">
        <div className="flex items-center gap-3.5 mb-5 flex-wrap">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1 text-xs flex-1 min-w-0">
            <span className="text-t-3 cursor-pointer hover:text-primary transition-colors" onClick={() => { setCurrentPath(''); setSearch(''); }}>Arquivos</span>
            {parts.map((p, i) => {
              const path = parts.slice(0, i + 1).join('/');
              const isCurrent = i === parts.length - 1;
              return (
                <span key={i} className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-t-4 text-[14px]">chevron_right</span>
                  <span className={isCurrent ? 'font-semibold' : 'text-t-3 cursor-pointer hover:text-primary transition-colors'} onClick={() => !isCurrent && setCurrentPath(path)}>{p}</span>
                </span>
              );
            })}
          </div>

          <div className="flex items-center bg-surface-2 border border-border rounded-lg px-3 gap-1.5 focus-within:border-primary transition-colors">
            <span className="material-symbols-outlined text-[16px] text-t-3">search</span>
            <input
              type="text" placeholder="Buscar arquivos..." value={search} onChange={e => setSearch(e.target.value)}
              className="bg-transparent border-none font-sans text-xs py-[7px] w-40 outline-none text-foreground placeholder:text-t-4"
            />
          </div>

          <div className="hidden md:flex bg-surface-2 border border-border rounded-lg overflow-hidden">
            {(['grid', 'list'] as const).map(mode => (
              <button key={mode} onClick={() => setViewMode(mode)} className={`bg-transparent border-none px-2.5 py-1.5 cursor-pointer flex items-center transition-all ${viewMode === mode ? 'bg-gold-dim text-primary' : 'text-t-3 hover:text-t-2'}`}>
                <span className="material-symbols-outlined text-[16px]">{mode === 'grid' ? 'grid_view' : 'view_list'}</span>
              </button>
            ))}
          </div>
        </div>

        {/* KPIs */}
        <div className="flex gap-2.5 mb-5 flex-wrap">
          {[
            { icon: 'inventory_2', color: 'hsl(var(--gold))', val: allFiles.length, label: 'Total' },
            { icon: 'image', color: '#7CB9A8', val: images, label: 'Imagens' },
            { icon: 'videocam', color: '#C0504D', val: videos, label: 'Vídeos' },
            { icon: 'description', color: '#4A8FBF', val: docs, label: 'Documentos' },
          ].map((kpi, i) => (
            <div key={i} className="bg-surface border border-border rounded-lg py-2.5 px-4 flex items-center gap-2.5 min-w-[120px] flex-1">
              <span className="material-symbols-outlined text-[22px]" style={{ color: kpi.color }}>{kpi.icon}</span>
              <div>
                <div className="text-base font-extrabold -tracking-wider">{kpi.val}</div>
                <div className="text-[9px] text-t-3 uppercase tracking-wide">{kpi.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Folders */}
        {folders.length > 0 && !search && (
          <>
            <div className="text-[9px] font-semibold text-t-3 uppercase tracking-wider mb-2">Pastas</div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3.5 mb-4">
              {folders.map(f => (
                <div key={f.name} onClick={() => setCurrentPath(currentPath ? `${currentPath}/${f.name}` : f.name)} className="bg-surface border border-border rounded-xl p-[18px] cursor-pointer flex items-center gap-3 hover:border-[rgba(200,169,110,0.3)] hover:bg-surface-2 transition-all">
                  <span className="material-symbols-outlined text-[28px] text-primary">folder</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold">{f.name}</div>
                    <div className="text-[10px] text-t-3 mt-0.5">{f.items} arquivos</div>
                  </div>
                  <span className="material-symbols-outlined text-[16px] text-t-4">chevron_right</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Files */}
        {files.length > 0 && (
          <>
            {folders.length > 0 && !search && <div className="text-[9px] font-semibold text-t-3 uppercase tracking-wider mb-2">Arquivos</div>}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3.5">
                {files.map(f => {
                  const ft = getFileType(f.name);
                  const fi = FILE_ICONS[ft] || FILE_ICONS.other;
                  return (
                    <div key={f.name} className="bg-surface border border-border rounded-xl overflow-hidden cursor-pointer hover:border-[rgba(200,169,110,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,0,0,0.12)] transition-all">
                      <div className="w-full h-[120px] flex items-center justify-center bg-surface-2 relative overflow-hidden">
                        {ft === 'video' ? (
                          <div className="absolute inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.3)]">
                            <span className="material-symbols-outlined text-[40px] text-foreground">play_circle</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-1">
                            <span className="material-symbols-outlined text-[36px]" style={{ color: fi.color }}>{fi.icon}</span>
                            <span className="text-[9px] font-medium uppercase tracking-wider" style={{ color: fi.color }}>{f.name.split('.').pop()}</span>
                          </div>
                        )}
                      </div>
                      <div className="py-2.5 px-3.5">
                        <div className="text-[11px] font-semibold truncate mb-0.5">{f.name}</div>
                        <div className="text-[10px] text-t-3 flex justify-between">
                          <span>{f.size}</span>
                          <span>{f.date}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-surface border border-border rounded-xl overflow-hidden">
                <div className="grid grid-cols-[1fr_80px_80px_100px] px-[18px] h-[34px] items-center bg-surface-2 border-b border-border text-[9px] font-semibold text-t-3 uppercase tracking-wider">
                  <div>Nome</div><div>Tipo</div><div>Tamanho</div><div>Data</div>
                </div>
                {files.map(f => {
                  const ft = getFileType(f.name);
                  const fi = FILE_ICONS[ft] || FILE_ICONS.other;
                  return (
                    <div key={f.name} className="grid grid-cols-[1fr_80px_80px_100px] px-[18px] h-[42px] items-center border-b border-border last:border-b-0 cursor-pointer hover:bg-[rgba(200,169,110,0.04)] text-xs transition-colors">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="material-symbols-outlined text-[18px]" style={{ color: fi.color }}>{fi.icon}</span>
                        <span className="truncate">{f.name}</span>
                      </div>
                      <div className="text-t-3">{f.name.split('.').pop()?.toUpperCase()}</div>
                      <div className="text-t-3">{f.size}</div>
                      <div className="text-t-3">{f.date}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {!folders.length && !files.length && (
          <div className="text-center py-[60px] text-t-3">
            <span className="material-symbols-outlined text-[48px] block mb-3 text-t-4">folder_off</span>
            <div className="text-[13px]">{search ? 'Nenhum arquivo encontrado' : 'Esta pasta está vazia'}</div>
          </div>
        )}
      </div>
    </div>
  );
}
