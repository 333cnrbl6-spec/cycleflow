import { useState } from 'react';
import { Shield, CheckSquare, Camera, AlertOctagon, Phone, Check, X, AlertTriangle } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import SubNav from '@/components/ui/SubNav';
import PlaceholderCard from '@/components/ui/PlaceholderCard';

const TABS = [
  { id: 'check', label: 'Pre-Ride Check', icon: CheckSquare },
  { id: 'camera', label: 'Helmet Camera', icon: Camera },
  { id: 'incident', label: 'Incident Reporting', icon: AlertOctagon },
  { id: 'emergency', label: 'Emergency Contact', icon: Phone },
];

const CHECKLIST = [
  { id: 1, item: 'Helmet — buckled and secure', category: 'PPE' },
  { id: 2, item: 'Front brake — responsive and firm', category: 'Brakes' },
  { id: 3, item: 'Rear brake — responsive and firm', category: 'Brakes' },
  { id: 4, item: 'Tyre pressure — within range', category: 'Tyres' },
  { id: 5, item: 'Tyre condition — no cuts or bulges', category: 'Tyres' },
  { id: 6, item: 'Chain — lubricated and smooth', category: 'Drivetrain' },
  { id: 7, item: 'Front light — charged and working', category: 'Lights' },
  { id: 8, item: 'Rear light — charged and flashing', category: 'Lights' },
  { id: 9, item: 'Quick releases — closed and secure', category: 'Frame' },
  { id: 10, item: 'Saddle height — correct and locked', category: 'Fit' },
];

export default function Safety() {
  const [tab, setTab] = useState('check');
  const [checked, setChecked] = useState({});
  const [sosActive, setSosActive] = useState(false);

  const toggleCheck = (id) => setChecked(c => ({ ...c, [id]: !c[id] }));
  const completedCount = Object.values(checked).filter(Boolean).length;

  return (
    <div className="p-6 page-enter">
      <PageHeader title="Safety" subtitle="Pre-ride checks, incident reporting, and emergency tools" icon={Shield} iconColor="text-green-400" />
      <SubNav tabs={TABS} active={tab} onSelect={setTab} />

      {tab === 'check' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between glass-card rounded-lg border border-white/5 p-4">
            <div>
              <p className="text-sm font-semibold text-foreground">Pre-Ride Safety Check</p>
              <p className="text-xs text-muted-foreground">{completedCount} of {CHECKLIST.length} items completed</p>
            </div>
            <div className="relative w-12 h-12">
              <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15" fill="none" stroke="#1e293b" strokeWidth="3" />
                <circle cx="18" cy="18" r="15" fill="none" stroke={completedCount === CHECKLIST.length ? '#4ade80' : '#3b82f6'} strokeWidth="3"
                  strokeDasharray={`${(completedCount / CHECKLIST.length) * 94} 94`} strokeLinecap="round" />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-foreground">
                {Math.round((completedCount / CHECKLIST.length) * 100)}%
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            {CHECKLIST.map(item => (
              <button
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className={`w-full flex items-center gap-3 p-3.5 rounded-lg border text-left transition-all ${
                  checked[item.id]
                    ? 'bg-green-500/5 border-green-500/20 text-muted-foreground'
                    : 'glass-card border-white/5 hover:border-blue-500/30 text-foreground'
                }`}
              >
                <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border ${
                  checked[item.id] ? 'bg-green-500 border-green-500' : 'border-border bg-white/5'
                }`}>
                  {checked[item.id] && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className={`text-sm flex-1 ${checked[item.id] ? 'line-through' : ''}`}>{item.item}</span>
                <span className="text-xs text-muted-foreground">{item.category}</span>
              </button>
            ))}
          </div>

          {completedCount === CHECKLIST.length && (
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-center">
              <p className="text-sm font-semibold text-green-400">All checks passed — ride safe!</p>
            </div>
          )}
        </div>
      )}

      {tab === 'camera' && (
        <div className="space-y-4">
          <PlaceholderCard title="Helmet Camera Status" description="Front-facing camera and recording status" icon={Camera} accent="cyan">
            <div className="mt-4 flex flex-col items-center py-6">
              <div className="w-20 h-20 rounded-full bg-cyan-500/10 border-2 border-cyan-500/30 flex items-center justify-center mb-3">
                <Camera className="w-10 h-10 text-cyan-400/50" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">No Camera Detected</p>
              <p className="text-xs text-muted-foreground mt-1 mb-4">Pair a helmet camera via Bluetooth or WiFi</p>
              <button className="px-5 py-2 bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-sm font-medium rounded-lg hover:bg-cyan-500/30 transition-colors">
                Connect Camera
              </button>
            </div>
          </PlaceholderCard>
          <div className="grid grid-cols-3 gap-3">
            {['Recording Quality', 'Storage Available', 'Battery Level'].map((label, i) => (
              <div key={label} className="glass-card rounded-lg border border-white/5 p-4 text-center">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-sm font-medium text-muted-foreground mt-1">— N/A —</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'incident' && (
        <PlaceholderCard title="Incident Report" description="Log and submit a safety incident or near-miss" icon={AlertOctagon} accent="amber">
          <div className="mt-4 space-y-4">
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5">Incident Type</label>
              <select className="w-full bg-white/5 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground">
                <option>Select type…</option>
                <option>Near-miss — vehicle</option>
                <option>Near-miss — pedestrian</option>
                <option>Fall / Crash</option>
                <option>Mechanical failure</option>
                <option>Road hazard</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5">Date & Time</label>
              <input type="datetime-local" className="w-full bg-white/5 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5">Location</label>
              <input type="text" placeholder="GPS auto-detected or enter manually" className="w-full bg-white/5 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5">Description</label>
              <textarea rows={3} placeholder="Describe what happened…" className="w-full bg-white/5 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground resize-none" />
            </div>
            <button className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-lg transition-colors">
              Submit Incident Report
            </button>
          </div>
        </PlaceholderCard>
      )}

      {tab === 'emergency' && (
        <div className="space-y-4">
          <div className={`rounded-xl border-2 p-6 text-center transition-all ${
            sosActive ? 'border-red-500 bg-red-500/10 glow-red' : 'border-red-500/40 bg-red-500/5 hover:border-red-500/70'
          }`}>
            <AlertTriangle className={`w-12 h-12 mx-auto mb-3 ${sosActive ? 'text-red-400' : 'text-red-400/60'}`} />
            <h2 className="text-xl font-bold text-foreground mb-1">Emergency SOS</h2>
            <p className="text-sm text-muted-foreground mb-6">
              {sosActive ? 'SOS Alert Sent — Help is on the way' : 'Press and hold to send emergency alert to your contacts and emergency services'}
            </p>
            <button
              onMouseDown={() => setSosActive(true)}
              onMouseUp={() => setTimeout(() => setSosActive(false), 3000)}
              className={`w-28 h-28 rounded-full mx-auto flex flex-col items-center justify-center border-4 transition-all font-bold text-sm ${
                sosActive
                  ? 'bg-red-500 border-red-400 text-white glow-red scale-105'
                  : 'bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30'
              }`}
            >
              <Phone className="w-8 h-8 mb-1" />
              {sosActive ? 'SENT' : 'HOLD SOS'}
            </button>
          </div>

          <PlaceholderCard title="Emergency Contacts" description="Contacts notified when SOS is triggered" icon={Phone} accent="red">
            <div className="mt-3 space-y-2">
              {[
                { name: 'Jane Doe (Partner)', phone: '+44 7700 900123' },
                { name: 'Dr. Smith (GP)', phone: '+44 1234 567890' },
              ].map((c, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                  <div>
                    <p className="text-sm font-medium text-foreground">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.phone}</p>
                  </div>
                  <button className="text-xs text-red-400 hover:text-red-300">Remove</button>
                </div>
              ))}
              <button className="text-xs text-blue-400 hover:text-blue-300 mt-1">+ Add Emergency Contact</button>
            </div>
          </PlaceholderCard>
        </div>
      )}
    </div>
  );
}