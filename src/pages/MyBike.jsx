import { useState } from 'react';
import { Bike, Bluetooth, User, Wrench, Gauge, Battery, CheckCircle, AlertTriangle, XCircle, Search, Plus, Zap, TrendingDown } from 'lucide-react';
import { useDemo } from '@/lib/DemoContext';
import SectionLabel from '@/components/ui/SectionLabel';
import PageHeader from '@/components/ui/PageHeader';
import SubNav from '@/components/ui/SubNav';
import PlaceholderCard from '@/components/ui/PlaceholderCard';
import StatBlock from '@/components/ui/StatBlock';

const TABS = [
  { id: 'pairing', label: 'Bike Pairing', icon: Bluetooth },
  { id: 'profile', label: 'Bike Profile', icon: User },
  { id: 'maintenance', label: 'Maintenance Log', icon: Wrench },
  { id: 'tyre', label: 'Tyre & Sealant', icon: Gauge },
  { id: 'battery', label: 'Battery & Sensors', icon: Battery },
];

const SENSORS = [
  { name: 'Speed Sensor',       status: 'connected',    battery: 87, id: 'SPD-001', proto: 'ANT+' },
  { name: 'Cadence Sensor',     status: 'connected',    battery: 62, id: 'CAD-002', proto: 'ANT+' },
  { name: 'Power Meter',        status: 'connected',    battery: 91, id: 'PWR-003', proto: 'ANT+' },
  { name: 'Heart Rate Monitor', status: 'disconnected', battery: 0,  id: 'HRM-004', proto: 'BLE'  },
  { name: 'GPS Module',         status: 'connected',    battery: 78, id: 'GPS-005', proto: 'BLE'  },
];

const MAINTENANCE = [
  { task: 'Chain Lubrication', date: '02 Jun 2026', km: '1,240 km', status: 'done' },
  { task: 'Brake Pad Inspection', date: '28 May 2026', km: '1,180 km', status: 'done' },
  { task: 'Wheel Truing', date: '15 May 2026', km: '980 km', status: 'done' },
  { task: 'Tyre Replacement (Rear)', date: '01 Apr 2026', km: '620 km', status: 'done' },
];

function StatusIcon({ status }) {
  if (status === 'connected') return <CheckCircle className="w-4 h-4 text-green-400" />;
  if (status === 'warning') return <AlertTriangle className="w-4 h-4 text-amber-400" />;
  return <XCircle className="w-4 h-4 text-red-400" />;
}

export default function MyBike() {
  const { demoMode, data } = useDemo();
  const sensors = demoMode ? data.sensors     : SENSORS;
  const bm      = demoMode ? data.bikeMetrics : null;
  const [tab, setTab] = useState('pairing');

  return (
    <div className="page-enter">
      <PageHeader title="My Bike" subtitle="Manage your bicycle, sensors, and maintenance" icon={Bike} />
      <SubNav tabs={TABS} active={tab} onSelect={setTab} />

      {tab === 'pairing' && (
        <div className="space-y-4">
          {/* Scan panel */}
          <PlaceholderCard title="Sensor Pairing" description="Discover and connect ANT+, BLE, and ANT-FE-C devices" icon={Bluetooth} accent="blue">
            <div className="mt-4 space-y-4">
              <div className="flex flex-col items-center justify-center py-6 border border-dashed border-blue-500/30 rounded-lg">
                <div className="w-14 h-14 rounded-full bg-blue-500/10 border-2 border-blue-500/30 flex items-center justify-center mb-3 animate-pulse">
                  <Bluetooth className="w-7 h-7 text-blue-400" />
                </div>
                <p className="text-sm font-medium text-foreground mb-1">Ready to Scan</p>
                <p className="text-xs text-muted-foreground mb-4 text-center max-w-xs">
                  Ensure sensors are powered on and in pairing mode. Supports ANT+, BLE, and Bluetooth Smart.
                </p>
                <button className="btn-primary glow-blue">
                  <Search className="w-4 h-4" /> Start Scanning
                </button>
              </div>

              {/* Protocol support */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { proto: 'ANT+', desc: 'Speed, Cadence, Power, HR', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
                  { proto: 'BLE',  desc: 'Garmin, Wahoo, Polar',       color: 'text-cyan-400',  bg: 'bg-cyan-500/10 border-cyan-500/20'  },
                  { proto: 'ANT-FE-C', desc: 'Smart trainer control',  color: 'text-violet-400',bg: 'bg-violet-500/10 border-violet-500/20' },
                ].map(p => (
                  <div key={p.proto} className={`rounded-lg border p-3 text-center ${p.bg}`}>
                    <p className={`text-xs font-bold ${p.color}`}>{p.proto}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{p.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </PlaceholderCard>

          {/* Paired devices */}
          <div className="glass-card rounded-xl border border-white/[0.06] overflow-hidden">
            <div className="px-4 py-3 border-b border-border/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bluetooth className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">Paired Devices</span>
              </div>
              <span className="badge bg-cyan-500/10 text-cyan-400">{sensors.filter(s => s.status === 'connected').length} connected</span>
            </div>
            <table className="cf-table">
              <thead>
                <tr>
                  <th className="text-left">Device</th>
                  <th className="text-left hidden sm:table-cell">ID</th>
                  <th className="text-left hidden md:table-cell">Protocol</th>
                  <th className="text-right">Battery</th>
                  <th className="text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {sensors.map(s => (
                  <tr key={s.id}>
                    <td className="font-medium text-foreground">{s.name}</td>
                    <td className="font-mono text-xs text-muted-foreground hidden sm:table-cell">{s.id}</td>
                    <td className="hidden md:table-cell">
                      <span className="badge bg-blue-500/10 text-blue-400">{s.proto || 'ANT+'}</span>
                    </td>
                    <td className="text-right">
                      {s.status === 'connected'
                        ? <span className={`font-mono text-xs font-semibold ${s.battery > 60 ? 'text-green-400' : s.battery > 30 ? 'text-amber-400' : 'text-red-400'}`}>{s.battery}%</span>
                        : <span className="text-xs text-muted-foreground">—</span>
                      }
                    </td>
                    <td className="text-right"><StatusIcon status={s.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-4 py-3 border-t border-border/40">
              <button className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                <Plus className="w-3 h-3" /> Add New Sensor
              </button>
            </div>
          </div>

          <div className="p-3 rounded-xl border border-dashed border-blue-500/20 bg-blue-500/[0.03]">
            <p className="text-xs text-muted-foreground text-center">Garmin Connect IQ, Wahoo API, and Bosch Flow sensor integration hooks ready for device-specific pairing flows.</p>
          </div>
        </div>
      )}

      {tab === 'profile' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PlaceholderCard title="Bike Details" description="Your registered bicycle specifications" icon={Bike} accent="blue">
            <div className="mt-4 space-y-3">
              {[
                { label: 'Make', value: 'Trek' },
                { label: 'Model', value: 'Domane SL 6' },
                { label: 'Year', value: '2024' },
                { label: 'Frame Size', value: '56cm' },
                { label: 'Serial Number', value: 'WTU24ABC1234' },
                { label: 'Total Distance', value: '1,452 km' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center border-b border-border/30 pb-2 last:border-0">
                  <span className="text-xs text-muted-foreground">{label}</span>
                  <span className="text-sm font-medium text-foreground">{value}</span>
                </div>
              ))}
            </div>
          </PlaceholderCard>
          <PlaceholderCard title="Component Specs" description="Drivetrain, brakes, and wheels" icon={Wrench} accent="cyan">
            <div className="mt-4 space-y-3">
              {[
                { label: 'Groupset', value: 'Shimano Ultegra Di2' },
                { label: 'Brakes', value: 'Disc — Hydraulic' },
                { label: 'Tyres', value: '700x32c Bontrager' },
                { label: 'Wheels', value: 'Bontrager Paradigm' },
                { label: 'Saddle', value: 'Bontrager Montrose' },
                { label: 'Handlebar', value: '420mm Drop Bar' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center border-b border-border/30 pb-2 last:border-0">
                  <span className="text-xs text-muted-foreground">{label}</span>
                  <span className="text-sm font-medium text-foreground">{value}</span>
                </div>
              ))}
            </div>
          </PlaceholderCard>
        </div>
      )}

      {tab === 'maintenance' && (
        <PlaceholderCard title="Maintenance Log" description="Track all service and maintenance tasks for your bicycle" icon={Wrench} accent="amber">
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground uppercase tracking-wide">
                  <th className="text-left py-2">Task</th>
                  <th className="text-left py-2 hidden sm:table-cell">Date</th>
                  <th className="text-left py-2 hidden md:table-cell">Odometer</th>
                  <th className="text-right py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {MAINTENANCE.map((item, i) => (
                  <tr key={i} className="border-b border-border/30 hover:bg-white/3">
                    <td className="py-3 font-medium text-foreground">{item.task}</td>
                    <td className="py-3 text-muted-foreground hidden sm:table-cell">{item.date}</td>
                    <td className="py-3 text-muted-foreground hidden md:table-cell font-mono">{item.km}</td>
                    <td className="py-3 text-right"><span className="text-xs bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full">Done</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="mt-4 text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
              + Log New Maintenance Entry
            </button>
          </div>
        </PlaceholderCard>
      )}

      {tab === 'tyre' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PlaceholderCard title="Tyre Pressure" description="Current tyre pressure readings from smart valve sensors" icon={Gauge} accent="cyan">
            <div className="mt-4 grid grid-cols-2 gap-4">
              {[
                { label: 'Front Tyre', data: bm ? bm.frontTyre : { psi: 6.2, status: 'Optimal', color: 'text-green-400', barColor: 'bg-cyan-400', pct: 78 } },
                { label: 'Rear Tyre',  data: bm ? bm.rearTyre  : { psi: 5.8, status: 'Check Soon', color: 'text-amber-400', barColor: 'bg-amber-400', pct: 55 } },
              ].map(({ label, data: td }) => (
                <div key={label} className="text-center p-4 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-xs text-muted-foreground mb-1">{label}</p>
                  <p className="text-3xl font-bold text-cyan-400 font-mono">{td.psi}</p>
                  <p className="text-xs text-muted-foreground">bar</p>
                  <div className="mt-2 w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className={`h-full ${td.barColor} rounded-full`} style={{ width: `${td.pct}%` }} />
                  </div>
                  <p className={`text-xs mt-1 ${td.color}`}>{td.status}</p>
                </div>
              ))}
            </div>
          </PlaceholderCard>
          <PlaceholderCard title="Auto-Sealant Status" description="Tubeless sealant level and condition monitoring" icon={Gauge} accent="blue">
            <div className="mt-4 space-y-3">
              <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                <span className="text-sm text-foreground">Front — Sealant Level</span>
                <span className="text-sm font-medium text-green-400">{bm ? `Good — ${bm.sealantFront.level}` : 'Good — 85%'}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                <span className="text-sm text-foreground">Rear — Sealant Level</span>
                <span className={`text-sm font-medium ${bm && bm.sealantRear.status === 'Low' ? 'text-amber-400' : 'text-green-400'}`}>
                  {bm ? `${bm.sealantRear.status} — ${bm.sealantRear.level}` : 'Low — 30%'}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                <span className="text-sm text-foreground">Last Topped Up</span>
                <span className="text-sm font-medium text-muted-foreground">12 Mar 2026</span>
              </div>
              <p className="text-xs text-amber-400 mt-2">⚠ Rear sealant low — top up recommended before next ride</p>
            </div>
          </PlaceholderCard>
        </div>
      )}

      {tab === 'battery' && (
        <div className="space-y-4">
          <SectionLabel accent="amber" label="Sensor Battery Status" />
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {sensors.map(s => (
              <div key={s.id} className="glass-card rounded-xl border border-white/[0.06] p-4 text-center">
                <div className="flex justify-center mb-2"><StatusIcon status={s.status} /></div>
                <p className="text-xs font-semibold text-foreground mb-1">{s.name}</p>
                {s.status === 'connected' ? (
                  <>
                    <p className={`text-xl font-bold font-mono ${s.battery > 60 ? 'text-green-400' : s.battery > 30 ? 'text-amber-400' : 'text-red-400'}`}>{s.battery}%</p>
                    <div className="mt-1.5 w-full h-1 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${s.battery > 60 ? 'bg-green-400' : s.battery > 30 ? 'bg-amber-400' : 'bg-red-400'}`}
                        style={{ width: `${s.battery}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">{s.proto}</p>
                  </>
                ) : (
                  <p className="text-xs text-red-400 mt-1">Disconnected</p>
                )}
              </div>
            ))}
          </div>

          {/* Range Prediction placeholder */}
          <SectionLabel accent="violet" label="Battery & Range Prediction" />
          <PlaceholderCard title="Estimated Range" description="Predicted remaining range based on current battery levels and ride conditions" icon={TrendingDown} accent="violet">
            <div className="mt-4 space-y-3">
              {/* Main range display */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'GPS / Computer', range: '~94 km', pct: 78, color: 'text-green-400', bar: 'bg-green-400' },
                  { label: 'Power Meter',    range: '~210 km', pct: 91, color: 'text-green-400', bar: 'bg-green-400' },
                  { label: 'Speed Sensor',   range: '~180 km', pct: 87, color: 'text-green-400', bar: 'bg-green-400' },
                ].map(r => (
                  <div key={r.label} className="rounded-lg bg-white/5 border border-white/5 p-3 text-center">
                    <p className="text-[10px] text-muted-foreground mb-2">{r.label}</p>
                    <p className={`text-sm font-bold font-mono ${r.color}`}>{r.range}</p>
                    <div className="mt-2 w-full h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${r.bar}`} style={{ width: `${r.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Bosch e-bike stub */}
              <div className="p-4 rounded-xl border border-violet-500/20 bg-violet-500/[0.05]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-violet-400" />
                    <p className="text-xs font-semibold text-foreground">E-Bike Drive System</p>
                  </div>
                  <span className={`badge ${bm ? 'bg-green-500/10 text-green-400' : 'bg-violet-500/10 text-violet-400'}`}>
                    {bm ? 'Simulated' : 'Not Connected'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-3">Connect your Bosch Flow, Shimano Steps, or Brose motor system for live battery range prediction.</p>
                <div className={`grid grid-cols-2 gap-2 text-center ${bm ? '' : 'opacity-40'}`}>
                  {[
                    ['Battery Charge', bm ? `${bm.eBattery.pct}%`        : '—%'],
                    ['Estimated Range', bm ? `${bm.eBattery.range} km`   : '— km'],
                    ['Assist Mode',    bm ? bm.eBattery.assistMode        : '—'],
                    ['Motor Temp',     bm ? `${bm.motorTemp}°C`          : '—'],
                  ].map(([l, v]) => (
                    <div key={l} className="p-2 rounded-lg bg-white/5">
                      <p className="text-[10px] text-muted-foreground">{l}</p>
                      <p className="text-sm font-mono font-bold text-foreground mt-0.5">{v}</p>
                    </div>
                  ))}
                </div>
                {!bm && <button className="btn-secondary w-full mt-3 text-xs">Connect Bosch Flow / E-Drive</button>}
              </div>

              <div className="p-3 rounded-lg border border-dashed border-violet-500/20">
                <p className="text-xs text-muted-foreground text-center">
                  Predictive range model using elevation profile, historical power data, and assist settings — Bosch Flow API and Shimano Steps BLE integration hook ready.
                </p>
              </div>
            </div>
          </PlaceholderCard>
        </div>
      )}
    </div>
  );
}