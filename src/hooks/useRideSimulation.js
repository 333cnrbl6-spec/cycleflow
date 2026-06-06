import { useState, useEffect, useRef, useCallback } from 'react';

const rnd  = (lo, hi) => Math.random() * (hi - lo) + lo;
const rndI = (lo, hi) => Math.floor(rnd(lo, hi + 1));
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const fmt1  = v => +v.toFixed(1);

// Simulated route waypoints (normalised 0-1 coords)
const ROUTE_PATH = [
  [0.15, 0.80], [0.20, 0.65], [0.28, 0.55], [0.35, 0.45],
  [0.45, 0.38], [0.55, 0.32], [0.62, 0.40], [0.70, 0.52],
  [0.75, 0.62], [0.80, 0.55], [0.85, 0.42], [0.88, 0.30],
];

const SEGMENTS = [
  { name: 'Park Rise',       startPct: 0.12, endPct: 0.25, komTime: 92  },
  { name: 'Hilltop Sprint',  startPct: 0.40, endPct: 0.55, komTime: 68  },
  { name: 'Valley Descent',  startPct: 0.68, endPct: 0.82, komTime: 55  },
];

const SAFETY_EVENTS = [
  { t: 0.10, type: 'near_miss',  msg: 'Near-miss — vehicle passed close' },
  { t: 0.32, type: 'hazard',     msg: 'Road hazard detected ahead' },
  { t: 0.61, type: 'near_miss',  msg: 'Near-miss — pedestrian crossover' },
  { t: 0.80, type: 'incident',   msg: 'Sudden braking incident logged' },
];

const ASSIST_EVENTS = [
  { t: 0.18, msg: 'Assist increased for fairness',              type: 'boost'  },
  { t: 0.45, msg: 'Assist reduced — performance spike detected',type: 'reduce' },
  { t: 0.72, msg: 'Fair overtake enabled',                      type: 'fair'   },
];

function lerp(a, b, t) { return a + (b - a) * t; }

function interpolatePos(pct) {
  const steps = ROUTE_PATH.length - 1;
  const idx = Math.min(Math.floor(pct * steps), steps - 1);
  const local = (pct * steps) - idx;
  const [ax, ay] = ROUTE_PATH[idx];
  const [bx, by] = ROUTE_PATH[idx + 1] || ROUTE_PATH[idx];
  return [lerp(ax, bx, local), lerp(ay, by, local)];
}

export function useRideSimulation(active) {
  const [state, setState] = useState({
    speed:    0,
    hr:       0,
    power:    0,
    cadence:  0,
    gradient: 0,
    distance: 0,
    elapsed:  0,  // seconds
    hcp:      fmt1(rnd(3.2, 5.4)),
    battery:  rndI(72, 98),
    range:    rndI(45, 90),
    position: [0.15, 0.80],
    paused:   false,
    autoPaused: false,
    progress: 0,   // 0-1
    safetyAlerts: [],
    assistMessage: null,
    activeSegment: null,
    segmentProgress: 0,
    finishedSegment: null,
  });

  const tickRef = useRef(null);
  const progressRef = useRef(0);
  const firedSafetyRef = useRef(new Set());
  const firedAssistRef = useRef(new Set());
  const firedSegRef    = useRef(new Set());
  const lastSegRef     = useRef(null);

  const tick = useCallback(() => {
    setState(prev => {
      if (prev.paused) return prev;

      const newProgress = clamp(progressRef.current + 0.0008, 0, 1);
      progressRef.current = newProgress;

      // Speed varies with a sine wave + noise
      const baseSpeed = 22 + Math.sin(newProgress * Math.PI * 8) * 6 + rnd(-1, 1);
      const speed = fmt1(clamp(baseSpeed, 6, 45));
      const autoPaused = speed < 5;

      const hr      = rndI(138, 172);
      const power   = rndI(180, 290);
      const cadence = rndI(82, 98);
      const gradient = fmt1(Math.sin(newProgress * Math.PI * 5) * 4 + rnd(-0.5, 0.5));
      const distance = fmt1(newProgress * 38.1);
      const elapsed  = prev.elapsed + (autoPaused ? 0 : 1);
      const hcp      = fmt1(clamp(prev.hcp + rnd(-0.05, 0.05), 2.0, 7.0));
      const position = interpolatePos(newProgress);

      // Safety alerts
      const safetyAlerts = [...prev.safetyAlerts];
      for (const ev of SAFETY_EVENTS) {
        if (newProgress >= ev.t && !firedSafetyRef.current.has(ev.t)) {
          firedSafetyRef.current.add(ev.t);
          safetyAlerts.push({ ...ev, id: Date.now(), acknowledged: false });
        }
      }

      // Assist messages
      let assistMessage = prev.assistMessage;
      for (const ev of ASSIST_EVENTS) {
        if (newProgress >= ev.t && !firedAssistRef.current.has(ev.t)) {
          firedAssistRef.current.add(ev.t);
          assistMessage = { ...ev, shownAt: Date.now() };
        }
      }
      // Auto-clear after 4 seconds
      if (assistMessage && Date.now() - assistMessage.shownAt > 4000) {
        assistMessage = null;
      }

      // Segment logic
      let activeSegment = null;
      let segmentProgress = 0;
      let finishedSegment = prev.finishedSegment;

      for (const seg of SEGMENTS) {
        if (newProgress >= seg.startPct && newProgress <= seg.endPct) {
          const localPct = (newProgress - seg.startPct) / (seg.endPct - seg.startPct);
          activeSegment = seg;
          segmentProgress = localPct;
          lastSegRef.current = seg.name;
          break;
        }
      }

      // Segment finish
      if (!activeSegment && lastSegRef.current) {
        const seg = SEGMENTS.find(s => s.name === lastSegRef.current);
        if (seg && newProgress > seg.endPct && !firedSegRef.current.has(seg.name)) {
          firedSegRef.current.add(seg.name);
          const yourTime = rndI(seg.komTime + 5, seg.komTime + 40);
          finishedSegment = {
            name: seg.name,
            yourTime,
            komTime: seg.komTime,
            rank: rndI(3, 18),
            shownAt: Date.now(),
          };
        }
        lastSegRef.current = null;
      }
      if (finishedSegment && Date.now() - finishedSegment.shownAt > 5000) {
        finishedSegment = null;
      }

      return {
        ...prev,
        speed, hr, power, cadence, gradient, distance, elapsed,
        hcp, position, autoPaused,
        progress: newProgress,
        safetyAlerts,
        assistMessage,
        activeSegment,
        segmentProgress,
        finishedSegment,
      };
    });
  }, []);

  useEffect(() => {
    if (active) {
      progressRef.current = 0;
      firedSafetyRef.current.clear();
      firedAssistRef.current.clear();
      firedSegRef.current.clear();
      lastSegRef.current = null;
      // warm-start values
      setState(s => ({ ...s, speed: 24, hr: 145, power: 210, cadence: 88, elapsed: 0, distance: 0, progress: 0, safetyAlerts: [] }));
      tickRef.current = setInterval(tick, 1000);
    } else {
      clearInterval(tickRef.current);
    }
    return () => clearInterval(tickRef.current);
  }, [active, tick]);

  const setPaused = useCallback(paused => setState(s => ({ ...s, paused })), []);

  const acknowledgeAlert = useCallback(id => {
    setState(s => ({
      ...s,
      safetyAlerts: s.safetyAlerts.map(a => a.id === id ? { ...a, acknowledged: true } : a),
    }));
  }, []);

  const clearAlerts = useCallback(() => {
    setState(s => ({ ...s, safetyAlerts: [] }));
  }, []);

  return { state, setPaused, acknowledgeAlert, clearAlerts };
}

export function formatElapsed(secs) {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  if (h > 0) return `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

export function effortZone(power) {
  if (power < 150) return 'easy';
  if (power < 210) return 'tempo';
  if (power < 270) return 'threshold';
  return 'max';
}

export { ROUTE_PATH };