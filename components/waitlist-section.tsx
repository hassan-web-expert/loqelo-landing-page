import { Briefcase, Home } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { WaitlistForm } from '@/components/waitlist-form'
import type { CountryOption } from '@/lib/countries'
import type { Messages } from '@/lib/i18n'

export function WaitlistSection({ messages, countries }: { messages: Messages; countries: CountryOption[] }) {
  const t = messages.waitlist
  const cards = [
    { role: 'customer' as const, icon: Home, copy: t.customer, accent: 'bg-primary/10 text-primary' },
    { role: 'provider' as const, icon: Briefcase, copy: t.provider, accent: 'bg-foreground/5 text-foreground' },
  ]

  return (
    <section id="waitlist" aria-labelledby="waitlist-title" className="scroll-mt-20 px-5 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-primary">{t.eyebrow}</p>
          <h2 id="waitlist-title" className="mt-3 text-balance text-heading font-semibold tracking-tight">
            {t.title}
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">{t.subtitle}</p>
        </Reveal>

        <div className="mt-12 grid gap-5 md:mt-14 lg:grid-cols-2 lg:gap-6">
          {cards.map(({ role, icon: Icon, copy, accent }, i) => (
            <Reveal key={role} delay={i * 0.08}>
              <article
                id={`join-${role}`}
                aria-labelledby={`join-${role}-title`}
                className="scroll-mt-24 rounded-[20px] border border-border bg-card p-6 shadow-[0_30px_80px_-50px_oklch(0.26_0.04_215/0.45)] md:p-8"
              >
                <header className="mb-7 flex items-start gap-4">
                  <span className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${accent}`}>
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 id={`join-${role}-title`} className="text-xl font-semibold">{copy.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{copy.body}</p>
                  </div>
                </header>
                <WaitlistForm role={role} countries={countries} />
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
