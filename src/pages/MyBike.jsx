import { useState } from 'react';
import { Bike, Bluetooth, User, Wrench, Gauge, Battery, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
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
  { name: 'Speed Sensor', status: 'connected', battery: 87, id: 'SPD-001' },
  { name: 'Cadence Sensor', status: 'connected', battery: 62, id: 'CAD-002' },
  { name: 'Power Meter', status: 'connected', battery: 91, id: 'PWR-003' },
  { name: 'Heart Rate Monitor', status: 'disconnected', battery: 0, id: 'HRM-004' },
  { name: 'GPS Module', status: 'connected', battery: 78, id: 'GPS-005' },
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
  const [tab, setTab] = useState('pairing');

  return (
    <div className="p-6 page-enter">
      <PageHeader title="My Bike" subtitle="Manage your bicycle, sensors, and maintenance" icon={Bike} />
      <SubNav tabs={TABS} active={tab} onSelect={setTab} />

      {tab === 'pairing' && (
        <div className="space-y-4">
          <PlaceholderCard title="Bluetooth Pairing" description="Connect your bike's sensors and computers via Bluetooth Low Energy (BLE)" icon={Bluetooth} accent="blue">
            <div className="mt-4 flex flex-col items-center justify-center py-8 border border-dashed border-blue-500/30 rounded-lg">
              <div className="w-16 h-16 rounded-full bg-blue-500/10 border-2 border-blue-500/30 flex items-center justify-center mb-4 animate-pulse">
                <Bluetooth className="w-8 h-8 text-blue-400" />
              </div>
              <p className="text-sm font-medium text-foreground mb-1">Ready to Scan</p>
              <p className="text-xs text-muted-foreground mb-4">Make sure your sensors are powered on and in pairing mode</p>
              <button className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors glow-blue">
                Start Scanning
              </button>
            </div>
          </PlaceholderCard>
          <PlaceholderCard title="Paired Devices" description="3 of 5 sensors currently connected" icon={Bluetooth} accent="cyan">
            <div className="mt-2 space-y-2">
              {SENSORS.slice(0, 3).map(s => (
                <div key={s.id} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-foreground">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.id}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{s.battery}%</span>
                    <StatusIcon status={s.status} />
                  </div>
                </div>
              ))}
            </div>
          </PlaceholderCard>
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
              <div className="text-center p-4 rounded-lg bg-white/5 border border-white/10">
                <p className="text-xs text-muted-foreground mb-1">Front Tyre</p>
                <p className="text-3xl font-bold text-cyan-400 font-mono">6.2</p>
                <p className="text-xs text-muted-foreground">bar</p>
                <div className="mt-2 w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400 rounded-full" style={{ width: '78%' }} />
                </div>
                <p className="text-xs text-green-400 mt-1">Optimal</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-white/5 border border-white/10">
                <p className="text-xs text-muted-foreground mb-1">Rear Tyre</p>
                <p className="text-3xl font-bold text-cyan-400 font-mono">5.8</p>
                <p className="text-xs text-muted-foreground">bar</p>
                <div className="mt-2 w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: '55%' }} />
                </div>
                <p className="text-xs text-amber-400 mt-1">Check Soon</p>
              </div>
            </div>
          </PlaceholderCard>
          <PlaceholderCard title="Auto-Sealant Status" description="Tubeless sealant level and condition monitoring" icon={Gauge} accent="blue">
            <div className="mt-4 space-y-3">
              <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                <span className="text-sm text-foreground">Front — Sealant Level</span>
                <span className="text-sm font-medium text-green-400">Good — 85%</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                <span className="text-sm text-foreground">Rear — Sealant Level</span>
                <span className="text-sm font-medium text-amber-400">Low — 30%</span>
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
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {SENSORS.map(s => (
              <div key={s.id} className="glass-card rounded-lg border border-white/5 p-4 text-center">
                <StatusIcon status={s.status} />
                <p className="text-xs font-medium text-foreground mt-2 mb-1">{s.name}</p>
                {s.status === 'connected' ? (
                  <>
                    <p className="text-xl font-bold text-blue-400 font-mono">{s.battery}%</p>
                    <div className="mt-1.5 w-full h-1 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${s.battery > 60 ? 'bg-green-400' : s.battery > 30 ? 'bg-amber-400' : 'bg-red-400'}`}
                        style={{ width: `${s.battery}%` }}
                      />
                    </div>
                  </>
                ) : (
                  <p className="text-xs text-red-400 mt-1">Disconnected</p>
                )}
              </div>
            ))}
          </div>
          <PlaceholderCard title="Sensor Health Overview" description="All sensors and their connection quality" icon={Battery} accent="blue">
            <p className="text-xs text-muted-foreground mt-2">4 of 5 sensors active. Heart Rate Monitor not detected — ensure device is charged and within range.</p>
          </PlaceholderCard>
        </div>
      )}
    </div>
  );
}