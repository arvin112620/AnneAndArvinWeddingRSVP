'use client';

import { FormEvent, useEffect, useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { Check, ChevronRight, Loader2 } from 'lucide-react';

type Attendance = 'accept' | 'decline';
const dietaryOptions = [
  ['standard', 'Standard'],
  ['vegan', 'Vegan'],
  ['gluten-free', 'Gluten-free'],
  ['allergies', 'Allergies'],
] as const;

export function RSVPForm() {
  const { data: session, status: sessionStatus } = useSession();
  const [authTimedOut, setAuthTimedOut] = useState(false);
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [form, setForm] = useState({ fullName: '', attendance: 'accept' as Attendance, dietary: 'standard', message: '' });
  const update = (key: string, value: string) => setForm((current) => ({ ...current, [key]: value }));

  useEffect(() => {
    if (sessionStatus !== 'loading') {
      setAuthTimedOut(false);
      return;
    }
    const timeout = window.setTimeout(() => setAuthTimedOut(true), 3500);
    return () => window.clearTimeout(timeout);
  }, [sessionStatus]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setStatus('loading');
    try {
      const response = await fetch('/api/rsvp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.error ?? 'We could not save your RSVP. Please try again.');
      }
      setStatus('success');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'We could not save your RSVP. Please try again.');
      setStatus('error');
    }
  }

  if (status === 'success') return <div className="py-10 text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sage text-white"><Check size={24} /></div><h3 className="mt-6 font-display text-4xl">Thank you, {form.fullName.split(' ')[0] || 'dear one'}.</h3><p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-ink/65">Your response has been received. We can&apos;t wait to celebrate this day with you.</p></div>;

  if (sessionStatus === 'loading' && !authTimedOut) return <div className="py-10 text-center text-sm text-ink/55">Checking your Google account...</div>;
  if (!session) return <div className="border border-ink/15 bg-paper p-7 text-center sm:p-10"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-lg font-bold shadow-soft">G</div><h3 className="mt-5 font-display text-4xl">RSVP with your Google account</h3><p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-ink/60">Sign in so we can keep our guest list accurate and make sure every response is genuine.</p><button type="button" onClick={() => signIn('google')} className="mt-7 flex min-h-12 w-full items-center justify-center gap-3 bg-ink px-5 text-sm font-bold text-white transition hover:bg-ink/85">Continue with Google</button></div>;

  return <form onSubmit={submit} className="space-y-7">
    <div className="flex items-center gap-3 text-xs uppercase tracking-[.16em] text-ink/45"><span className={step >= 1 ? 'font-bold text-ink' : ''}>01 guest</span><span className="h-px w-8 bg-ink/15" /><span className={step >= 2 ? 'font-bold text-ink' : ''}>02 details</span></div>
    {step === 1 ? <div className="space-y-6">
      <div><label htmlFor="fullName" className="mb-2 block text-xs font-bold uppercase tracking-[.14em]">Your full name</label><input id="fullName" required value={form.fullName} onChange={(e) => update('fullName', e.target.value)} placeholder="e.g. Alex Santos" className="w-full border-b border-ink/20 bg-transparent px-0 py-3 text-lg outline-none placeholder:text-ink/30 focus:border-ink" /></div>
      <div><p className="mb-3 text-xs font-bold uppercase tracking-[.14em]">Will you be joining us?</p><div className="grid gap-3 sm:grid-cols-2">{([['accept', 'Accepts with pleasure'], ['decline', 'Declines with regret']] as const).map(([value, label]) => <button type="button" key={value} onClick={() => update('attendance', value)} className={`min-h-14 border px-4 text-left text-sm transition ${form.attendance === value ? 'border-ink bg-ink text-white' : 'border-ink/15 bg-white/40 hover:border-ink/40'}`}>{label}</button>)}</div></div>
      <button type="button" onClick={() => { if (form.fullName.trim().length < 2) { setErrorMessage('Please enter your full name before continuing.'); setStatus('error'); return; } setErrorMessage(''); setStatus('idle'); setStep(2); }} className="flex min-h-12 w-full items-center justify-center gap-2 bg-ink px-5 text-sm font-bold text-white transition hover:bg-ink/85">Continue <ChevronRight size={17} /></button>
    </div> : <div className="space-y-6">
      <div><label htmlFor="dietary" className="mb-2 block text-xs font-bold uppercase tracking-[.14em]">Dietary preferences</label><select id="dietary" value={form.dietary} onChange={(e) => update('dietary', e.target.value)} className="w-full border-b border-ink/20 bg-transparent py-3 text-lg outline-none"><option value="standard">Standard</option>{dietaryOptions.slice(1).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
      <div><label htmlFor="message" className="mb-2 block text-xs font-bold uppercase tracking-[.14em]">A note for the couple <span className="font-normal normal-case tracking-normal text-ink/40">(optional)</span></label><textarea id="message" rows={4} value={form.message} onChange={(e) => update('message', e.target.value)} placeholder="Leave a little love..." className="w-full resize-none border border-ink/15 bg-white/40 p-3 text-base outline-none placeholder:text-ink/30 focus:border-ink" /></div>
      {status === 'error' && <p className="text-sm text-red-700">{errorMessage || 'Something went wrong. Please try again.'}</p>}
      <div className="flex gap-3"><button type="button" onClick={() => setStep(1)} className="min-h-12 border border-ink/20 px-5 text-sm font-bold">Back</button><button disabled={status === 'loading'} className="flex min-h-12 flex-1 items-center justify-center gap-2 bg-ink px-5 text-sm font-bold text-white hover:bg-ink/85">{status === 'loading' ? <Loader2 className="animate-spin" size={17} /> : 'Send RSVP'}</button></div>
    </div>}
  </form>;
}
