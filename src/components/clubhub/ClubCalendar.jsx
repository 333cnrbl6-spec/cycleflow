import { useState } from 'react';
import { Plus, X, MapPin, Clock, ChevronLeft, ChevronRight, CheckCircle, Users, BarChart2 } from 'lucide-react';
import SectionLabel from '@/components/ui/SectionLabel';

// ── Difficulty config ────────────────────────────────────────────────────────
const DIFFICULTY = {
  easy:   { label: 'Easy',   color: 'bg-green-500/10 text-green-400 border-green-500/20',  dot: 'bg-green-400' },
  moderate:{ label: 'Moderate', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20', dot: 'bg-amber-400' },
  hard:   { label: 'Hard',   color: 'bg-red-500/10 text-red-400 border-red-500/20',        dot: 'bg-red-400' },
};

// ── Seed rides for June 2026 ─────────────────────────────────────────────────
const SEED_RIDES = [
  { id: 1,  day: 7,  time: '08:00', title: 'Sunday Club Ride',       location: 'Town Hall Car Park',     difficulty: 'moderate', distance: '65 km', rsvps: ['Alex','Sarah','Marcus'], maxRiders: 20 },
  { id: 2,  day: 10, time: '18:30', title: 'Tuesday Evening Spin',    location: 'Velodrome Car Park',     difficulty: 'hard',     distance: '45 km', rsvps: ['Priya','Tom'],           maxRiders: 15 },
  { id: 3,  day: 14, time: '09:00', title: 'Beginner Welcome Ride',   location: 'Community Centre',       difficulty: 'easy',     distance: '22 km', rsvps: ['Sarah','Marcus','Priya','Alex'], maxRiders: 30 },
  { id: 4,  day: 21, time: '07:30', title: 'Hill Climb Session',      location: 'Ridgeway Start Line',    difficulty: 'hard',     distance: '38 km', rsvps: ['Alex','Tom'],            maxRiders: 25 },
  { id: 5,  day: 28, time: '07:00', title: 'Summer Sportive Prep',    location: 'Club HQ',               difficulty: 'moderate', distance: '80 km', rsvps: ['Sarah','Marcus'],         maxRiders: 40 },
];

// ── Calendar helpers ─────────────────────────────────────────────────────────
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAY_LABELS  = ['Mo','Tu','We','Th','Fr','Sa','Su'];

function getDaysInMonth(year, month) { return new Date(year, month + 1, 0).getDate(); }
// getDay returns 0=Sun; we want 0=Mon
function firstDayOffset(year, month) { return (new Date(year, month, 1).getDay() + 6) % 7; }

// ── Empty form state ─────────────────────────────────────────────────────────
const EMPTY_FORM = { title: '', date: '', time: '08:00', location: '', difficulty: 'moderate', distance: '', maxRiders: 20, notes: '' };

// ─────────────────────────────────────────────────────────────────────────────
export default function ClubCalendar() {
  const [year, setYear]           = useState(2026);
  const [month, setMonth]         = useState(5); // June = 5
  const [rides, setRides]         = useState(SEED_RIDES);
  const [rsvpd, setRsvpd]         = useState(new Set([1]));
  const [showCreate, setShowCreate] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedRide, setSelectedRide] = useState(null);
  const [form, setForm]           = useState(EMPTY_FORM);

  // ── Navigation ─────────────────────────────────────────────────────────────
  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); setSelectedDay(null); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); setSelectedDay(null); };

  // ── RSVP ───────────────────────────────────────────────────────────────────
  const toggleRsvp = (id) => setRsvpd(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });

  // ── Create ride ────────────────────────────────────────────────────────────
  const submitRide = () => {
    if (!form.title || !form.date || !form.location) return;
    const [y, m, d] = form.date.split('-').map(Number);
    const newRide = {
      id: Date.now(),
      day: d,
      _month: m - 1,
      _year: y,
      time: form.time,
      title: form.title,
      location: form.location,
      difficulty: form.difficulty,
      distance: form.distance || null,
      rsvps: [],
      maxRiders: Number(form.maxRiders) || 20,
      notes: form.notes,
    };
    setRides(r => [...r, newRide]);
    setForm(EMPTY_FORM);
    setShowCreate(false);
    setMonth(m - 1);
    setYear(y);
    setSelectedDay(d);
  };

  // ── Data for current month ─────────────────────────────────────────────────
  const monthRides = rides.filter(r => {
    if (r._month !== undefined) return r._month === month && r._year === year;
    return month === 5 && year === 2026; // seed rides are June 2026
  });
  const ridesOnDay = (d) => monthRides.filter(r => r.day === d);

  const days = getDaysInMonth(year, month);
  const offset = firstDayOffset(year, month);

  const dayRides = selectedDay ? ridesOnDay(selectedDay) : [];

  return (
    <div className="space-y-5">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="btn-icon w-8 h-8"><ChevronLeft className="w-4 h-4" /></button>
          <span className="text-sm font-bold text-foreground w-36 text-center">{MONTH_NAMES[month]} {year}</span>
          <button onClick={nextMonth} className="btn-icon w-8 h-8"><ChevronRight className="w-4 h-4" /></button>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="btn-primary py-2 px-4 text-xs"
        >
          <Plus className="w-3.5 h-3.5" /> Schedule Ride
        </button>
      </div>

      {/* ── Calendar Grid ─────────────────────────────────────────────────── */}
      <div className="glass-card rounded-xl border border-white/[0.06] p-4">
        {/* Day labels */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAY_LABELS.map(d => (
            <div key={d} className="text-center text-[10px] font-bold text-muted-foreground py-1">{d}</div>
          ))}
        </div>
        {/* Day cells */}
        <div className="grid grid-cols-7 gap-1">
          {/* Leading empty cells */}
          {Array.from({ length: offset }, (_, i) => <div key={`e-${i}`} />)}
          {/* Day cells */}
          {Array.from({ length: days }, (_, i) => {
            const day = i + 1;
            const dayR = ridesOnDay(day);
            const isToday = false; // static demo
            const isSelected = selectedDay === day;
            return (
              <button
                key={day}
                onClick={() => setSelectedDay(isSelected ? null : day)}
                aria-label={`${day} ${MONTH_NAMES[month]}, ${dayR.length} ride${dayR.length !== 1 ? 's' : ''}`}
                className={`relative rounded-lg flex flex-col items-center justify-start pt-1.5 pb-1 min-h-[48px] sm:min-h-[56px] transition-all text-xs
                  ${isSelected
                    ? 'bg-blue-500/20 border border-blue-500/40 text-blue-400 font-bold'
                    : dayR.length
                      ? 'bg-white/[0.04] border border-white/10 hover:border-blue-500/30 hover:bg-blue-500/10 text-foreground font-medium cursor-pointer'
                      : 'text-muted-foreground hover:bg-white/[0.03] border border-transparent cursor-pointer'
                  }`}
              >
                <span>{day}</span>
                {/* Difficulty dots for rides on this day */}
                {dayR.length > 0 && (
                  <div className="flex gap-0.5 mt-1 flex-wrap justify-center">
                    {dayR.slice(0, 3).map(r => (
                      <span key={r.id} className={`w-1.5 h-1.5 rounded-full ${DIFFICULTY[r.difficulty]?.dot ?? 'bg-blue-400'}`} />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>
        {/* Legend */}
        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border/40">
          {Object.entries(DIFFICULTY).map(([k, v]) => (
            <div key={k} className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${v.dot}`} />
              <span className="text-[10px] text-muted-foreground">{v.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Day rides panel ─────────────────────────────────────────────────── */}
      {selectedDay && (
        <div className="space-y-3 page-enter">
          <SectionLabel
            accent="blue"
            label={`${selectedDay} ${MONTH_NAMES[month]} — ${dayRides.length} Ride${dayRides.length !== 1 ? 's' : ''}`}
          />
          {dayRides.length === 0 && (
            <div className="glass-card rounded-xl border border-dashed border-white/10 p-8 text-center">
              <p className="text-sm text-muted-foreground">No rides on this day.</p>
              <button onClick={() => setShowCreate(true)} className="btn-primary mt-3 text-xs">
                <Plus className="w-3.5 h-3.5" /> Schedule a ride
              </button>
            </div>
          )}
          {dayRides.map(ride => (
            <RideCard
              key={ride.id}
              ride={ride}
              isRsvpd={rsvpd.has(ride.id)}
              onRsvp={() => toggleRsvp(ride.id)}
              onExpand={() => setSelectedRide(ride.id === selectedRide ? null : ride.id)}
              expanded={selectedRide === ride.id}
            />
          ))}
        </div>
      )}

      {/* ── Upcoming rides (if no day selected) ─────────────────────────────── */}
      {!selectedDay && (
        <div className="space-y-3">
          <SectionLabel accent="violet" label="Upcoming Rides This Month" />
          {monthRides.length === 0 && (
            <div className="glass-card rounded-xl border border-dashed border-white/10 p-8 text-center">
              <p className="text-sm text-muted-foreground">No rides scheduled this month.</p>
              <button onClick={() => setShowCreate(true)} className="btn-primary mt-3 text-xs">
                <Plus className="w-3.5 h-3.5" /> Schedule the first one
              </button>
            </div>
          )}
          <div className="space-y-2.5">
            {[...monthRides].sort((a, b) => a.day - b.day).map(ride => (
              <RideCard
                key={ride.id}
                ride={ride}
                isRsvpd={rsvpd.has(ride.id)}
                onRsvp={() => toggleRsvp(ride.id)}
                onExpand={() => setSelectedRide(ride.id === selectedRide ? null : ride.id)}
                expanded={selectedRide === ride.id}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Create Ride Modal ────────────────────────────────────────────────── */}
      {showCreate && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
          onClick={e => e.target === e.currentTarget && setShowCreate(false)}
        >
          <div className="bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl page-enter max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border sticky top-0 bg-card z-10">
              <h3 className="text-sm font-bold text-foreground">Schedule Group Ride</h3>
              <button onClick={() => setShowCreate(false)} className="btn-icon w-8 h-8">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {/* Title */}
              <div>
                <label className="cf-label">Ride Name *</label>
                <input
                  className="cf-input"
                  placeholder="e.g. Saturday Club Ride"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                />
              </div>
              {/* Date + Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="cf-label">Date *</label>
                  <input
                    type="date"
                    className="cf-input"
                    value={form.date}
                    onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="cf-label">Start Time</label>
                  <input
                    type="time"
                    className="cf-input"
                    value={form.time}
                    onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
                  />
                </div>
              </div>
              {/* Location */}
              <div>
                <label className="cf-label">Starting Location *</label>
                <input
                  className="cf-input"
                  placeholder="e.g. Town Hall Car Park"
                  value={form.location}
                  onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                />
              </div>
              {/* Difficulty */}
              <div>
                <label className="cf-label">Difficulty</label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(DIFFICULTY).map(([k, v]) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, difficulty: k }))}
                      aria-pressed={form.difficulty === k}
                      className={`py-2.5 rounded-lg border text-xs font-semibold transition-all ${
                        form.difficulty === k ? v.color : 'border-white/10 bg-white/5 text-muted-foreground hover:border-white/20'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full inline-block mr-1.5 ${v.dot}`} />
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>
              {/* Distance + Max riders */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="cf-label">Distance (optional)</label>
                  <input
                    className="cf-input"
                    placeholder="e.g. 50 km"
                    value={form.distance}
                    onChange={e => setForm(f => ({ ...f, distance: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="cf-label">Max Riders</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    className="cf-input"
                    value={form.maxRiders}
                    onChange={e => setForm(f => ({ ...f, maxRiders: e.target.value }))}
                  />
                </div>
              </div>
              {/* Notes */}
              <div>
                <label className="cf-label">Notes (optional)</label>
                <textarea
                  className="cf-textarea h-16"
                  placeholder="Any extra info — route highlights, café stop, kit requirements…"
                  value={form.notes}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                />
              </div>
              <button
                onClick={submitRide}
                disabled={!form.title || !form.date || !form.location}
                className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Schedule Ride
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Individual ride card ─────────────────────────────────────────────────────
function RideCard({ ride, isRsvpd, onRsvp, onExpand, expanded }) {
  const diff = DIFFICULTY[ride.difficulty] ?? DIFFICULTY.moderate;
  const full = ride.rsvps.length >= ride.maxRiders;

  return (
    <div className={`glass-card rounded-xl border transition-all ${
      expanded ? 'border-blue-500/30' : 'border-white/[0.06] hover:border-blue-500/20'
    }`}>
      {/* Main row */}
      <div
        className="p-4 cursor-pointer"
        onClick={onExpand}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${diff.color}`}>{diff.label}</span>
              {isRsvpd && (
                <span className="flex items-center gap-1 text-[10px] text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded-full">
                  <CheckCircle className="w-2.5 h-2.5" /> RSVP'd
                </span>
              )}
              {full && !isRsvpd && (
                <span className="text-[10px] text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded-full">Full</span>
              )}
            </div>
            <p className="text-sm font-semibold text-foreground leading-snug">{ride.title}</p>
            <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{ride.time}</span>
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{ride.location}</span>
              {ride.distance && <span className="flex items-center gap-1"><BarChart2 className="w-3 h-3" />{ride.distance}</span>}
              <span className="flex items-center gap-1"><Users className="w-3 h-3" />{ride.rsvps.length}/{ride.maxRiders}</span>
            </div>
          </div>
          <button
            onClick={e => { e.stopPropagation(); onRsvp(); }}
            disabled={full && !isRsvpd}
            className={`flex-shrink-0 px-3 py-2 rounded-lg border text-xs font-semibold transition-all min-h-[36px] ${
              isRsvpd
                ? 'border-green-500/30 bg-green-500/10 text-green-400 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400'
                : full
                  ? 'border-white/10 text-muted-foreground cursor-not-allowed opacity-50'
                  : 'border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20'
            }`}
          >
            {isRsvpd ? 'Cancel' : full ? 'Full' : 'RSVP'}
          </button>
        </div>

        {/* Capacity bar */}
        <div className="mt-3">
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                ride.rsvps.length / ride.maxRiders > 0.85 ? 'bg-red-400' :
                ride.rsvps.length / ride.maxRiders > 0.6  ? 'bg-amber-400' : 'bg-blue-400'
              }`}
              style={{ width: `${Math.min((ride.rsvps.length / ride.maxRiders) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-border/40 pt-3 page-enter">
          {ride.notes && (
            <p className="text-xs text-muted-foreground leading-relaxed">{ride.notes}</p>
          )}
          {/* Map placeholder */}
          <div
            className="h-28 rounded-lg bg-[#0a1628] border border-blue-500/20 flex items-center justify-center"
            style={{ backgroundImage: 'linear-gradient(#1e40af12 1px, transparent 1px), linear-gradient(90deg, #1e40af12 1px, transparent 1px)', backgroundSize: '20px 20px' }}
          >
            <div className="text-center">
              <MapPin className="w-5 h-5 text-blue-400/40 mx-auto mb-1" />
              <p className="text-[10px] text-muted-foreground">{ride.location}</p>
            </div>
          </div>
          {/* Rider avatars */}
          {ride.rsvps.length > 0 && (
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-bold mb-2">Going ({ride.rsvps.length})</p>
              <div className="flex items-center gap-1.5 flex-wrap">
                {ride.rsvps.map((name, i) => (
                  <div key={i} className="flex items-center gap-1 text-[10px] bg-white/5 border border-white/10 rounded-full px-2 py-0.5 text-muted-foreground">
                    <span className="w-3.5 h-3.5 rounded-full bg-blue-500/30 text-blue-400 flex items-center justify-center text-[8px] font-bold">{name[0]}</span>
                    {name}
                  </div>
                ))}
                {isRsvpd && <div className="flex items-center gap-1 text-[10px] bg-green-500/10 border border-green-500/20 rounded-full px-2 py-0.5 text-green-400"><span className="w-3.5 h-3.5 rounded-full bg-green-500/30 flex items-center justify-center text-[8px] font-bold">Y</span>You</div>}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}