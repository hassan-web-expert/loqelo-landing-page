import { BadgeCheck, Inbox, MessageSquareText, UsersRound } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import type { Messages } from '@/lib/i18n'

const icons = [MessageSquareText, UsersRound, Inbox, BadgeCheck]

export function HowItWorks({ messages }: { messages: Messages }) {
  return (
    <section id="how-it-works" aria-labelledby="how-title" className="scroll-mt-20 px-5 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-primary">{messages.how.eyebrow}</p>
          <h2 id="how-title" className="mt-3 text-balance text-heading font-semibold tracking-tight">
            {messages.how.title}
          </h2>
        </Reveal>

        <div className="relative mt-14 md:mt-16">
          <div
            aria-hidden="true"
            className="absolute left-[12.5%] right-[12.5%] top-7 hidden h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent lg:block"
          />
          <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {messages.how.steps.map((step, i) => {
              const Icon = icons[i]
              return (
                <li key={step.title}>
                  <Reveal delay={i * 0.08} className="h-full">
                    <article className="relative flex h-full flex-col rounded-[20px] border border-border bg-card p-6 shadow-[0_1px_2px_oklch(0_0_0/0.04)] transition-shadow hover:shadow-[0_20px_50px_-30px_oklch(0.26_0.04_215/0.35)]">
                      <div className="flex items-center justify-between">
                        <span className="relative flex size-14 items-center justify-center rounded-2xl bg-secondary text-primary ring-8 ring-background">
                          <Icon className="size-6" aria-hidden="true" />
                        </span>
                        <span className="font-mono text-xs text-muted-foreground">{`0${i + 1}`}</span>
                      </div>
                      <h3 className="mt-6 text-lg font-semibold">{step.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
                    </article>
                  </Reveal>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}
