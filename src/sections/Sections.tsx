import { useState } from "react"
import type { FormEvent } from "react"
import { brandTiers, retainers, workshops, RETAINER_NOTE, WORKSHOP_NOTE, PRICES_ARE_PROPOSED, SERVICES, BUDGETS, DELIVERY, AGREEMENT, PHONE, PHONE_DISPLAY } from "@/data/offers"
import type { Tier } from "@/data/offers"

const Check = () => (
  <svg viewBox="0 0 16 16" className="mt-1 h-3.5 w-3.5 shrink-0 text-stone-700" aria-hidden="true"><path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
)
const H = ({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) => (
  <div className="mb-8 max-w-2xl">
    <p className="text-[11px] uppercase tracking-[0.24em] text-stone-500">{eyebrow}</p>
    <h2 className="mt-2 text-[28px] font-semibold leading-tight text-stone-900 sm:text-4xl">{title}</h2>
    {sub && <p className="mt-3 text-[15px] leading-relaxed text-stone-600">{sub}</p>}
  </div>
)
function Card({ t }: { t: Tier }) {
  return (
    <article className="flex flex-col rounded-2xl border border-stone-200 bg-[#fbf8f3] p-5">
      <h3 className="text-lg font-semibold text-stone-900">{t.name}</h3>
      <p className="mt-1 text-[13px] text-stone-500">{t.for}</p>
      <p className="mt-4 text-2xl font-semibold text-stone-900" data-price={t.id}>{t.price}</p>
      {PRICES_ARE_PROPOSED && <p className="text-[11px] uppercase tracking-wider text-amber-700">Proposed</p>}
      <p className="mt-1 text-[13px] text-stone-600">Turnaround: {t.turnaround}</p>
      <ul className="mt-4 space-y-2 text-[14px] text-stone-700">
        {t.deliverables.map(d => <li key={d} className="flex gap-2"><Check />{d}</li>)}
      </ul>
    </article>
  )
}
const wrap = "mx-auto max-w-6xl px-5 py-16 sm:px-8"

export function Hero() {
  return (
    <section className={wrap} id="about">
      <p className="text-[11px] uppercase tracking-[0.24em] text-stone-500">SHOPNASGFX ~ part of OwnYourWeb Systems</p>
      <h1 className="mt-3 text-[34px] font-semibold leading-[1.1] text-stone-900 sm:text-5xl">I build brands that run with SI behind them.</h1>
      <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-stone-600">Strategy first, then design. You leave with a full brand system and a set of SI prompts trained on it, so every flyer, post, and mockup after launch still looks and sounds like you.</p>
      <dl className="mt-8 flex gap-8">
        <div><dt className="text-[12px] text-stone-500">Founders and owners helped</dt><dd className="text-3xl font-semibold text-stone-900">500+</dd></div>
        <div><dt className="text-[12px] text-stone-500">Designing since</dt><dd className="text-3xl font-semibold text-stone-900">2015</dd></div>
      </dl>
      <a href="#start" className="mt-8 inline-block rounded-full bg-stone-900 px-6 py-3 text-[14px] font-medium text-[#f6f1e9]">Start a brand project</a>
    </section>
  )
}

export function Services() {
  return (
    <section className={wrap} id="services">
      <H eyebrow="Services" title="Brand systems, not single files" sub="Every system includes logo, colors, type, voice, and SI prompts trained on your brand. Prices below are proposed and confirmed before any deposit." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{brandTiers.map(t => <Card key={t.id} t={t} />)}</div>
      <div className="mt-14"><H eyebrow="Brand on retainer" title="Your brand, kept running every month" sub={RETAINER_NOTE} /></div>
      <div className="grid gap-4 sm:grid-cols-3">{retainers.map(t => <Card key={t.id} t={t} />)}</div>
      <div className="mt-14"><H eyebrow="Teach the process" title="SI Brand Workshops" sub={WORKSHOP_NOTE} /></div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{workshops.map(t => <Card key={t.id} t={t} />)}</div>
    </section>
  )
}

const steps = [
  ["Strategy", "Positioning, audience, and story come first. Design follows the decisions."],
  ["Design", "I design the identity by hand: logo, colors, type, and voice."],
  ["Train", "I write a set of SI prompts trained on your brand rules so output stays on brand."],
  ["Scale", "SI handles the grunt work: resizes, variations, mockups, and social cuts. I review everything, so turnaround is faster without losing the look."],
]
export function HowSI() {
  return (
    <section className={wrap} id="how">
      <H eyebrow="How I work with SI" title="A human designer with superintelligence doing the busywork" />
      <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map(([t, d], i) => (
          <li key={t} className="rounded-2xl border border-stone-200 bg-[#fbf8f3] p-5">
            <span className="text-[12px] font-semibold text-stone-500">0{i + 1}</span>
            <h3 className="mt-1 text-lg font-semibold text-stone-900">{t}</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-stone-600">{d}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

// Uses only existing portfolio files. "Before" = a single logo file; "After" = the same client's full mark set.
const showcases = [
  { name: "Honey & Friends Events", single: "./logos/honey-and-friends-horizontal.png", system: ["./logos/honey-and-friends-horizontal.png", "./logos/honey-and-friends-stacked.png", "./logos/honey-and-friends-badge.png", "./logos/honey-and-friends-monogram.png"] },
  { name: "Omni Global Solutions LLC", single: "./logos/omni-global-full.png", system: ["./logos/omni-global-full.png", "./logos/omni-global-wordmark.png", "./logos/omni-global-icon.png"] },
  { name: "10 for 10 Boxing", single: "./logos/10-for-10-boxing-black.svg", system: ["./logos/10-for-10-boxing-black.svg", "./logos/10-for-10-boxing-white.svg", "./logos/10-for-10-boxing-logo-black-website.png"] },
]
export function Showcase() {
  return (
    <section className={wrap} id="showcase">
      <H eyebrow="Single file vs. system" title="One logo is a file. A set of marks is a system." sub="Real portfolio work. Left: one logo file. Right: the set of marks from the same project, ready for every format." />
      <div className="space-y-6">
        {showcases.map(s => (
          <figure key={s.name} className="grid gap-3 rounded-2xl border border-stone-200 bg-[#fbf8f3] p-4 sm:grid-cols-[1fr_2fr]">
            <div><p className="mb-2 text-[11px] uppercase tracking-wider text-stone-500">Single file</p>
              <div className="flex h-32 items-center justify-center rounded-xl bg-white p-3"><img src={s.single} alt={`${s.name} logo`} className="max-h-full max-w-full object-contain" loading="lazy" /></div></div>
            <div><p className="mb-2 text-[11px] uppercase tracking-wider text-stone-500">Mark system</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{s.system.map(src => (
                <div key={src} className={`flex h-24 items-center justify-center rounded-xl p-2 ${/white/.test(src) ? "bg-[#2b2724]" : "bg-white"}`}><img src={src} alt={`${s.name} mark`} className="max-h-full max-w-full object-contain" loading="lazy" /></div>))}</div></div>
            <figcaption className="text-[13px] text-stone-600 sm:col-span-2">{s.name}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

type Errors = Record<string, string>
export function validate(d: Record<string, string>): Errors {
  const e: Errors = {}
  if (!d.firstName?.trim()) e.firstName = "Enter your first name."
  if (!d.lastName?.trim()) e.lastName = "Enter your last name."
  if (!SERVICES.includes(d.serviceType)) e.serviceType = "Select a service."
  if (!d.details?.trim()) e.details = "Tell me about the project."
  if (!BUDGETS.includes(d.budget)) e.budget = "Select a budget."
  if (!DELIVERY.includes(d.delivery)) e.delivery = "Select a timeframe."
  if (d.depositAgreement !== "agreed") e.depositAgreement = "Please check the deposit agreement box before sending your details."
  return e
}
export function buildMessage(d: Record<string, string>) {
  return `Hi Nasirr, I'd like to discuss a brand project.\n\nName: ${d.firstName.trim()} ${d.lastName.trim()}\nService: ${d.serviceType}\nProject details: ${d.details.trim()}\nBudget: ${d.budget}\nTimeframe: ${d.delivery}\nDeposit agreement: Agreed. ${AGREEMENT}\n\nSent from shopnasgfx`
}

export function Intake() {
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState("")
  const [msg, setMsg] = useState("")
  const read = (f: HTMLFormElement) => Object.fromEntries(new FormData(f)) as Record<string, string>
  const onSubmit = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault()
    const d = read(ev.currentTarget); const e = validate(d); setErrors(e)
    if (Object.keys(e).length) return
    const m = buildMessage(d); setMsg(m)
    window.location.href = `sms:${PHONE}?&body=${encodeURIComponent(m)}`
    setStatus(`Your text is ready. Tap send in your messaging app. If it did not open, copy the message below and text it to ${PHONE_DISPLAY}.`)
  }
  const field = "mt-1 w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-[15px] text-stone-900"
  const Err = ({ n }: { n: string }) => errors[n] ? <p className="mt-1 text-[13px] text-red-700" role="alert">{errors[n]}</p> : null
  const Sel = ({ n, label, opts }: { n: string; label: string; opts: string[] }) => (
    <label className="block text-[13px] text-stone-700">{label}<select name={n} required defaultValue="" className={field}><option value="" disabled>Choose one</option>{opts.map(o => <option key={o}>{o}</option>)}</select><Err n={n} /></label>
  )
  return (
    <section className={wrap} id="start">
      <H eyebrow="Start a project" title="Tell me about your brand" sub={`This prepares a text to ${PHONE_DISPLAY}. No payment today; I confirm scope and price first.`} />
      <form onSubmit={onSubmit} noValidate className="max-w-xl space-y-4 rounded-2xl border border-stone-200 bg-[#fbf8f3] p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-[13px] text-stone-700">First name<input name="firstName" required maxLength={60} className={field} /><Err n="firstName" /></label>
          <label className="block text-[13px] text-stone-700">Last name<input name="lastName" required maxLength={60} className={field} /><Err n="lastName" /></label>
        </div>
        <Sel n="serviceType" label="Service" opts={SERVICES} />
        <label className="block text-[13px] text-stone-700">Project details<textarea name="details" required maxLength={500} rows={4} className={field} /><Err n="details" /></label>
        <Sel n="budget" label="Budget" opts={BUDGETS} />
        <Sel n="delivery" label="Timeframe" opts={DELIVERY} />
        <label className="flex gap-3 text-[14px] leading-relaxed text-stone-800">
          <input type="checkbox" name="depositAgreement" value="agreed" required className="mt-1 h-5 w-5 shrink-0" />
          <span>{AGREEMENT}</span>
        </label>
        <Err n="depositAgreement" />
        <button type="submit" className="w-full rounded-full bg-stone-900 px-6 py-3 text-[15px] font-medium text-[#f6f1e9]">Prepare my text</button>
        {status && <p className="text-[13px] text-stone-600" aria-live="polite">{status}</p>}
        {msg && <textarea readOnly value={msg} rows={8} className={field} aria-label="Message to copy" />}
      </form>
    </section>
  )
}
