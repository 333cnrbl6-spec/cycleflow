import { useState } from 'react';
import { Users, Bell, Calendar, Trophy, ChevronRight, Pin, Clock, Plus, X, MapPin, CheckCircle, CreditCard, ShieldCheck, FileText, UserPlus, Edit2, Download } from 'lucide-react';
import { useDemo } from '@/lib/DemoContext';
import SectionLabel from '@/components/ui/SectionLabel';
import PageHeader from '@/components/ui/PageHeader';
import SubNav from '@/components/ui/SubNav';
import PlaceholderCard from '@/components/ui/PlaceholderCard';

const TABS = [
  { id: 'announcements', label: 'Announcements',   icon: Bell },
  { id: 'events',        label: 'Club Events',     icon: Calendar },
  { id: 'leaderboard',   label: 'Leaderboard',     icon: Trophy },
  { id: 'members',       label: 'Membership',      icon: Users },
  { id: 'compliance',    label: 'Insurance',        icon: ShieldCheck },
];

const ANNOUNCEMENTS = [
  { title: 'New Safety Policy — Helmets Mandatory', date: '04 Jun 2026', pinned: true, author: 'Club Admin',
    excerpt: 'Effective immediately, all club rides require an approved cycling helmet. This aligns with national federation guidelines updated May 2026.' },
  { title: 'Sunday Ride — Route Changed', date: '03 Jun 2026', pinned: false, author: 'Club Admin',
    excerpt: 'Due to road works on the A404, the Sunday club ride will take the alternate forest route. New GPX file has been uploaded.' },
  { title: 'Club Kit Order — Deadline 15 June', date: '01 Jun 2026', pinned: false, author: 'Kit Secretary',
    excerpt: 'Last chance to order your 2026 club kit. Submit your order via the link below before 15 June 2026.' },
];

const EVENTS = [
  { id: 1, name: 'Sunday Morning Club Ride',     date: 'Sun 8 Jun 2026',  time: '08:00', distance: '67 km', signups: 12, max: 20, type: 'Ride',       location: 'Meet at Town Hall', rsvp: false },
  { id: 2, name: 'Tuesday Evening Crit',          date: 'Tue 10 Jun 2026', time: '18:30', distance: '45 km', signups: 8,  max: 15, type: 'Training',    location: 'Velodrome Car Park', rsvp: true },
  { id: 3, name: 'Club Social Night',             date: 'Fri 13 Jun 2026', time: '19:00', distance: null,    signups: 22, max: 40, type: 'Social',      location: 'The Wheel & Sprocket Pub', rsvp: false },
  { id: 4, name: 'Beginner Welcome Ride',         date: 'Sat 14 Jun 2026', time: '09:00', distance: '22 km', signups: 24, max: 30, type: 'Ride',       location: 'Community Centre', rsvp: false },
  { id: 5, name: 'Hill Climb Championship',       date: 'Sun 22 Jun 2026', time: '07:30', distance: '38 km', signups: 18, max: 25, type: 'Race',       location: 'Ridgeway Start Line', rsvp: false },
  { id: 6, name: 'Summer Sportive 80k',           date: 'Sat 28 Jun 2026', time: '07:00', distance: '80 km', signups: 34, max: 50, type: 'Sportive',   location: 'Club HQ', rsvp: false },
];

const LEADERBOARD = [
  { rank: 1, name: 'Alex Turner',     km: '1,842', rides: 47, badge: '🥇' },
  { rank: 2, name: 'Sarah Chen',      km: '1,724', rides: 41, badge: '🥈' },
  { rank: 3, name: 'Marcus Webb',     km: '1,612', rides: 38, badge: '🥉' },
  { rank: 4, name: 'Priya Nair',      km: '1,540', rides: 36, badge: '' },
  { rank: 5, name: 'You (Jamie Ford)',km: '1,452', rides: 32, badge: '' },
  { rank: 6, name: 'Tom Barker',      km: '1,391', rides: 31, badge: '' },
];

const MEMBERS = [
  { name: 'Alex Turner', role: 'Club Admin',  joined: 'Jan 2024', status: 'active'   },
  { name: 'Sarah Chen',  role: 'Cyclist',     joined: 'Mar 2024', status: 'active'   },
  { name: 'Marcus Webb', role: 'Cyclist',     joined: 'Feb 2024', status: 'active'   },
  { name: 'Priya Nair',  role: 'Cyclist',     joined: 'Jun 2024', status: 'active'   },
  { name: 'Jamie Ford',  role: 'Cyclist',     joined: 'Aug 2024', status: 'active'   },
  { name: 'Tom Barker',  role: 'Cyclist',     joined: 'Oct 2024', status: 'inactive' },
];

const TYPE_COLOR = {
  Ride: 'bg-blue-500/10 text-blue-400',
  Training: 'bg-cyan-500/10 text-cyan-400',
  Social: 'bg-violet-500/10 text-violet-400',
  Race: 'bg-red-500/10 text-red-400',
  Sportive: 'bg-amber-500/10 text-amber-400',
};

// Calendar helpers
const JUNE_EVENTS = { 8:'Ride', 10:'Training', 13:'Social', 14:'Ride', 22:'Race', 28:'Sportive' };
const DAYS = ['Mo','Tu','We','Th','Fr','Sa','Su'];

export default function ClubHub() {
  const { demoMode, data } = useDemo();
  const leaderboard = demoMode ? data.clubLeaderboard : LEADERBOARD;
  const memberCount = demoMode ? data.adminStats.club.activeMembers : MEMBERS.length;
  const [tab, setTab]               = useState('announcements');
  const [rsvpd, setRsvpd]           = useState(new Set([2]));
  const [selectedEvent, setSelected] = useState(null);
  const [showCreateModal, setShowCreate] = useState(false);
  const [calView, setCalView]        = useState(false); // list vs calendar

  const toggleRsvp = (id) => setRsvpd(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  return (
    <div className="p-6 page-enter">
      <PageHeader title="Club Hub" subtitle="Rides, events, members, and club communications" icon={Users} iconColor="text-violet-400" />
      <SubNav tabs={TABS} active={tab} onSelect={t => { setTab(t); setSelected(null); }} />

      {/* ── Announcements ── */}
      {tab === 'announcements' && (
        <div className="space-y-3">
          {ANNOUNCEMENTS.map((a, i) => (
            <div key={i} className={`glass-card rounded-xl border p-4 transition-all hover:border-blue-500/30 cursor-pointer ${a.pinned ? 'border-blue-500/20 bg-blue-500/5' : 'border-white/5'}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    {a.pinned && <span className="flex items-center gap-1 text-[10px] text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded-full"><Pin className="w-2.5 h-2.5" /> Pinned</span>}
                    <span className="text-xs text-muted-foreground">{a.date}</span>
                    <span className="text-xs text-muted-foreground">— {a.author}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">{a.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{a.excerpt}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Events ── */}
      {tab === 'events' && !selectedEvent && (
        <div className="space-y-4">
          {/* Toolbar */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 bg-white/5 border border-border rounded-lg p-1">
              <button onClick={() => setCalView(false)} className={`px-3 py-1 rounded text-xs font-medium transition-colors ${!calView ? 'bg-blue-500 text-white' : 'text-muted-foreground hover:text-foreground'}`}>List</button>
              <button onClick={() => setCalView(true)}  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${calView  ? 'bg-blue-500 text-white' : 'text-muted-foreground hover:text-foreground'}`}>Calendar</button>
            </div>
            <button onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold rounded-lg transition-colors">
              <Plus className="w-3.5 h-3.5" /> Create Event
            </button>
          </div>

          {/* Calendar Grid */}
          {calView && (
            <div className="glass-card rounded-xl border border-white/5 p-4 mb-2">
              <p className="text-sm font-semibold text-foreground mb-3">June 2026</p>
              <div className="grid grid-cols-7 gap-1 mb-2">
                {DAYS.map(d => <div key={d} className="text-center text-[10px] font-bold text-muted-foreground py-1">{d}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {/* June 1 = Monday, offset 0 */}
                {Array.from({length: 30}, (_, i) => {
                  const day = i + 1;
                  const evType = JUNE_EVENTS[day];
                  return (
                    <div key={day} className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs cursor-pointer transition-all
                      ${evType ? 'border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 font-bold text-blue-400' : 'text-muted-foreground hover:bg-white/5'}`}>
                      <span>{day}</span>
                      {evType && <span className="text-[8px] leading-none mt-0.5 text-blue-400/70">{evType.slice(0,3)}</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Event List */}
          <div className="space-y-2.5">
            {EVENTS.map(event => (
              <div key={event.id} className="glass-card rounded-xl border border-white/5 p-4 hover:border-blue-500/20 transition-all">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 cursor-pointer" onClick={() => setSelected(event)}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${TYPE_COLOR[event.type] || 'bg-white/10 text-muted-foreground'}`}>{event.type}</span>
                      {rsvpd.has(event.id) && <span className="text-[10px] text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded-full flex items-center gap-1"><CheckCircle className="w-2.5 h-2.5" /> RSVP'd</span>}
                    </div>
                    <h3 className="text-sm font-semibold text-foreground">{event.name}</h3>
                    <div className="flex flex-wrap gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{event.date}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{event.time}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{event.location}</span>
                      {event.distance && <span>{event.distance}</span>}
                    </div>
                  </div>
                  <button onClick={() => toggleRsvp(event.id)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                      rsvpd.has(event.id)
                        ? 'border-green-500/30 bg-green-500/10 text-green-400 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400'
                        : 'border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20'
                    }`}>
                    {rsvpd.has(event.id) ? 'Cancel RSVP' : 'RSVP'}
                  </button>
                </div>
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>{event.signups} of {event.max} spots filled</span>
                    <span>{event.max - event.signups} remaining</span>
                  </div>
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${
                      event.signups / event.max > 0.85 ? 'bg-red-400' : event.signups / event.max > 0.6 ? 'bg-amber-400' : 'bg-blue-400'
                    }`} style={{ width: `${(event.signups / event.max) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Event Detail */}
      {tab === 'events' && selectedEvent && (
        <div className="space-y-4 page-enter">
          <button onClick={() => setSelected(null)} className="text-xs text-muted-foreground hover:text-foreground transition-colors">← Back to Events</button>
          <div className="glass-card rounded-xl border border-white/5 p-5">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${TYPE_COLOR[selectedEvent.type]}`}>{selectedEvent.type}</span>
                <h2 className="text-lg font-bold text-foreground mt-2">{selectedEvent.name}</h2>
              </div>
              {rsvpd.has(selectedEvent.id) && <span className="text-xs text-green-400 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-full flex items-center gap-1"><CheckCircle className="w-3 h-3" /> You're going</span>}
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                ['Date',     selectedEvent.date],
                ['Time',     selectedEvent.time],
                ['Location', selectedEvent.location],
                ['Spaces',   `${selectedEvent.signups}/${selectedEvent.max} filled`],
                ...(selectedEvent.distance ? [['Distance', selectedEvent.distance]] : []),
              ].map(([l,v]) => (
                <div key={l} className="p-3 rounded-lg bg-white/5 border border-white/5">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{l}</p>
                  <p className="text-sm font-medium text-foreground mt-0.5">{v}</p>
                </div>
              ))}
            </div>
            {/* Map placeholder */}
            <div className="h-36 rounded-lg bg-[#0a1628] border border-blue-500/20 flex items-center justify-center mb-4"
              style={{ backgroundImage: 'linear-gradient(#1e40af15 1px, transparent 1px), linear-gradient(90deg, #1e40af15 1px, transparent 1px)', backgroundSize: '25px 25px' }}>
              <div className="text-center">
                <MapPin className="w-6 h-6 text-blue-400/40 mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">{selectedEvent.location}</p>
              </div>
            </div>
            <button onClick={() => toggleRsvp(selectedEvent.id)}
              className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all ${
                rsvpd.has(selectedEvent.id)
                  ? 'bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}>
              {rsvpd.has(selectedEvent.id) ? 'Cancel RSVP' : 'RSVP — Confirm Attendance'}
            </button>
          </div>
        </div>
      )}

      {/* ── Leaderboard ── */}
      {tab === 'leaderboard' && (
        <div className="glass-card rounded-xl border border-white/[0.06] overflow-hidden">
          <div className="px-4 py-3 border-b border-border/60 flex items-center gap-2">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">June 2026 — Monthly Leaderboard</span>
          </div>
          <table className="cf-table">
            <thead>
              <tr>
                <th className="text-left">Rank</th>
                <th className="text-left">Rider</th>
                <th className="text-right">Distance</th>
                <th className="text-right hidden sm:table-cell">Rides</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((e, i) => (
                <tr key={i} className={e.name.includes('You') ? '!bg-blue-500/5' : ''}>
                  <td>
                    {e.badge ? <span className="text-xl">{e.badge}</span> : <span className="text-sm text-muted-foreground font-mono">{e.rank}</span>}
                  </td>
                  <td className="font-medium text-foreground">
                    {e.name}
                    {e.name.includes('You') && <span className="ml-2 badge bg-blue-500/10 text-blue-400">You</span>}
                  </td>
                  <td className="text-right text-blue-400 font-mono font-semibold">{e.km} km</td>
                  <td className="text-right text-muted-foreground hidden sm:table-cell">{e.rides}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Membership Management ── */}
      {tab === 'members' && (
        <div className="space-y-4">
          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Total Members',  value: memberCount.toString(),                                           accent: 'blue'  },
              { label: 'Active',         value: demoMode ? data.adminStats.club.activeMembers.toString() : MEMBERS.filter(m => m.status === 'active').length.toString(), accent: 'green' },
              { label: 'Pending Renewal',value: '2',                                                              accent: 'amber' },
              { label: 'Lapsed',         value: MEMBERS.filter(m => m.status === 'inactive').length.toString(),  accent: 'red'   },
            ].map(s => (
              <div key={s.label} className="glass-card rounded-xl border border-white/[0.06] p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 mb-2">{s.label}</p>
                <p className={`text-2xl font-bold font-mono ${
                  s.accent === 'blue' ? 'text-blue-400' :
                  s.accent === 'green' ? 'text-green-400' :
                  s.accent === 'amber' ? 'text-amber-400' : 'text-red-400'
                }`}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Member directory */}
          <div className="glass-card rounded-xl border border-white/[0.06] overflow-hidden">
            <div className="px-4 py-3 border-b border-border/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-violet-400" />
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">Member Directory</span>
              </div>
              <button className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors">
                <UserPlus className="w-3 h-3" /> Invite Member
              </button>
            </div>
            <table className="cf-table">
              <thead>
                <tr>
                  <th className="text-left">Member</th>
                  <th className="text-left hidden sm:table-cell">Role</th>
                  <th className="text-left hidden md:table-cell">Joined</th>
                  <th className="text-center hidden md:table-cell">Insurance</th>
                  <th className="text-center">Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {MEMBERS.map((m, i) => (
                  <tr key={i}>
                    <td>
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-[10px] font-bold text-blue-400">{m.name[0]}</span>
                        </div>
                        <span className="font-medium text-foreground">{m.name}</span>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell">
                      <span className={`badge ${m.role === 'Club Admin' ? 'bg-violet-500/10 text-violet-400' : 'bg-blue-500/10 text-blue-400'}`}>{m.role}</span>
                    </td>
                    <td className="text-muted-foreground hidden md:table-cell">{m.joined}</td>
                    <td className="text-center hidden md:table-cell">
                      <span className={`badge ${m.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400'}`}>
                        {m.status === 'active' ? '✓ Covered' : 'Pending'}
                      </span>
                    </td>
                    <td className="text-center">
                      <span className={`w-2 h-2 rounded-full inline-block ${m.status === 'active' ? 'bg-green-400' : 'bg-muted-foreground'}`} />
                    </td>
                    <td className="text-right">
                      <button className="btn-icon"><Edit2 className="w-3.5 h-3.5" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Membership tiers */}
          <SectionLabel accent="violet" label="Membership Tiers" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { tier: 'Junior',    price: '£25/yr',  perks: ['Club rides', 'Newsletter', 'Basic insurance'], color: 'border-blue-500/20 bg-blue-500/[0.03]', badge: 'text-blue-400' },
              { tier: 'Standard', price: '£65/yr',  perks: ['All Junior perks', 'Coaching sessions', 'Full BC insurance', 'Race licence'], color: 'border-violet-500/20 bg-violet-500/[0.03]', badge: 'text-violet-400' },
              { tier: 'Premium',  price: '£110/yr', perks: ['All Standard perks', 'Training plans', 'Trackside support', 'Kit discount'], color: 'border-amber-500/20 bg-amber-500/[0.03]', badge: 'text-amber-400' },
            ].map(t => (
              <div key={t.tier} className={`rounded-xl border p-4 ${t.color}`}>
                <p className={`text-sm font-bold ${t.badge}`}>{t.tier}</p>
                <p className="text-lg font-bold text-foreground mt-1 font-mono">{t.price}</p>
                <ul className="mt-3 space-y-1">
                  {t.perks.map(p => (
                    <li key={p} className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" /> {p}
                    </li>
                  ))}
                </ul>
                <button className="btn-secondary w-full mt-3 text-xs">Manage Tier</button>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl border border-dashed border-violet-500/20 bg-violet-500/[0.03] text-center">
            <p className="text-xs text-muted-foreground">British Cycling affiliate membership sync, direct debit integration, and renewal automation hooks ready.</p>
          </div>
        </div>
      )}

      {/* ── Insurance & Compliance ── */}
      {tab === 'compliance' && (
        <div className="space-y-5">
          <SectionLabel accent="green" label="Your Coverage" />

          {/* Active policy summary */}
          <div className="glass-card rounded-xl border border-green-500/20 bg-green-500/[0.04] p-5">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">British Cycling — Standard Membership</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Policy No. BC-2026-448821 · Renews 31 Dec 2026</p>
                </div>
              </div>
              <span className="badge bg-green-500/10 text-green-400 flex-shrink-0">Active</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                ['Public Liability',   '£15M'],
                ['Personal Accident',  '£150K'],
                ['Medical Cover',      '£10K'],
                ['Legal Protection',   '£100K'],
              ].map(([l, v]) => (
                <div key={l} className="rounded-lg bg-white/5 p-3 text-center">
                  <p className="text-[10px] text-muted-foreground">{l}</p>
                  <p className="text-sm font-bold font-mono text-green-400 mt-0.5">{v}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-4">
              <button className="btn-secondary text-xs flex-1">
                <Download className="w-3.5 h-3.5" /> Download Policy
              </button>
              <button className="btn-secondary text-xs flex-1">View Full Terms</button>
            </div>
          </div>

          {/* Compliance checklist */}
          <SectionLabel accent="blue" label="Compliance Requirements" />
          <div className="glass-card rounded-xl border border-white/[0.06] overflow-hidden">
            {[
              { item: 'British Cycling Membership',     status: 'Met',    date: 'Valid to Dec 2026', icon: '✓' },
              { item: 'Public Liability Insurance',     status: 'Met',    date: 'BC Standard Policy', icon: '✓' },
              { item: 'DBS Check (Ride Leaders)',       status: 'Met',    date: 'Verified May 2025', icon: '✓' },
              { item: 'First Aid Certificate',          status: 'Action', date: 'Expires Aug 2026', icon: '⚠' },
              { item: 'Club Affiliation — BC',          status: 'Met',    date: 'Affiliate No. 44821', icon: '✓' },
              { item: 'GDPR Data Register',             status: 'Action', date: 'Annual review due', icon: '⚠' },
              { item: 'Safeguarding Policy',            status: 'Met',    date: 'Updated Apr 2026', icon: '✓' },
            ].map((c, i) => (
              <div key={i} className="px-4 py-3 border-b border-border/20 last:border-0 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-3">
                  <span className={`text-sm ${c.status === 'Met' ? 'text-green-400' : 'text-amber-400'}`}>{c.icon}</span>
                  <div>
                    <p className="text-xs font-semibold text-foreground">{c.item}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{c.date}</p>
                  </div>
                </div>
                <span className={`badge flex-shrink-0 ${c.status === 'Met' ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400'}`}>{c.status}</span>
              </div>
            ))}
          </div>

          {/* Documents */}
          <SectionLabel accent="amber" label="Club Documents" />
          <div className="space-y-2">
            {[
              { name: 'Club Constitution 2026',            type: 'PDF',  size: '128 KB', date: 'Apr 2026' },
              { name: 'Risk Assessment — Club Rides',      type: 'PDF',  size: '94 KB',  date: 'Mar 2026' },
              { name: 'Safeguarding & Child Protection',   type: 'PDF',  size: '212 KB', date: 'Apr 2026' },
              { name: 'GDPR Privacy Notice',               type: 'PDF',  size: '76 KB',  date: 'Jan 2026' },
            ].map((doc, i) => (
              <div key={i} className="glass-card rounded-xl border border-white/[0.06] p-4 flex items-center gap-3 hover:border-amber-500/20 transition-all">
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-amber-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{doc.name}</p>
                  <p className="text-xs text-muted-foreground">{doc.type} · {doc.size} · Updated {doc.date}</p>
                </div>
                <button className="btn-icon flex-shrink-0">
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl border border-dashed border-green-500/20 bg-green-500/[0.03] text-center">
            <p className="text-xs text-muted-foreground">British Cycling affiliate portal sync and automated compliance reminders — integration hook ready.</p>
          </div>
        </div>
      )}

      {/* ── Create Event Modal ── */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && setShowCreate(false)}>
          <div className="bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl page-enter">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="text-sm font-bold text-foreground">Create Club Event</h3>
              <button onClick={() => setShowCreate(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-3">
              <div>
                <label className="cf-label">Event Name *</label>
                <input placeholder="e.g. Saturday Club Ride" className="cf-input" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="cf-label">Event Type</label>
                  <select className="cf-select">
                    {['Ride','Training','Race','Social','Sportive'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="cf-label">Max Capacity</label>
                  <input type="number" defaultValue={20} className="cf-input" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="cf-label">Date</label>
                  <input type="date" className="cf-input" />
                </div>
                <div>
                  <label className="cf-label">Start Time</label>
                  <input type="time" defaultValue="08:00" className="cf-input" />
                </div>
              </div>
              <div>
                <label className="cf-label">Meeting Location</label>
                <input placeholder="e.g. Town Hall Car Park" className="cf-input" />
              </div>
              <button onClick={() => setShowCreate(false)} className="btn-primary w-full">
                Create Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}