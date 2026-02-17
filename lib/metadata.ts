import { siteConfig } from '@/config/site'
import { DEFAULT_LOCALE, LOCALE_NAMES, Locale } from '@/i18n/routing'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

type MetadataProps = {
  page?: string
  title?: string
  description?: string
  images?: string[]
  keywords?: string[]
  noIndex?: boolean
  locale: Locale
  path?: string
  canonicalUrl?: string
}

export async function constructMetadata({
  page = 'Home',
  title,
  description,
  images = [],
  keywords = [],
  noIndex = false,
  locale,
  path,
  canonicalUrl,
}: MetadataProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'Home' })

  const pageTitle = title || t(`title`)
  const pageDescription = description || t(`description`)
  const homeTagLine = t('tagLine')
  const normalizedTitle = pageTitle.toLowerCase()
  const normalizedSiteName = siteConfig.name.toLowerCase()

  const finalTitle = page === 'Home'
    ? (pageTitle.includes('|') || normalizedTitle.includes(homeTagLine.toLowerCase())
      ? pageTitle
      : `${pageTitle} - ${homeTagLine}`)
    : (normalizedTitle.includes(normalizedSiteName)
      ? pageTitle
      : `${pageTitle} | ${siteConfig.name}`)

  const imageUrls = images.length > 0
    ? images.map(img => ({
      url: img.startsWith('http') ? img : `${siteConfig.url}/${img}`,
      alt: pageTitle,
    }))
    : [{
      url: `${siteConfig.url}/og.png`,
      alt: pageTitle,
    }]

  const pathForAlternates = canonicalUrl ?? path ?? '/'
  const normalizedCanonicalPath = pathForAlternates === '/' ? '' : pathForAlternates
  const localizedPath = `${locale === DEFAULT_LOCALE ? '' : `/${locale}`}${path || ''}`
  const pageURL = `${siteConfig.url}${localizedPath}`

  const alternateLanguages = Object.keys(LOCALE_NAMES).reduce((acc, lang) => {
    const altPath = `${lang === DEFAULT_LOCALE ? '' : `/${lang}`}${normalizedCanonicalPath}`
    acc[lang] = `${siteConfig.url}${altPath}`

    return acc
  }, {} as Record<string, string>)
  alternateLanguages['x-default'] = `${siteConfig.url}${normalizedCanonicalPath}`

  return {
    title: finalTitle,
    description: pageDescription,
    keywords: keywords.length > 0 ? keywords : [
      'minute cryptic', 'minute cryptic hints', 'minute cryptic today',
      'dailycryptic', 'daily cryptic',
      'cryptic clue', 'cryptic clue today',
      'daily cryptic clue', 'cryptic puzzle hints',
      'how to solve cryptic clues',
    ],
    authors: siteConfig.authors,
    creator: siteConfig.creator,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: `${siteConfig.url}${locale === DEFAULT_LOCALE ? '' : `/${locale}`}${normalizedCanonicalPath}`,
      languages: alternateLanguages,
    },
    openGraph: {
      type: 'website',
      title: finalTitle,
      description: pageDescription,
      url: pageURL,
      siteName: siteConfig.name,
      locale: locale,
      images: imageUrls,
    },
    twitter: {
      card: 'summary_large_image',
      title: finalTitle,
      description: pageDescription,
      site: siteConfig.creator,
      images: imageUrls,
      creator: siteConfig.creator,
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      nocache: noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-snippet': -1,
        'max-image-preview': 'large',
        'max-video-preview': -1,
      },
    },
  }
}
