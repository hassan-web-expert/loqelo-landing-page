'use client'

import Image from 'next/image'
import { useI18n } from '@/components/i18n-provider'
import { Reveal } from '@/components/reveal'

const screens = ['/media/screens/screen-1.png', '/media/screens/screen-2.png', '/media/screens/screen-3.png']

export function ScreensStrip() {
  const { messages } = useI18n()
  return (
    <section aria-label={messages.hero.screensLabel} className="mx-auto mt-10 max-w-5xl md:mt-14">
      <ul className="screens-perspective -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-6 md:mx-0 md:justify-center md:gap-6 md:overflow-visible md:px-0">
        {screens.map((src, i) => (
          <li key={src} className="snap-center">
            <Reveal delay={0.1 * i}>
              <div
                className="screen-tilt w-[200px] shrink-0 overflow-hidden rounded-[18px] border border-border bg-card shadow-[0_24px_60px_-30px_oklch(0.26_0.04_215/0.45)] sm:w-[220px] md:w-[240px]"
                data-index={i}
              >
                <Image
                  src={src}
                  alt={messages.hero.screenAlts[i]}
                  width={720}
                  height={1280}
                  sizes="240px"
                  loading="lazy"
                  className="aspect-[9/16] h-auto w-full object-cover"
                />
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  )
}
