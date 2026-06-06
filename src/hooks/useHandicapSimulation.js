import { useState, useEffect, useRef, useCallback } from 'react';

// ── Deterministic helpers ───────────────────────────────────────────────────
const rand   = (min, max)   => Math.random() * (max - min) + min;
const randInt = (min, max)  => Math.floor(rand(min, max + 1));
const jitter  = (base, pct) => +(base * (1 + (Math.random() - 0.5) * pct)).toFixed(1);
const clamp   = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const fmt1    = v => v.toFixed(1);
const fmt0    = v => Math.round(v).toString();

// ── Category helper ─────────────────────────────────────────────────────────
export function hcpCategory(hcp) {
  if (hcp <= 1.5) return 'Elite';
  if (hcp <= 3.5) return 'A';
  if (hcp <= 6.0) return 'B';
  if (hcp <= 9.0) return 'C';
  return 'D';
}

// ── Build 12-week trend from a current HCP ──────────────────────────────────
function buildTrend(currentHcp) {
  const start = clamp(currentHcp + rand(1.5, 2.5), 2.5, 9.0);
  const trend = [];
  let v = start;
  for (let i = 0; i < 12; i++) {
    const label = `W${i + 1}`;
    if (i === 11) { trend.push({ w: label, hcp: +currentHcp.toFixed(1) }); break; }
    trend.push({ w: label, hcp: +v.toFixed(1) });
    // generally descend with occasional bump
    v = clamp(v + (Math.random() < 0.15 ? rand(0.1, 0.4) : -rand(0.1, 0.5)), 1.0, 9.5);
  }
  return trend;
}

// ── Club leaderboard (you always at position 2–4) ───────────────────────────
const RIDER_NAMES = [
  'Alex T.', 'Sarah C.', 'Marcus W.', 'Priya N.', 'Tom B.', 'Lucy M.', 'James H.',
];
function buildClub(yourHcp) {
  const others = RIDER_NAMES.map((name, i) => ({
    name,
    hcp: +clamp(yourHcp + rand(-2.0, 3.5), 0.8, 9.5).toFixed(1),
    highlight: false,
  }));
  others.sort((a, b) => a.hcp - b.hcp);
  // insert "You" just above median
  const insertAt = clamp(Math.floor(others.length / 2) - 1, 0, others.length);
  others.splice(insertAt, 0, { name: 'You', hcp: +yourHcp.toFixed(1), highlight: true });
  return others.map(r => ({ ...r, category: hcpCategory(r.hcp) }));
}

// ── Generate a full sim snapshot ─────────────────────────────────────────────
export function generateSnapshot(profile) {
  const { age, gender, bodyMass, height } = profile;

  // Physiological baseline influenced by profile
  const ageModifier   = clamp((age - 30) * 0.04, -0.4, 1.2);
  const genderBase    = gender === 'Female' ? 0.2 : gender === 'Non-binary' ? 0.1 : 0;
  const restingHR     = clamp(randInt(50, 72) + Math.round(ageModifier * 5), 45, 85);
  const systolic      = clamp(randInt(108, 132) + Math.round(ageModifier * 3), 105, 145);
  const diastolic     = clamp(randInt(68, 84),  60,  95);
  const glucose       = +clamp(rand(4.2, 5.8) + ageModifier * 0.1, 3.9, 7.0).toFixed(1);
  const spo2          = clamp(randInt(96, 99), 94, 100);
  const bmi           = height > 0 ? +((bodyMass / ((height / 100) ** 2))).toFixed(1) : 22.4;

  // Behavioural scores
  const consistency   = randInt(72, 96);
  const planAdherence = randInt(68, 94);
  const sleepScore    = randInt(58, 88);
  const restDays      = `${randInt(2, 4)}/4`;
  const nutritionConnected = Math.random() > 0.5;

  // Real-time telemetry
  const hrv   = randInt(42, 88);
  const power = randInt(160, 310);
  const cadence = randInt(78, 102);
  const speed   = +(rand(18, 38)).toFixed(1);
  const gradient= +(rand(-3, 12)).toFixed(1);
  const temp    = +(rand(10, 32)).toFixed(1);
  const wind    = +(rand(0, 35)).toFixed(1);
  const coreTemp= +(rand(36.8, 38.2)).toFixed(1);
  const powerHR = +(power / clamp(randInt(130, 175), 100, 200)).toFixed(2);

  // Composite HCP (lower is better)
  const physioScore  = clamp(100 - (restingHR - 45) * 0.8 - (systolic - 105) * 0.3 - ageModifier * 8, 30, 100);
  const behScore     = (consistency + planAdherence + sleepScore) / 3;
  const rtScore      = clamp(80 - (hrv < 50 ? 15 : 0) - (gradient > 8 ? 5 : 0), 40, 100);
  const envScore     = clamp(100 - (wind > 20 ? 10 : 0) - (temp > 28 ? 8 : 0) - (gradient > 6 ? 5 : 0), 50, 100);

  const rawHcp = clamp(
    10 - (physioScore * 0.28 + behScore * 0.32 + rtScore * 0.22 + envScore * 0.18) / 10
      + ageModifier * 0.3 + genderBase,
    0.5, 9.9,
  );
  const hcp = +rawHcp.toFixed(1);
  const hcpWeekChange = +(rand(-0.4, 0.1)).toFixed(1);

  // Assist overlay
  const groupAvgHcp  = +clamp(hcp + rand(-0.8, 1.5), 0.5, 9.5).toFixed(1);
  const delta        = +(hcp - groupAvgHcp).toFixed(1);
  const assistLevels = ['Off', 'ECO', 'ECO+', 'TOUR', 'SPORT', 'TURBO'];
  const assistIdx    = clamp(Math.round(3 + delta), 0, 5);
  const suggestedAssist = assistLevels[assistIdx];

  // Assist triggers
  const triggers = [];
  if (power > 260)               triggers.push({ type: 'spike',    label: 'Performance spike detected',   color: 'text-red-400' });
  if (Math.abs(delta) < 0.3)    triggers.push({ type: 'fair',     label: 'Group effort equalised ✓',     color: 'text-green-400' });
  if (delta > 0.8)               triggers.push({ type: 'adjust',   label: 'Assist increase recommended',   color: 'text-amber-400' });

  return {
    hcp, hcpWeekChange, hcpCategory: hcpCategory(hcp),
    trend: buildTrend(hcp),
    clubDist: buildClub(hcp),

    // factors
    physioScore: Math.round(physioScore),
    behScore:    Math.round(behScore),
    rtScore:     Math.round(rtScore),
    envScore:    Math.round(envScore),

    // physio
    restingHR, systolic, diastolic, glucose, spo2, bmi,

    // behavioural
    consistency, planAdherence, sleepScore, restDays, nutritionConnected,

    // realtime
    hrv, power, cadence, speed, gradient, temp, wind, coreTemp, powerHR,

    // assist
    groupAvgHcp, delta, suggestedAssist, assistLevels, assistIdx, triggers,
  };
}

// ── Default rider profile ────────────────────────────────────────────────────
export const DEFAULT_PROFILE = {
  name: 'Jackie R.',
  age: 34,
  gender: 'Female',
  bodyMass: 67,
  height: 168,
  ridingStyle: 'Endurance',
  riskProfile: 'Moderate',
  terrainPref: 'Mixed',
  fatiguePattern: 'Mid-week dip',
};

// ── The hook ─────────────────────────────────────────────────────────────────
export default function useHandicapSimulation() {
  const [profile, setProfile]       = useState(DEFAULT_PROFILE);
  const [snapshot, setSnapshot]     = useState(() => generateSnapshot(DEFAULT_PROFILE));
  const [running,  setRunning]       = useState(false);
  const [tick,     setTick]          = useState(0);
  const intervalRef = useRef(null);

  // Regenerate whenever profile changes
  const regenerate = useCallback((p = profile) => {
    setSnapshot(generateSnapshot(p));
    setTick(t => t + 1);
  }, [profile]);

  // Reset to defaults
  const reset = useCallback(() => {
    setProfile(DEFAULT_PROFILE);
    setSnapshot(generateSnapshot(DEFAULT_PROFILE));
    setRunning(false);
    setTick(0);
  }, []);

  // Live simulation tick (every 2s, only updates realtime fields)
  useEffect(() => {
    if (!running) { clearInterval(intervalRef.current); return; }
    intervalRef.current = setInterval(() => {
      setSnapshot(prev => {
        const hrv     = clamp(prev.hrv     + randInt(-3, 3),  35, 95);
        const power   = clamp(prev.power   + randInt(-15, 15), 80, 380);
        const cadence = clamp(prev.cadence + randInt(-3, 3),  60, 115);
        const speed   = +clamp(prev.speed  + rand(-1.5, 1.5), 12, 45).toFixed(1);
        const gradient= +clamp(prev.gradient + rand(-0.8, 0.8), -5, 15).toFixed(1);
        const wind    = +clamp(prev.wind   + rand(-2, 2), 0, 45).toFixed(1);
        const coreTemp= +clamp(prev.coreTemp + rand(-0.1, 0.1), 36.5, 38.5).toFixed(1);
        const powerHR = +(power / clamp(randInt(130, 175), 100, 200)).toFixed(2);
        const delta   = prev.delta;

        // Assist triggers
        const triggers = [];
        if (power > 260)           triggers.push({ type: 'spike',  label: 'Performance spike detected',  color: 'text-red-400' });
        if (Math.abs(delta) < 0.3) triggers.push({ type: 'fair',   label: 'Group effort equalised ✓',    color: 'text-green-400' });
        if (delta > 0.8)           triggers.push({ type: 'adjust', label: 'Assist increase recommended',  color: 'text-amber-400' });

        return { ...prev, hrv, power, cadence, speed, gradient, wind, coreTemp, powerHR, triggers };
      });
      setTick(t => t + 1);
    }, 2000);
    return () => clearInterval(intervalRef.current);
  }, [running]);

  return { profile, setProfile, snapshot, running, setRunning, regenerate, reset, tick };
}