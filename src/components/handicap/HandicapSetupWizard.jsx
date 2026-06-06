import { useState } from 'react';
import { ChevronRight, ChevronLeft, CheckCircle, Lock, Heart, Activity, User, Shield } from 'lucide-react';
import SectionLabel from '@/components/ui/SectionLabel';

const STEPS = [
  { id: 'intro',    label: 'About the System', icon: Activity },
  { id: 'identity', label: 'Identity',          icon: User },
  { id: 'physio',   label: 'Physiological',     icon: Heart },
  { id: 'privacy',  label: 'Privacy Controls',  icon: Lock },
  { id: 'done',     label: 'Complete',           icon: CheckCircle },
];

function StepBar({ current }) {
  return (
    <div className="flex items-center gap-0 mb-8 overflow-x-auto scrollbar-none -mx-px">
      {STEPS.map((s, i) => {
        const done = i < current;
        const active = i === current;
        const Icon = s.icon;
        return (
          <div key={s.id} className="flex items-center flex-shrink-0">
            <div className="flex flex-col items-center gap-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                done   ? 'bg-blue-500 border-blue-500' :
                active ? 'bg-blue-500/10 border-blue-500' :
                         'bg-white/5 border-border'
              }`}>
                {done
                  ? <CheckCircle className="w-4 h-4 text-white" />
                  : <Icon className={`w-3.5 h-3.5 ${active ? 'text-blue-400' : 'text-muted-foreground/40'}`} />
                }
              </div>
              <p className={`text-[9px] font-semibold uppercase tracking-wide whitespace-nowrap ${active ? 'text-blue-400' : done ? 'text-muted-foreground' : 'text-muted-foreground/40'}`}>
                {s.label}
              </p>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`h-px w-8 sm:w-12 mx-1 mb-4 flex-shrink-0 ${done ? 'bg-blue-500' : 'bg-border'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function FieldRow({ label, type = 'text', unit, placeholder, value, onChange }) {
  return (
    <div>
      <label className="cf-label">{label}{unit && <span className="text-muted-foreground/60 ml-1">({unit})</span>}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="cf-input"
      />
    </div>
  );
}

export default function HandicapSetupWizard({ onComplete }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    age: '', gender: '', pronouns: '', transitionDate: '',
    restingHR: '', systolic: '', diastolic: '',
    glucose: '', spo2: '', bodyMass: '', height: '',
    shareWithClub: true, shareWithFederation: false, anonymise: true,
  });

  const set = (key, val) => setForm(p => ({ ...p, [key]: val }));

  const next = () => step < STEPS.length - 1 && setStep(s => s + 1);
  const prev = () => step > 0 && setStep(s => s - 1);

  return (
    <div className="glass-card rounded-2xl border border-blue-500/20 p-6 max-w-lg">
      <StepBar current={step} />

      {/* ── Step 0: About ── */}
      {step === 0 && (
        <div className="space-y-4">
          <SectionLabel accent="blue" label="How the Handicap System Works" />
          <div className="space-y-3">
            {[
              { icon: Heart,    color: 'text-red-400',    bg: 'bg-red-500/10',    title: 'Physiological Baseline', desc: 'Resting HR, blood pressure, blood glucose, and SpO₂ form your biological foundation score.' },
              { icon: Activity, color: 'text-violet-400', bg: 'bg-violet-500/10', title: 'Behavioural Patterns',   desc: 'Training consistency, recovery habits, and adherence to plans adjust your index weekly.' },
              { icon: Activity, color: 'text-cyan-400',   bg: 'bg-cyan-500/10',   title: 'Real-Time Modifiers',   desc: 'Live HRV, power output, and cadence data modulate your score during and after every ride.' },
              { icon: Shield,   color: 'text-green-400',  bg: 'bg-green-500/10',  title: 'Privacy First',         desc: 'You control exactly which data is shared with your club and federation. You can opt out at any time.' },
            ].map(({ icon: Icon, color, bg, title, desc }) => (
              <div key={title} className="flex gap-3 p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 rounded-xl border border-amber-500/20 bg-amber-500/[0.04]">
            <p className="text-xs text-amber-400">Your handicap index is used for equitable event start-group allocation and does not affect eligibility to race.</p>
          </div>
        </div>
      )}

      {/* ── Step 1: Identity ── */}
      {step === 1 && (
        <div className="space-y-4">
          <SectionLabel accent="violet" label="Identity & Demographics" />
          <div className="space-y-3">
            <FieldRow label="Age" type="number" unit="years" placeholder="e.g. 34" value={form.age} onChange={e => set('age', e.target.value)} />
            <div>
              <label className="cf-label">Gender Identity</label>
              <select className="cf-select" value={form.gender} onChange={e => set('gender', e.target.value)}>
                <option value="">Select…</option>
                <option>Male</option>
                <option>Female</option>
                <option>Non-binary</option>
                <option>Prefer to self-describe</option>
                <option>Prefer not to say</option>
              </select>
            </div>
            <div>
              <label className="cf-label">Pronouns (optional)</label>
              <select className="cf-select" value={form.pronouns} onChange={e => set('pronouns', e.target.value)}>
                <option value="">Select…</option>
                <option>He/Him</option>
                <option>She/Her</option>
                <option>They/Them</option>
                <option>Other</option>
              </select>
            </div>

            {/* Gender-transition-aware section */}
            <div className="p-4 rounded-xl border border-violet-500/20 bg-violet-500/[0.04]">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-3.5 h-3.5 text-violet-400" />
                <p className="text-xs font-semibold text-violet-400">Gender Transition Support</p>
              </div>
              <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                If you are currently in or have previously undergone a gender transition, CycleFlow applies
                a longitudinal physiological adjustment to your handicap baseline in accordance with UCI
                trans-athlete inclusion guidelines. This is optional and entirely private.
              </p>
              <label className="cf-label">Transition Start Date (optional)</label>
              <input
                type="month"
                className="cf-input"
                value={form.transitionDate}
                onChange={e => set('transitionDate', e.target.value)}
                placeholder="YYYY-MM"
              />
              <p className="text-[10px] text-muted-foreground mt-2">
                This data is used only for handicap calculation and is never shared without explicit consent.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Step 2: Physiological ── */}
      {step === 2 && (
        <div className="space-y-4">
          <SectionLabel accent="red" label="Physiological Baseline Metrics" />
          <p className="text-xs text-muted-foreground">These are measured at rest, ideally in the morning before activity. They form your physiological sub-score.</p>
          <div className="space-y-3">
            <FieldRow label="Resting Heart Rate"     type="number" unit="bpm"    placeholder="e.g. 58" value={form.restingHR}  onChange={e => set('restingHR',  e.target.value)} />
            <FieldRow label="Systolic Blood Pressure" type="number" unit="mmHg"   placeholder="e.g. 118" value={form.systolic}  onChange={e => set('systolic',   e.target.value)} />
            <FieldRow label="Diastolic Blood Pressure"type="number" unit="mmHg"   placeholder="e.g. 76"  value={form.diastolic} onChange={e => set('diastolic',  e.target.value)} />
            <FieldRow label="Fasting Blood Glucose"   type="number" unit="mmol/L" placeholder="e.g. 4.8" value={form.glucose}   onChange={e => set('glucose',    e.target.value)} />
            <FieldRow label="Resting SpO₂"            type="number" unit="%"      placeholder="e.g. 98"  value={form.spo2}      onChange={e => set('spo2',       e.target.value)} />
            <div className="grid grid-cols-2 gap-3">
              <FieldRow label="Body Mass" type="number" unit="kg" placeholder="e.g. 72" value={form.bodyMass} onChange={e => set('bodyMass', e.target.value)} />
              <FieldRow label="Height"   type="number" unit="cm" placeholder="e.g. 178" value={form.height}   onChange={e => set('height',   e.target.value)} />
            </div>
          </div>
          <div className="p-3 rounded-xl border border-blue-500/20 bg-blue-500/[0.04]">
            <p className="text-xs text-blue-400">These values can be updated at any time. Your handicap recalculates automatically each Monday morning.</p>
          </div>
        </div>
      )}

      {/* ── Step 3: Privacy ── */}
      {step === 3 && (
        <div className="space-y-4">
          <SectionLabel accent="green" label="Privacy Controls" />
          <p className="text-xs text-muted-foreground leading-relaxed">Choose who can see your handicap data. You can change these settings at any time from your profile.</p>
          <div className="space-y-0 glass-card rounded-xl border border-white/[0.06] overflow-hidden">
            {[
              { key: 'shareWithClub',       label: 'Share handicap index with club',        desc: 'Club admins and members see your category and index' },
              { key: 'shareWithFederation', label: 'Share with federation & region',        desc: 'Anonymised aggregate data for compliance reporting' },
              { key: 'anonymise',           label: 'Anonymise physiological raw data',      desc: 'Only composite score shared, never raw vitals' },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between px-4 py-3.5 border-b border-border/20 last:border-0">
                <div>
                  <p className="text-sm font-medium text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                </div>
                <button
                  onClick={() => set(key, !form[key])}
                  className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ml-4 ${form[key] ? 'bg-blue-500' : 'bg-white/10'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form[key] ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            ))}
          </div>
          <div className="p-3 rounded-xl border border-green-500/20 bg-green-500/[0.04]">
            <p className="text-xs text-green-400">Your physiological raw data is encrypted at rest and never sold to third parties. You can request deletion at any time under GDPR Article 17.</p>
          </div>
        </div>
      )}

      {/* ── Step 4: Done ── */}
      {step === 4 && (
        <div className="text-center space-y-5 py-4">
          <div className="w-16 h-16 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground mb-2">Setup Complete</h3>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
              Your initial handicap index will be calculated within 24 hours as your first rides sync.
              Your starting baseline category is estimated as <span className="text-blue-400 font-semibold">Category B</span>.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <p className="text-[10px] text-muted-foreground">Est. Starting HCP</p>
              <p className="text-xl font-bold font-mono text-blue-400">~4.6</p>
            </div>
            <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/20">
              <p className="text-[10px] text-muted-foreground">Category</p>
              <p className="text-xl font-bold font-mono text-violet-400">B</p>
            </div>
          </div>
          {onComplete && (
            <button onClick={onComplete} className="btn-primary mx-auto">
              View My Handicap Dashboard
            </button>
          )}
        </div>
      )}

      {/* ── Nav buttons ── */}
      {step < 4 && (
        <div className="flex items-center justify-between mt-8 pt-5 border-t border-border/40">
          <button onClick={prev} className={`btn-secondary ${step === 0 ? 'invisible' : ''}`}>
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          <p className="text-xs text-muted-foreground">Step {step + 1} of {STEPS.length - 1}</p>
          <button onClick={next} className="btn-primary">
            {step === 3 ? 'Finish Setup' : 'Continue'} <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}