import { useState } from 'react';
import { Shield, CheckSquare, AlertOctagon, Phone, Check, AlertTriangle, ClipboardList, FileText, Plus, Radio, MapPin, Users } from 'lucide-react';
import { useDemo } from '@/lib/DemoContext';
import PageHeader from '@/components/ui/PageHeader';
import SubNav from '@/components/ui/SubNav';
import PlaceholderCard from '@/components/ui/PlaceholderCard';
import SectionLabel from '@/components/ui/SectionLabel';

const TABS = [
  { id: 'preride',   label: 'Pre-Ride',       icon: CheckSquare },
  { id: 'midride',   label: 'Mid-Ride',        icon: ClipboardList },
  { id: 'postride',  label: 'Post-Ride',       icon: FileText },
  { id: 'beacon',    label: 'Live Beacon',     icon: Radio },
  { id: 'incident',  label: 'Incident Report', icon: AlertOctagon },
  { id: 'emergency', label: 'Emergency',        icon: Phone },
];

const PRE_CHECKLIST = [
  { id: 1,  item: 'Helmet — buckled and secure',          category: 'PPE' },
  { id: 2,  item: 'Front brake — responsive and firm',    category: 'Brakes' },
  { id: 3,  item: 'Rear brake — responsive and firm',     category: 'Brakes' },
  { id: 4,  item: 'Tyre pressure — within range',         category: 'Tyres' },
  { id: 5,  item: 'Tyre condition — no cuts or bulges',   category: 'Tyres' },
  { id: 6,  item: 'Chain — lubricated and smooth',        category: 'Drivetrain' },
  { id: 7,  item: 'Front light — charged and working',    category: 'Lights' },
  { id: 8,  item: 'Rear light — charged and flashing',    category: 'Lights' },
  { id: 9,  item: 'Quick releases — closed and secure',   category: 'Frame' },
  { id: 10, item: 'Saddle height — correct and locked',   category: 'Fit' },
];

const MID_CHECKLIST = [
  { id: 1, item: 'Hydration — water bottle available',          category: 'Health' },
  { id: 2, item: 'Energy level — no signs of bonking',          category: 'Health' },
  { id: 3, item: 'Lights — still functioning',                  category: 'Lights' },
  { id: 4, item: 'Tyre feel — no puncture symptoms',            category: 'Tyres' },
  { id: 5, item: 'Chain — still running smoothly',              category: 'Drivetrain' },
  { id: 6, item: 'Brakes — not fading or spongy',               category: 'Brakes' },
  { id: 7, item: 'Phone — charged and accessible',              category: 'Safety' },
  { id: 8, item: 'Weather — conditions acceptable to continue', category: 'Safety' },
];

const POST_CHECKLIST = [
  { id: 1, item: 'Bike wiped down and cleaned',             category: 'Maintenance' },
  { id: 2, item: 'Chain re-lubricated if wet',              category: 'Maintenance' },
  { id: 3, item: 'Brakes inspected for wear',               category: 'Brakes' },
  { id: 4, item: 'Tyre pressure checked and logged',        category: 'Tyres' },
  { id: 5, item: 'Lights charged and stored',               category: 'Lights' },
  { id: 6, item: 'Ride data synced from bike computer',     category: 'Data' },
  { id: 7, item: 'Any damage or issues noted in log',       category: 'Maintenance' },
];

const STATIC_INCIDENTS = [
  { type: 'Near-miss', date: '28 May 2026', severity: 'Medium', status: 'Submitted' },
  { type: 'Road hazard', date: '14 Apr 2026', severity: 'Low', status: 'Resolved' },
];

const STATIC_BEACON = [
  { name: 'City Cycling Club', type: 'Club', status: 'Watching', avatar: 'CC' },
  { name: 'Jane Doe (Partner)', type: 'Personal', status: 'Watching', avatar: 'JD' },
];

function Checklist({ items, stateKey }) {
  const [checked, setChecked] = useState({});
  const toggle = (id) => setChecked(c => ({ ...c, [id]: !c[id] }));
  const done = Object.values(checked).filter(Boolean).length;
  const total = items.length;
  const pct = Math.round((done / total) * 100);

  return (
    <div className="space-y-3">
      <div className="glass-card rounded-xl border border-white/5 p-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">
            {stateKey === 'pre' ? 'Pre-Ride' : stateKey === 'mid' ? 'Mid-Ride' : 'Post-Ride'} Safety Check
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">{done} of {total} items completed</p>
        </div>
        <div className="relative w-12 h-12 flex-shrink-0">
          <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15" fill="none" stroke="#1e293b" strokeWidth="3" />
            <circle cx="18" cy="18" r="15" fill="none"
              stroke={pct === 100 ? '#4ade80' : '#3b82f6'} strokeWidth="3"
              strokeDasharray={`${(done / total) * 94} 94`} strokeLinecap="round" />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-foreground">{pct}%</span>
        </div>
      </div>
      <div className="space-y-1.5">
        {items.map(item => (
          <button key={item.id} onClick={() => toggle(item.id)}
            className={`w-full flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
              checked[item.id]
                ? 'bg-green-500/5 border-green-500/20 text-muted-foreground'
                : 'glass-card border-white/5 hover:border-blue-500/30 text-foreground'
            }`}>
            <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border transition-colors ${
              checked[item.id] ? 'bg-green-500 border-green-500' : 'border-border bg-white/5'
            }`}>
              {checked[item.id] && <Check className="w-3 h-3 text-white" />}
            </div>
            <span className={`text-sm flex-1 ${checked[item.id] ? 'line-through opacity-50' : ''}`}>{item.item}</span>
            <span className="text-xs text-muted-foreground flex-shrink-0">{item.category}</span>
          </button>
        ))}
      </div>
      {pct === 100 && (
        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-center">
          <p className="text-sm font-semibold text-green-400">✓ All checks passed — you're good to go!</p>
        </div>
      )}
    </div>
  );
}

export default function Safety() {
  const { demoMode, data } = useDemo();
  const pastIncidents  = demoMode ? data.safetyIncidents : STATIC_INCIDENTS;
  const beaconWatchers = demoMode ? data.beaconWatchers  : STATIC_BEACON;
  const [tab, setTab]           = useState('preride');
  const [sosActive, setSosActive] = useState(false);
  const [beaconOn, setBeaconOn] = useState(false);
  const [incidentForm, setIncidentForm] = useState({
    type: '', datetime: '', location: '', description: '', severity: 'Low', submitted: false,
  });

  return (
    <div className="p-6 page-enter">
      <PageHeader title="Safety" subtitle="Checklists, live beacon, incident reporting, and emergency tools" icon={Shield} iconColor="text-green-400" />
      <SubNav tabs={TABS} active={tab} onSelect={setTab} />

      {tab === 'preride'  && <Checklist items={PRE_CHECKLIST}  stateKey="pre" />}
      {tab === 'midride'  && <Checklist items={MID_CHECKLIST}  stateKey="mid" />}
      {tab === 'postride' && <Checklist items={POST_CHECKLIST} stateKey="post" />}

      {/* ── Live Safety Beacon ── */}
      {tab === 'beacon' && (
        <div className="space-y-4">
          {/* Beacon toggle */}
          <div className={`rounded-2xl border-2 p-6 text-center transition-all duration-300 ${
            beaconOn
              ? 'border-green-500/60 bg-green-500/8 glow-cyan'
              : 'border-green-500/20 bg-green-500/3 hover:border-green-500/40'
          }`}>
            <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center border-2 transition-all duration-300 ${
              beaconOn
                ? 'bg-green-500/20 border-green-400 animate-pulse'
                : 'bg-white/5 border-white/20'
            }`}>
              <Radio className={`w-8 h-8 transition-colors ${beaconOn ? 'text-green-400' : 'text-muted-foreground'}`} />
            </div>
            <h2 className="text-lg font-bold text-foreground mb-1">Live Safety Beacon</h2>
            <p className="text-sm text-muted-foreground mb-5">
              {beaconOn
                ? '📡 Beacon active — your location is being shared with watchers in real time'
                : 'Share your live GPS location with trusted contacts and club during a ride'}
            </p>
            <button
              onClick={() => setBeaconOn(b => !b)}
              className={`px-8 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-[0.97] ${
                beaconOn
                  ? 'bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {beaconOn ? 'Stop Beacon' : 'Start Beacon'}
            </button>
          </div>

          {/* Map placeholder */}
          <div className="glass-card rounded-xl border border-white/[0.06] overflow-hidden">
            <div className="px-4 py-3 border-b border-border/60 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-green-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">Live Position</span>
              {beaconOn && <span className="ml-auto flex items-center gap-1.5 text-[10px] text-green-400"><span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />Broadcasting</span>}
            </div>
            <div className="h-52 bg-[#0a1628] flex items-center justify-center relative"
              style={{ backgroundImage: 'linear-gradient(#1e40af15 1px, transparent 1px), linear-gradient(90deg, #1e40af15 1px, transparent 1px)', backgroundSize: '28px 28px' }}>
              {beaconOn && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4 h-4 bg-green-400 rounded-full z-10 shadow-lg" style={{ boxShadow: '0 0 0 8px rgba(74,222,128,0.15), 0 0 0 20px rgba(74,222,128,0.07)' }} />
                </div>
              )}
              <div className={`text-center z-20 ${beaconOn ? 'opacity-0' : 'opacity-100'}`}>
                <MapPin className="w-8 h-8 text-blue-400/30 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Map view — React Leaflet integration ready</p>
              </div>
            </div>
          </div>

          {/* Watchers */}
          <PlaceholderCard title="Beacon Watchers" description="People and groups watching your live location" icon={Users} accent="green">
            <div className="mt-3 space-y-2">
              {beaconWatchers.map((c, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-[10px] font-bold text-green-400">{c.avatar}</span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">{c.name}</p>
                      <p className="text-[10px] text-muted-foreground">{c.type}</p>
                    </div>
                  </div>
                  <span className="badge bg-green-500/10 text-green-400">{c.status}</span>
                </div>
              ))}
              <button className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 mt-1">
                <Plus className="w-3 h-3" /> Add Watcher
              </button>
            </div>
          </PlaceholderCard>

          {/* Settings */}
          <PlaceholderCard title="Beacon Settings" description="Configure sharing interval and auto-trigger rules" icon={Radio} accent="blue">
            <div className="mt-3 space-y-2">
              {[
                { label: 'Update interval',         value: 'Every 30 seconds' },
                { label: 'Auto-start on ride begin',value: 'Enabled' },
                { label: 'Auto-stop on ride end',   value: 'Enabled' },
                { label: 'Crash detection trigger', value: 'On — activates SOS after 60s no movement' },
                { label: 'Share with club by default', value: 'City Cycling Club' },
              ].map(([l, v]) => (
                <div key={l} className="flex items-center justify-between p-2.5 rounded-lg bg-white/5">
                  <span className="text-xs text-muted-foreground">{l}</span>
                  <span className="text-xs font-medium text-foreground truncate ml-4 text-right">{v}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 p-3 rounded-lg border border-blue-500/20 bg-blue-500/[0.04]">
              <p className="text-xs text-blue-400/80">Live beacon API — WebSocket GPS stream and Garmin LiveTrack / Wahoo ELEMNT integration hook ready.</p>
            </div>
          </PlaceholderCard>
        </div>
      )}

      {/* ── Incident Report ── */}
      {tab === 'incident' && (
        <div className="space-y-4">
          {pastIncidents.length > 0 && (
            <div className="glass-card rounded-xl border border-white/[0.06] overflow-hidden">
              <div className="px-4 py-3 border-b border-border/60 flex items-center gap-2">
                <AlertOctagon className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">Previous Reports</span>
              </div>
              {pastIncidents.map((inc, i) => (
                <div key={i} className="px-4 py-3 border-b border-border/20 last:border-0 flex items-center justify-between hover:bg-white/[0.025] transition-colors">
                  <div>
                    <p className="text-sm font-medium text-foreground">{inc.type}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{inc.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`badge ${inc.severity === 'Medium' ? 'bg-amber-500/10 text-amber-400' : 'bg-green-500/10 text-green-400'}`}>{inc.severity}</span>
                    <span className={`badge ${inc.status === 'Resolved' ? 'bg-green-500/10 text-green-400' : 'bg-blue-500/10 text-blue-400'}`}>{inc.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          {incidentForm.submitted ? (
            <div className="text-center py-10 page-enter">
              <div className="w-14 h-14 rounded-full bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center mx-auto mb-3">
                <AlertOctagon className="w-7 h-7 text-amber-400" />
              </div>
              <h3 className="text-base font-bold text-foreground mb-1">Report Submitted</h3>
              <p className="text-sm text-muted-foreground mb-5">Your incident report has been sent to your club admin for review.</p>
              <button onClick={() => setIncidentForm({ type:'', datetime:'', location:'', description:'', severity:'Low', submitted:false })}
                className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-lg transition-colors">
                Log Another Incident
              </button>
            </div>
          ) : (
            <PlaceholderCard title="New Incident Report" description="Log a safety incident, near-miss, or road hazard" icon={AlertOctagon} accent="amber">
              <div className="mt-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="cf-label">Incident Type *</label>
                    <select value={incidentForm.type} onChange={e => setIncidentForm(p => ({...p, type: e.target.value}))} className="cf-select">
                      <option value="">Select type…</option>
                      <option>Near-miss — vehicle</option>
                      <option>Near-miss — pedestrian</option>
                      <option>Fall / Crash</option>
                      <option>Mechanical failure</option>
                      <option>Road hazard</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="cf-label">Severity</label>
                    <select value={incidentForm.severity} onChange={e => setIncidentForm(p => ({...p, severity: e.target.value}))} className="cf-select">
                      <option>Low</option><option>Medium</option><option>High</option><option>Critical</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="cf-label">Date & Time</label>
                  <input type="datetime-local" value={incidentForm.datetime} onChange={e => setIncidentForm(p => ({...p, datetime: e.target.value}))} className="cf-input" />
                </div>
                <div>
                  <label className="cf-label">Location</label>
                  <input type="text" value={incidentForm.location} onChange={e => setIncidentForm(p => ({...p, location: e.target.value}))}
                    placeholder="GPS auto-detected or enter manually" className="cf-input" />
                </div>
                <div>
                  <label className="cf-label">Description *</label>
                  <textarea rows={3} value={incidentForm.description} onChange={e => setIncidentForm(p => ({...p, description: e.target.value}))}
                    placeholder="Describe what happened in as much detail as possible…" className="cf-textarea" />
                </div>
                <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
                  <p className="text-xs text-blue-400">Your GPS location, ride data snapshot, and sensor logs will be automatically attached to this report.</p>
                </div>
                <button onClick={() => setIncidentForm(p => ({...p, submitted: true}))}
                  className="w-full inline-flex items-center justify-center py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-xl transition-all duration-150 active:scale-[0.98]">
                  Submit Incident Report
                </button>
              </div>
            </PlaceholderCard>
          )}
        </div>
      )}

      {/* ── Emergency ── */}
      {tab === 'emergency' && (
        <div className="space-y-4">
          <div className={`rounded-2xl border-2 p-6 text-center transition-all duration-300 ${
            sosActive ? 'border-red-500 bg-red-500/10 glow-red' : 'border-red-500/40 bg-red-500/5 hover:border-red-500/60'
          }`}>
            <AlertTriangle className={`w-10 h-10 mx-auto mb-3 transition-colors ${sosActive ? 'text-red-400' : 'text-red-400/50'}`} />
            <h2 className="text-xl font-bold text-foreground mb-1">Emergency SOS</h2>
            <p className="text-sm text-muted-foreground mb-6">
              {sosActive ? '🚨 SOS Alert Sent — Help is on the way' : 'Hold the button to send an emergency alert to your contacts and emergency services'}
            </p>
            <button
              onMouseDown={() => setSosActive(true)}
              onMouseUp={() => setTimeout(() => setSosActive(false), 4000)}
              onTouchStart={() => setSosActive(true)}
              onTouchEnd={() => setTimeout(() => setSosActive(false), 4000)}
              className={`w-28 h-28 rounded-full mx-auto flex flex-col items-center justify-center border-4 transition-all duration-300 font-bold text-sm ${
                sosActive ? 'bg-red-500 border-red-300 text-white glow-red scale-110' : 'bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30 active:scale-95'
              }`}>
              <Phone className="w-8 h-8 mb-1" />
              <span className="text-xs font-bold">{sosActive ? 'SENT' : 'HOLD SOS'}</span>
            </button>
          </div>
          <PlaceholderCard title="Emergency Contacts" description="Notified automatically when SOS is triggered" icon={Phone} accent="red">
            <div className="mt-3 space-y-2">
              {[
                { name: 'Jane Doe (Partner)', phone: '+44 7700 900123', priority: 1 },
                { name: 'Dr. Smith (GP)',      phone: '+44 1234 567890', priority: 2 },
              ].map((c, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-red-400">{c.priority}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.phone}</p>
                    </div>
                  </div>
                  <button className="text-xs text-muted-foreground hover:text-red-400 transition-colors">Remove</button>
                </div>
              ))}
              <button className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 mt-1">
                <Plus className="w-3 h-3" /> Add Emergency Contact
              </button>
            </div>
          </PlaceholderCard>
          <PlaceholderCard title="Medical Information" description="Shared with emergency services if SOS is triggered" icon={Shield} accent="blue">
            <div className="mt-3 space-y-2">
              {[['Blood Type','A+'],['Allergies','Penicillin'],['Medical Conditions','None'],['GP Contact','Dr. Smith — 01234 567890']].map(([l,v]) => (
                <div key={l} className="flex justify-between p-2.5 rounded-lg bg-white/5">
                  <span className="text-xs text-muted-foreground">{l}</span>
                  <span className="text-xs font-medium text-foreground">{v}</span>
                </div>
              ))}
              <button className="text-xs text-blue-400 hover:text-blue-300 mt-1">Edit Medical Info</button>
            </div>
          </PlaceholderCard>
        </div>
      )}
    </div>
  );
}