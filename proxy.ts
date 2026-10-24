import { NextResponse, type NextRequest } from 'next/server'
import {
  countryLocale,
  defaultLocale,
  isLocale,
  LOCALE_COOKIE,
  locales,
  matchAcceptLanguage,
  type Locale,
} from '@/lib/i18n'

const ONE_YEAR = 60 * 60 * 24 * 365

function detectLocale(request: NextRequest): Locale {
  const cookie = request.cookies.get(LOCALE_COOKIE)?.value
  if (isLocale(cookie)) return cookie
  const fromHeader = matchAcceptLanguage(request.headers.get('accept-language'))
  if (fromHeader) return fromHeader
  const country = request.headers.get('x-vercel-ip-country')?.toUpperCase()
  if (country && countryLocale[country]) return countryLocale[country]
  return defaultLocale
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const segment = pathname.split('/')[1]

  if (isLocale(segment)) {
    const response = NextResponse.next()
    if (request.cookies.get(LOCALE_COOKIE)?.value !== segment) {
      response.cookies.set(LOCALE_COOKIE, segment, { path: '/', maxAge: ONE_YEAR, sameSite: 'lax' })
    }
    return response
  }

  const locale = detectLocale(request)
  const url = request.nextUrl.clone()
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|brand|media|sitemap.xml|robots.txt|.*\\..*).*)'],
}

export { locales }
