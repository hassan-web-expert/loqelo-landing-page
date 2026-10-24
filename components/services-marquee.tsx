import type { Messages } from '@/lib/i18n'

export function ServicesMarquee({ messages }: { messages: Messages }) {
  const items = messages.marquee.items
  return (
    <section aria-label={messages.marquee.label} className="border-y border-border/70 bg-card/50 py-5">
      <ul className="sr-only">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <div aria-hidden="true" className="marquee-mask overflow-hidden">
        <div className="marquee-track flex w-max gap-10">
          {[...items, ...items].map((item, i) => (
            <span key={`${item}-${i}`} className="flex items-center gap-10 whitespace-nowrap text-sm font-medium text-muted-foreground">
              {item}
              <span className="size-1 rounded-full bg-brand-mint" />
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
