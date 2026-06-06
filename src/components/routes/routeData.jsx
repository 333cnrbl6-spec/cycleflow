// ─── Shared simulated data & helpers for the Routes module ───────────────────

export const SURFACE_COLORS = {
  Road:    { text: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/20' },
  Gravel:  { text: 'text-amber-400',  bg: 'bg-amber-500/10',  border: 'border-amber-500/20' },
  Mixed:   { text: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
  Mountain:{ text: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/20' },
};

export const DIFFICULTY_COLORS = {
  Easy:    { text: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/20' },
  Moderate:{ text: 'text-amber-400',  bg: 'bg-amber-500/10',  border: 'border-amber-500/20' },
  Hard:    { text: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
  Expert:  { text: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/20' },
  Extreme: { text: 'text-red-400',    bg: 'bg-red-500/20',    border: 'border-red-500/40' },
};

// Generate a simulated elevation profile (n points)
export const genElevProfile = (seed, points = 40) => {
  const base = 60 + (seed % 5) * 40;
  let e = base;
  return Array.from({ length: points }, (_, i) => {
    e += (Math.sin(i * 0.4 + seed) * 18) + (Math.random() - 0.5) * 12;
    e = Math.max(20, Math.min(900, e));
    const km = ((i / (points - 1)) * (15 + (seed % 60))).toFixed(1);
    return { d: `${km}km`, e: Math.round(e) };
  });
};

export const DEMO_WAYPOINTS = [
  { id: 'wp-1', label: 'Start — Town Centre',    lat: 51.505, lng: -0.09,  type: 'start' },
  { id: 'wp-2', label: 'Waypoint A — Park Gates', lat: 51.515, lng: -0.085, type: 'via' },
  { id: 'wp-3', label: 'Waypoint B — Hill Top',   lat: 51.52,  lng: -0.07,  type: 'via' },
  { id: 'wp-4', label: 'Waypoint C — Reservoir',  lat: 51.518, lng: -0.055, type: 'via' },
  { id: 'wp-5', label: 'Finish — Café Stop',      lat: 51.508, lng: -0.06,  type: 'end' },
];

export const DEMO_TURNS = [
  { idx: 1,  dist: '0.0 km', instruction: 'Head north on High Street',         icon: '↑' },
  { idx: 2,  dist: '0.8 km', instruction: 'Turn right onto Park Road',          icon: '→' },
  { idx: 3,  dist: '2.1 km', instruction: 'Continue straight — enter park',     icon: '↑' },
  { idx: 4,  dist: '4.5 km', instruction: 'Bear left at the fork',              icon: '↖' },
  { idx: 5,  dist: '7.2 km', instruction: 'Sharp right — begin ascent',         icon: '↗' },
  { idx: 6,  dist: '9.8 km', instruction: 'Summit — turn left onto trail',      icon: '←' },
  { idx: 7,  dist: '12.3km', instruction: 'Descend via gravel path',            icon: '↓' },
  { idx: 8,  dist: '15.0km', instruction: 'Re-join tarmac at Reservoir Lane',   icon: '↑' },
  { idx: 9,  dist: '17.8km', instruction: 'Turn left — final 3 km flat',        icon: '←' },
  { idx: 10, dist: '20.6km', instruction: 'Arrive — Café Stop on right',        icon: '🏁' },
];

export const CLUB_LIBRARY = [
  {
    id: 'cl-1', name: 'Sunday Club Ride',       distance: 67.5,  elevation: 540,  time: '3h 10m',
    surface: 'Road',    difficulty: 'Moderate', riders: 12, saved: true,
    elevProfile: genElevProfile(1, 40),
    tags: ['social', 'weekly'],
    description: 'Relaxed weekend loop through the Surrey Hills with a café stop at the midpoint.',
  },
  {
    id: 'cl-2', name: 'Weekly Crit Training',   distance: 45.0,  elevation: 210,  time: '1h 45m',
    surface: 'Road',    difficulty: 'Hard',     riders: 8,  saved: false,
    elevProfile: genElevProfile(2, 40),
    tags: ['training', 'fast'],
    description: 'High-intensity criterium loop. Multiple sprint sections and short sharp climbs.',
  },
  {
    id: 'cl-3', name: 'Beginner Welcome Ride',  distance: 22.0,  elevation: 80,   time: '1h 05m',
    surface: 'Mixed',   difficulty: 'Easy',     riders: 24, saved: true,
    elevProfile: genElevProfile(3, 40),
    tags: ['social', 'beginner'],
    description: 'Flat and friendly intro route for new members. No notable climbs.',
  },
  {
    id: 'cl-4', name: 'Sportive Prep 80k',      distance: 80.0,  elevation: 920,  time: '3h 50m',
    surface: 'Road',    difficulty: 'Hard',     riders: 6,  saved: false,
    elevProfile: genElevProfile(4, 40),
    tags: ['training', 'endurance'],
    description: 'Full sportive simulation with three categorised climbs. Ideal for event prep.',
  },
  {
    id: 'cl-5', name: 'Gravel Grinder Classic',  distance: 55.0,  elevation: 760,  time: '3h 00m',
    surface: 'Gravel',  difficulty: 'Hard',     riders: 9,  saved: false,
    elevProfile: genElevProfile(5, 40),
    tags: ['gravel', 'adventure'],
    description: 'Mixed terrain adventure through forest trails and gravel bridleways.',
  },
  {
    id: 'cl-6', name: 'Mountain Enduro Loop',    distance: 42.0,  elevation: 1240, time: '3h 30m',
    surface: 'Mountain',difficulty: 'Expert',   riders: 4,  saved: false,
    elevProfile: genElevProfile(6, 40),
    tags: ['mtb', 'technical'],
    description: 'Technical single-track with rocky sections. Suitable for experienced MTB riders only.',
  },
];

export const SNAP_MODES = ['Snap to roads', 'Snap to trails', 'Free draw'];
export const SURFACE_TYPES = ['Road', 'Gravel', 'Mixed', 'Mountain'];
export const DIFFICULTY_LEVELS = ['Easy', 'Moderate', 'Hard', 'Expert', 'Extreme'];