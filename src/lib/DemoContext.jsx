import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

const DemoContext = createContext(null);

// ── Tiny RNG helpers ──────────────────────────────────────────────────────────
const rnd   = (lo, hi)  => Math.random() * (hi - lo) + lo;
const rndI  = (lo, hi)  => Math.floor(rnd(lo, hi + 1));
const pick  = (arr)     => arr[rndI(0, arr.length - 1)];
const fmt1  = v         => +v.toFixed(1);
const clamp = (v,lo,hi) => Math.max(lo, Math.min(hi, v));

// ── Static generation helpers ─────────────────────────────────────────────────
function buildRideHistory() {
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  return days.map(day => ({
    day,
    km: pick([0,0,12,0]) === 0 ? rndI(0, 68) : 0,
  }));
}

function buildRecentRides() {
  const NAMES = ['Morning Blast','Evening Loop','Club Ride','Hill Climb','Recovery Spin','Commute South','Forest Trail'];
  const POWERS = [142,165,187,204,211,228,241];
  return NAMES.slice(0, 5).map((name, i) => ({
    name,
    date: i === 0 ? 'Today, 07:14' : i === 1 ? 'Yesterday' : `${pick(['Mon','Tue','Wed','Thu','Sat','Sun'])} ${rndI(1,28)} ${pick(['Apr','May','Jun'])}`,
    km:   `${fmt1(rnd(10, 78))} km`,
    time: `${rndI(0,3)}h ${rndI(10,59)}m`,
    watts: `${pick(POWERS)}W`,
  }));
}

function buildSafetyIncidents() {
  const TYPES  = ['Near-miss — vehicle','Near-miss — pedestrian','Road hazard','Fall / Crash'];
  const SEVS   = ['Low','Low','Medium','Medium','High'];
  const STATUS = ['Submitted','Resolved','Under Review'];
  return Array.from({ length: rndI(2, 5) }, (_, i) => ({
    type:     pick(TYPES),
    date:     `${rndI(1,28)} ${pick(['Apr','May','Jun'])} 2026`,
    severity: pick(SEVS),
    status:   pick(STATUS),
  }));
}

function buildBeaconWatchers() {
  return [
    { name: 'City Cycling Club',    type: 'Club',     status: 'Watching', avatar: 'CC' },
    { name: pick(['Jane Doe','Sam K.','Chris M.']), type: 'Personal', status: 'Watching', avatar: 'JD' },
  ];
}

function buildClubLeaderboard() {
  const NAMES = ['Alex Turner','Sarah Chen','Marcus Webb','Priya Nair','You (Jamie Ford)','Tom Barker','Lucy Martin','James Hill'];
  const sorted = NAMES.map(name => ({
    name,
    km: (rndI(800, 2000)).toLocaleString(),
    rides: rndI(20, 55),
    you: name.includes('You'),
  })).sort((a, b) => {
    const aKm = +a.km.replace(',','');
    const bKm = +b.km.replace(',','');
    return bKm - aKm;
  });
  return sorted.map((r, i) => ({ ...r, rank: i + 1, badge: i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '' }));
}

function buildTrainingLog() {
  const WORKOUTS = ['Threshold Intervals','Recovery Spin','Sweet Spot x3','Base Endurance','VO2 Max Reps','Tempo Ride','Long Slow Distance'];
  const LOADS    = ['Easy','Easy','Medium','Hard','Hard'];
  const MONTHS   = ['Apr','May','Jun'];
  return Array.from({ length: 8 }, (_, i) => ({
    date:  `${rndI(1,28)} ${pick(MONTHS)}`,
    name:  pick(WORKOUTS),
    tss:   rndI(22, 130),
    dur:   `${rndI(0,2)}h ${rndI(10,59)}m`,
    load:  pick(LOADS),
  }));
}

function buildSensors() {
  return [
    { name: 'Speed Sensor',       status: 'connected',    battery: rndI(55, 98), id: 'SPD-001', proto: 'ANT+' },
    { name: 'Cadence Sensor',     status: 'connected',    battery: rndI(40, 95), id: 'CAD-002', proto: 'ANT+' },
    { name: 'Power Meter',        status: 'connected',    battery: rndI(70, 99), id: 'PWR-003', proto: 'ANT+' },
    { name: 'Heart Rate Monitor', status: Math.random() > 0.3 ? 'connected' : 'disconnected', battery: rndI(20, 80), id: 'HRM-004', proto: 'BLE' },
    { name: 'GPS Module',         status: 'connected',    battery: rndI(50, 90), id: 'GPS-005', proto: 'BLE' },
  ];
}

function buildBikeMetrics() {
  const frontPsi = fmt1(rnd(5.6, 7.2));
  const rearPsi  = fmt1(rnd(5.0, 6.8));
  const eBattPct = rndI(35, 98);
  return {
    frontTyre:   { psi: frontPsi,  status: frontPsi > 6.0 ? 'Optimal' : 'Check Soon', color: frontPsi > 6.0 ? 'text-green-400' : 'text-amber-400', barColor: frontPsi > 6.0 ? 'bg-cyan-400' : 'bg-amber-400', pct: Math.round((frontPsi / 9) * 100) },
    rearTyre:    { psi: rearPsi,   status: rearPsi  > 5.5 ? 'Optimal' : 'Check Soon', color: rearPsi  > 5.5 ? 'text-green-400' : 'text-amber-400', barColor: rearPsi  > 5.5 ? 'bg-cyan-400' : 'bg-amber-400', pct: Math.round((rearPsi  / 9) * 100) },
    sealantFront: { level: `${rndI(60,95)}%`, status: 'Good' },
    sealantRear:  { level: `${rndI(20,55)}%`, status: rndI(0,1) === 0 ? 'Low' : 'Good' },
    eBattery:     { pct: eBattPct, range: rndI(30, 90), assistMode: pick(['ECO','ECO+','TOUR','SPORT']), status: eBattPct > 50 ? 'Good' : 'Low' },
    motorTemp:    rndI(28, 62),
    serviceKm:   rndI(200, 900),
    totalKm:     `${rndI(1100, 2800).toLocaleString()} km`,
  };
}

function buildAdminStats() {
  return {
    // Club admin
    club: {
      activeMembers: rndI(28, 84),
      pendingRenewals: rndI(2, 12),
      avgHcp: fmt1(rnd(2.8, 5.2)),
      eventsThisMonth: rndI(3, 9),
      complianceScore: rndI(78, 98),
      safetyIncidents: rndI(0, 5),
    },
    // Regional
    regional: {
      clubs: rndI(8, 22),
      activeRiders: rndI(300, 1200),
      complianceRate: rndI(72, 97),
      incidentRate: fmt1(rnd(0.2, 1.8)),
      belowThreshold: rndI(0, 4),
    },
    // Federation
    federation: {
      affiliatedClubs: rndI(110, 210),
      registeredRiders: rndI(8000, 22000),
      complianceSubmitted: rndI(60, 95),
      eventsScheduled: rndI(12, 44),
      avgHcp: fmt1(rnd(3.2, 4.8)),
    },
    // International
    international: {
      federations: rndI(22, 48),
      totalRiders: rndI(80000, 250000),
      worldEvents: rndI(8, 24),
      governanceAlerts: rndI(0, 6),
    },
    // SuperAdmin
    super: {
      tenants: rndI(38, 68),
      apiLatency: rndI(80, 280),
      uptimePct: fmt1(rnd(99.1, 99.98)),
      dailyActiveUsers: rndI(1200, 8000),
      storageUsedTB: fmt1(rnd(1.2, 8.8)),
      webhooksPerMin: rndI(120, 1800),
      errorRate: fmt1(rnd(0.01, 0.35)),
    },
  };
}

// ── Build the full initial snapshot ──────────────────────────────────────────
function buildSnapshot() {
  return {
    rideHistory:     buildRideHistory(),
    recentRides:     buildRecentRides(),
    todaySummary: {
      distance: fmt1(rnd(8, 72)),
      duration: `${rndI(0,3)}:${String(rndI(10,59)).padStart(2,'0')}`,
      avgSpeed: fmt1(rnd(16, 38)),
      calories: rndI(300, 900),
    },
    safetyIncidents: buildSafetyIncidents(),
    beaconWatchers:  buildBeaconWatchers(),
    clubLeaderboard: buildClubLeaderboard(),
    trainingLog:     buildTrainingLog(),
    trainingLoad: {
      tss7:  rndI(280, 620),
      ctl:   rndI(48, 88),
      atl:   rndI(55, 100),
      tsb:   rndI(-25, 10),
    },
    sensors:     buildSensors(),
    bikeMetrics: buildBikeMetrics(),
    adminStats:  buildAdminStats(),
  };
}

// ── Provider ──────────────────────────────────────────────────────────────────
export function DemoProvider({ children }) {
  const [demoMode, setDemoMode] = useState(false);
  const [data, setData] = useState(() => buildSnapshot());

  const regenerate = useCallback(() => setData(buildSnapshot()), []);

  // When demo mode is enabled, regenerate fresh data
  const enableDemo = useCallback(() => {
    setData(buildSnapshot());
    setDemoMode(true);
  }, []);

  const disableDemo = useCallback(() => setDemoMode(false), []);
  const toggleDemo  = useCallback(() => (demoMode ? disableDemo() : enableDemo()), [demoMode, enableDemo, disableDemo]);

  return (
    <DemoContext.Provider value={{ demoMode, toggleDemo, data, regenerate }}>
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error('useDemo must be used within DemoProvider');
  return ctx;
}