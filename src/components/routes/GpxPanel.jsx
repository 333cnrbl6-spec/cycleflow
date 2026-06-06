import { useState } from 'react';
import { FileUp, Download, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import SectionLabel from '@/components/ui/SectionLabel';

const INITIAL_FILES = [
  { id: 'g1', name: 'etape_du_tour_2025.gpx',   size: '184 KB', imported: '12 Jan 2026', points: 4210, status: 'ok' },
  { id: 'g2', name: 'gran_fondo_route.gpx',      size: '236 KB', imported: '03 Mar 2026', points: 5830, status: 'ok' },
  { id: 'g3', name: 'local_sportive_2026.gpx',   size: '97 KB',  imported: '28 Apr 2026', points: 2140, status: 'ok' },
];

export default function GpxPanel() {
  const [files, setFiles] = useState(INITIAL_FILES);
  const [draggingOver, setDraggingOver] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDraggingOver(false);
    const dropped = [...e.dataTransfer.files].filter(f => f.name.endsWith('.gpx'));
    if (!dropped.length) { showToast('Only .gpx files are supported', 'error'); return; }
    dropped.forEach(f => {
      const newFile = {
        id: `g-${Date.now()}-${Math.random()}`,
        name: f.name,
        size: `${Math.round(f.size / 1024)} KB`,
        imported: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        points: Math.floor(1000 + Math.random() * 5000),
        status: 'ok',
      };
      setFiles(prev => [newFile, ...prev]);
    });
    showToast(`${dropped.length} file${dropped.length > 1 ? 's' : ''} imported`);
  };

  const remove = (id) => setFiles(prev => prev.filter(f => f.id !== id));

  const handleBrowse = () => {
    // Simulate a file pick
    const simFile = {
      id: `g-${Date.now()}`,
      name: `my_route_${Math.floor(Math.random() * 100)}.gpx`,
      size: `${Math.floor(80 + Math.random() * 200)} KB`,
      imported: 'Today',
      points: Math.floor(1200 + Math.random() * 4000),
      status: 'ok',
    };
    setFiles(prev => [simFile, ...prev]);
    showToast('GPX file imported successfully');
  };

  return (
    <div className="space-y-4 page-enter">
      <SectionLabel accent="cyan" label="GPX Import / Export" />

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDraggingOver(true); }}
        onDragLeave={() => setDraggingOver(false)}
        onDrop={handleDrop}
        className={cn(
          'rounded-xl border-2 border-dashed p-10 text-center transition-all duration-200 cursor-pointer',
          draggingOver
            ? 'border-blue-500/70 bg-blue-500/8 scale-[1.01]'
            : 'border-blue-500/25 bg-blue-500/3 hover:bg-blue-500/5 hover:border-blue-500/40',
        )}
        onClick={handleBrowse}
      >
        <FileUp className={cn('w-10 h-10 mx-auto mb-3 transition-colors', draggingOver ? 'text-blue-400' : 'text-blue-400/40')} />
        <p className="text-sm font-semibold text-foreground mb-1">
          {draggingOver ? 'Drop to import' : 'Upload GPX File'}
        </p>
        <p className="text-xs text-muted-foreground mb-4">
          Drag & drop or click to select a <span className="font-mono">.gpx</span> file
        </p>
        <span className="btn-primary pointer-events-none text-sm">Browse Files</span>
      </div>

      {/* Export note */}
      <div className="px-4 py-3 rounded-lg border border-white/[0.06] bg-white/[0.02] text-xs text-muted-foreground">
        <span className="font-semibold text-foreground">Export:</span>{' '}
        Open any saved route from My Routes or the Club Library and tap the <span className="font-semibold text-foreground">Export GPX</span> button. Your route data will be packaged as a standard GPX 1.1 file.
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 px-1">
            Imported Files ({files.length})
          </p>
          {files.map(f => (
            <div key={f.id}
              className="glass-card rounded-xl border border-white/[0.06] p-4 flex items-center gap-3 hover:border-blue-500/20 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                <FileUp className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground font-mono truncate">{f.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {f.size} · {f.points.toLocaleString()} pts · Imported {f.imported}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {f.status === 'ok'
                  ? <CheckCircle2 className="w-4 h-4 text-green-400" />
                  : <AlertCircle  className="w-4 h-4 text-red-400" />
                }
                <button className="text-xs text-blue-400 hover:text-blue-300 px-2 py-1 border border-blue-500/20 rounded-lg hover:bg-blue-500/10 transition-colors">
                  Load
                </button>
                <button className="p-2 text-muted-foreground hover:text-blue-400 transition-colors">
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => remove(f.id)}
                  className="p-2 text-muted-foreground hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={cn(
          'fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl shadow-2xl text-sm font-medium text-white flex items-center gap-2 transition-all',
          toast.type === 'error' ? 'bg-red-600' : 'bg-green-600',
        )}>
          {toast.type === 'error'
            ? <AlertCircle className="w-4 h-4" />
            : <CheckCircle2 className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}
    </div>
  );
}