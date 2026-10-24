'use client'

import Link from 'next/link'
import { useId, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { joinWaitlist } from '@/app/actions/waitlist'
import { useI18n } from '@/components/i18n-provider'
import { track } from '@/lib/analytics'
import type { CountryOption } from '@/lib/countries'
import { waitlistFormSchema, type WaitlistFormValues, type WaitlistRole } from '@/lib/waitlist/schema'
import { cn } from '@/lib/utils'

type ErrorKey = keyof ReturnType<typeof useI18n>['messages']['waitlist']['errors']

const fieldClass =
  'h-12 w-full rounded-xl border border-input bg-background px-4 text-base text-foreground placeholder:text-muted-foreground/70 transition-colors focus-visible:border-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15 aria-[invalid=true]:border-destructive md:text-sm'

export function WaitlistForm({ role, countries }: { role: WaitlistRole; countries: CountryOption[] }) {
  const { locale, messages } = useI18n()
  const t = messages.waitlist
  const copy = t[role]
  const id = useId()
  const reduce = useReducedMotion()
  const startedAt = useRef(Date.now())
  const [status, setStatus] = useState<'idle' | 'success'>('idle')
  const [serverError, setServerError] = useState<ErrorKey | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<WaitlistFormValues>({
    resolver: zodResolver(waitlistFormSchema),
    defaultValues: { email: '', country: '', entityType: '', consent: false, website: '' },
    mode: 'onTouched',
  })

  const errorText = (key?: string) => (key && key in t.errors ? t.errors[key as ErrorKey] : key ? t.errors.required : null)

  const onSubmit = async (values: WaitlistFormValues) => {
    setServerError(null)
    const result = await joinWaitlist({ ...values, role, locale, startedAt: startedAt.current })
    if (result.ok) {
      track(role === 'customer' ? 'submit_customer_form' : 'submit_provider_form', { form: role })
      setStatus('success')
      reset()
      return
    }
    const reason = result.error === 'rateLimited' ? 'rate_limited' : result.error === 'invalid' ? 'validation' : 'server'
    track('form_error', { form: role, reason })
    setServerError(result.error === 'rateLimited' ? 'rateLimited' : 'server')
  }

  const onInvalid = () => track('form_error', { form: role, reason: 'validation' })

  const ids = {
    email: `${id}-email`,
    country: `${id}-country`,
    type: `${id}-type`,
    consent: `${id}-consent`,
  }

  return (
    <div className="relative">
      <AnimatePresence mode="wait" initial={false}>
        {status === 'success' ? (
          <motion.div
            key="success"
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0 }}
            role="status"
            aria-live="polite"
            className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl bg-secondary/60 p-8 text-center"
          >
            <span className="flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <CheckCircle2 className="size-7" aria-hidden="true" />
            </span>
            <h4 className="mt-5 text-xl font-semibold">{t.successTitle}</h4>
            <p className="mt-2 max-w-xs text-sm text-muted-foreground">{t.successBody}</p>
            <button
              type="button"
              onClick={() => {
                startedAt.current = Date.now()
                setStatus('idle')
              }}
              className="mt-6 text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            >
              {t.again}
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            onSubmit={handleSubmit(onSubmit, onInvalid)}
            noValidate
            className="flex flex-col gap-5"
            aria-label={copy.submit}
          >
            <div className="flex flex-col gap-2">
              <label htmlFor={ids.email} className="text-sm font-medium">
                {t.emailLabel} <span className="text-destructive" aria-hidden="true">*</span>
              </label>
              <input
                id={ids.email}
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder={t.emailPlaceholder}
                aria-required="true"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? `${ids.email}-error` : undefined}
                className={fieldClass}
                {...register('email')}
              />
              {errors.email && (
                <p id={`${ids.email}-error`} className="text-sm text-destructive">{errorText(errors.email.message)}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor={ids.country} className="text-sm font-medium">
                {copy.countryLabel} <span className="text-destructive" aria-hidden="true">*</span>
              </label>
              <select
                id={ids.country}
                autoComplete="country"
                aria-required="true"
                aria-invalid={!!errors.country}
                aria-describedby={errors.country ? `${ids.country}-error` : undefined}
                className={cn(fieldClass, 'appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2716%27 height=%2716%27 fill=%27none%27 stroke=%27%23667%27 stroke-width=%272%27 viewBox=%270 0 24 24%27%3E%3Cpath d=%27m6 9 6 6 6-6%27/%3E%3C/svg%3E")] bg-[length:16px] bg-[right_1rem_center] bg-no-repeat pr-10')}
                {...register('country')}
              >
                <option value="" disabled>{t.countryPlaceholder}</option>
                {countries.map((c) => (
                  <option key={c.code} value={c.code}>{c.name}</option>
                ))}
              </select>
              {errors.country && (
                <p id={`${ids.country}-error`} className="text-sm text-destructive">{errorText(errors.country.message)}</p>
              )}
            </div>

            <fieldset className="flex flex-col gap-2">
              <legend className="mb-2 text-sm font-medium">
                {copy.typeLabel} <span className="font-normal text-muted-foreground">({t.optional})</span>
              </legend>
              <div className="grid grid-cols-2 gap-2">
                {(['individual', 'business'] as const).map((value) => (
                  <label
                    key={value}
                    className="flex h-12 cursor-pointer items-center justify-center rounded-xl border border-input text-sm font-medium text-muted-foreground transition-colors hover:border-foreground/30 has-[:checked]:border-primary has-[:checked]:bg-primary/5 has-[:checked]:text-foreground has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-primary/15"
                  >
                    <input type="radio" value={value} className="sr-only" {...register('entityType')} />
                    {t.types[value]}
                  </label>
                ))}
              </div>
            </fieldset>

            <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
              <label>
                Website
                <input type="text" tabIndex={-1} autoComplete="off" {...register('website')} />
              </label>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-start gap-3">
                <input
                  id={ids.consent}
                  type="checkbox"
                  aria-required="true"
                  aria-invalid={!!errors.consent}
                  aria-describedby={errors.consent ? `${ids.consent}-error` : undefined}
                  className="mt-0.5 size-5 shrink-0 cursor-pointer rounded-md accent-[var(--primary)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
                  {...register('consent')}
                />
                <label htmlFor={ids.consent} className="text-sm leading-relaxed text-muted-foreground">
                  {t.consent}{' '}
                  <Link href={`/${locale}/privacy`} className="font-medium text-foreground underline underline-offset-4">
                    {t.privacyLink}
                  </Link>
                  . <span className="text-destructive" aria-hidden="true">*</span>
                </label>
              </div>
              {errors.consent && (
                <p id={`${ids.consent}-error`} className="text-sm text-destructive">{errorText(errors.consent.message)}</p>
              )}
            </div>

            {serverError && (
              <p role="alert" className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {t.errors[serverError]}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                'inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-medium transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-70',
                role === 'customer' ? 'bg-primary text-primary-foreground' : 'bg-foreground text-background',
              )}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  {t.submitting}
                </>
              ) : (
                copy.submit
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}
