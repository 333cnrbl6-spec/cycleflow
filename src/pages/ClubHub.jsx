import { useState } from 'react';
import { Users, Bell, Calendar, Trophy, UserCircle, ChevronRight, Pin, Clock } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import SubNav from '@/components/ui/SubNav';
import PlaceholderCard from '@/components/ui/PlaceholderCard';

const TABS = [
  { id: 'announcements', label: 'Announcements', icon: Bell },
  { id: 'rides', label: 'Upcoming Rides', icon: Calendar },
  { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
  { id: 'members', label: 'Members', icon: Users },
];

const ANNOUNCEMENTS = [
  { title: 'New Safety Policy — Helmets Mandatory', date: '04 Jun 2026', pinned: true, author: 'Club Admin', excerpt: 'Effective immediately, all club rides require an approved cycling helmet. This aligns with national federation guidelines updated May 2026.' },
  { title: 'Sunday Ride — Route Changed', date: '03 Jun 2026', pinned: false, author: 'Club Admin', excerpt: 'Due to road works on the A404, the Sunday club ride will take the alternate forest route. New GPX file has been uploaded.' },
  { title: 'Club Kit Order — Deadline 15 June', date: '01 Jun 2026', pinned: false, author: 'Kit Secretary', excerpt: 'Last chance to order your 2026 club kit. Submit your order via the link below before 15 June 2026.' },
];

const RIDES = [
  { name: 'Sunday Morning Club Ride', date: 'Sun 8 Jun 2026', time: '08:00', distance: '67 km', signups: 12, max: 20 },
  { name: 'Tuesday Evening Crit', date: 'Tue 10 Jun 2026', time: '18:30', distance: '45 km', signups: 8, max: 15 },
  { name: 'Beginner Welcome Ride', date: 'Sat 14 Jun 2026', time: '09:00', distance: '22 km', signups: 24, max: 30 },
  { name: 'Hill Climb Championship', date: 'Sun 22 Jun 2026', time: '07:30', distance: '38 km', signups: 18, max: 25 },
];

const LEADERBOARD = [
  { rank: 1, name: 'Alex Turner', km: '1,842', rides: 47, badge: '🥇' },
  { rank: 2, name: 'Sarah Chen', km: '1,724', rides: 41, badge: '🥈' },
  { rank: 3, name: 'Marcus Webb', km: '1,612', rides: 38, badge: '🥉' },
  { rank: 4, name: 'Priya Nair', km: '1,540', rides: 36, badge: '' },
  { rank: 5, name: 'You (Jamie Ford)', km: '1,452', rides: 32, badge: '' },
  { rank: 6, name: 'Tom Barker', km: '1,391', rides: 31, badge: '' },
];

const MEMBERS = [
  { name: 'Alex Turner', role: 'Club Admin', joined: 'Jan 2024', status: 'active' },
  { name: 'Sarah Chen', role: 'Cyclist', joined: 'Mar 2024', status: 'active' },
  { name: 'Marcus Webb', role: 'Cyclist', joined: 'Feb 2024', status: 'active' },
  { name: 'Priya Nair', role: 'Cyclist', joined: 'Jun 2024', status: 'active' },
  { name: 'Jamie Ford', role: 'Cyclist', joined: 'Aug 2024', status: 'active' },
  { name: 'Tom Barker', role: 'Cyclist', joined: 'Oct 2024', status: 'inactive' },
];

export default function ClubHub() {
  const [tab, setTab] = useState('announcements');

  return (
    <div className="p-6 page-enter">
      <PageHeader title="Club Hub" subtitle="Manage your cycling club — rides, members, and communications" icon={Users} iconColor="text-violet-400" />
      <SubNav tabs={TABS} active={tab} onSelect={setTab} />

      {tab === 'announcements' && (
        <div className="space-y-3">
          {ANNOUNCEMENTS.map((a, i) => (
            <div key={i} className={`glass-card rounded-lg border p-4 transition-all hover:border-blue-500/30 cursor-pointer ${
              a.pinned ? 'border-blue-500/20 bg-blue-500/5' : 'border-white/5'
            }`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {a.pinned && (
                      <span className="flex items-center gap-1 text-[10px] text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded-full">
                        <Pin className="w-2.5 h-2.5" /> Pinned
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">{a.date}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">{a.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{a.excerpt}</p>
                  <p className="text-xs text-muted-foreground mt-2">— {a.author}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'rides' && (
        <div className="space-y-3">
          {RIDES.map((r, i) => (
            <div key={i} className="glass-card rounded-lg border border-white/5 p-4 hover:border-blue-500/30 transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">{r.name}</h3>
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{r.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{r.time}</span>
                    <span>{r.distance}</span>
                  </div>
                </div>
                <button className="px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 text-xs font-medium rounded-lg transition-colors">
                  Sign Up
                </button>
              </div>
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <span>{r.signups} of {r.max} signed up</span>
                  <span>{r.max - r.signups} spots left</span>
                </div>
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-400 rounded-full" style={{ width: `${(r.signups / r.max) * 100}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'leaderboard' && (
        <div className="glass-card rounded-lg border border-white/5 overflow-hidden">
          <div className="p-4 border-b border-border flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-semibold text-foreground">June 2026 — Monthly Leaderboard</span>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground uppercase tracking-wide">
                <th className="text-left px-4 py-3">Rank</th>
                <th className="text-left px-4 py-3">Rider</th>
                <th className="text-right px-4 py-3">Distance</th>
                <th className="text-right px-4 py-3 hidden sm:table-cell">Rides</th>
              </tr>
            </thead>
            <tbody>
              {LEADERBOARD.map((entry, i) => (
                <tr key={i} className={`border-b border-border/30 transition-colors ${
                  entry.name.includes('You') ? 'bg-blue-500/5' : 'hover:bg-white/3'
                }`}>
                  <td className="px-4 py-3">
                    <span className="text-lg">{entry.badge || <span className="text-sm text-muted-foreground font-mono">{entry.rank}</span>}</span>
                  </td>
                  <td className="px-4 py-3 font-medium text-foreground">
                    {entry.name}
                    {entry.name.includes('You') && <span className="ml-2 text-xs text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded-full">You</span>}
                  </td>
                  <td className="px-4 py-3 text-right text-blue-400 font-mono">{entry.km} km</td>
                  <td className="px-4 py-3 text-right text-muted-foreground hidden sm:table-cell">{entry.rides}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'members' && (
        <div className="space-y-2">
          {MEMBERS.map((m, i) => (
            <div key={i} className="glass-card rounded-lg border border-white/5 p-4 flex items-center gap-3 hover:border-blue-500/20 transition-all">
              <div className="w-9 h-9 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-semibold text-blue-400">{m.name[0]}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{m.name}</p>
                <p className="text-xs text-muted-foreground">Joined {m.joined}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                m.role === 'Club Admin' ? 'bg-violet-500/10 text-violet-400' : 'bg-blue-500/10 text-blue-400'
              }`}>{m.role}</span>
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${m.status === 'active' ? 'bg-green-400' : 'bg-muted-foreground'}`} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}