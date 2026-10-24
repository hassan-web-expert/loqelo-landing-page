'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'
import { Play } from 'lucide-react'
import { useI18n } from '@/components/i18n-provider'
import { track } from '@/lib/analytics'

export function VideoCard() {
  const { messages } = useI18n()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [state, setState] = useState<'idle' | 'playing' | 'unavailable'>('idle')

  const play = async () => {
    const video = videoRef.current
    if (!video) return
    track('play_video')
    try {
      video.load()
      await video.play()
      setState('playing')
    } catch {
      setState('unavailable')
    }
  }

  return (
    <div className="glass-card relative rounded-[20px] p-2 md:p-3">
      <div className="relative aspect-video overflow-hidden rounded-[14px] bg-brand-deep">
        <video
          ref={videoRef}
          className={state === 'playing' ? 'absolute inset-0 size-full object-cover' : 'hidden'}
          controls
          playsInline
          preload="none"
          poster="/media/poster.png"
          onError={() => setState('unavailable')}
        >
          <source src="/media/promo.mp4" type="video/mp4" />
        </video>
        {state !== 'playing' && (
          <>
            <Image
              src="/media/poster.png"
              alt=""
              fill
              priority
              sizes="(min-width: 1024px) 896px, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-deep/70 via-brand-deep/10 to-transparent" />
            {state === 'idle' ? (
              <button
                type="button"
                onClick={play}
                className="group absolute inset-0 flex items-center justify-center focus-visible:outline-none"
                aria-label={messages.hero.videoLabel}
              >
                <span className="flex items-center gap-3 rounded-full border border-white/30 bg-white/15 py-2 pl-2 pr-5 text-sm font-medium text-white backdrop-blur-md transition-all group-hover:bg-white/25 group-focus-visible:ring-2 group-focus-visible:ring-white">
                  <span className="flex size-10 items-center justify-center rounded-full bg-white text-brand-deep transition-transform group-hover:scale-105">
                    <Play className="size-4 translate-x-px fill-current" aria-hidden="true" />
                  </span>
                  {messages.hero.videoLabel}
                </span>
              </button>
            ) : (
              <p role="status" className="absolute inset-x-0 bottom-0 p-5 text-center text-sm font-medium text-white">
                {messages.hero.videoUnavailable}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  )
}
