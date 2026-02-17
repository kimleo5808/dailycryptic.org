import { siteConfig } from '@/config/site'
import { getAllMinuteCryptics } from '@/lib/minute-cryptic-data'
import { MetadataRoute } from 'next'

const siteUrl = siteConfig.url

type ChangeFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' | undefined

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    '',
    '/minute-cryptic-today',
    '/how-to-play-minute-cryptic',
    '/minute-cryptic-faq',
    '/minute-cryptic',
    '/about',
    '/contact',
    '/privacy-policy',
    '/terms-of-service',
  ]

  const pages = staticPages.map(page => ({
    url: `${siteUrl}${page}`,
    lastModified: new Date(),
    changeFrequency: (page === '' || page === '/minute-cryptic-today' ? 'daily' : 'weekly') as ChangeFrequency,
    priority: page === '' ? 1.0 : page === '/minute-cryptic-today' ? 0.95 : 0.8,
  }))

  // Puzzle pages
  const allPuzzles = await getAllMinuteCryptics()
  const puzzlePages = allPuzzles.map(puzzle => ({
    url: `${siteUrl}/minute-cryptic/${puzzle.printDate}`,
    lastModified: new Date(puzzle.printDate),
    changeFrequency: 'monthly' as ChangeFrequency,
    priority: 0.6,
  }))

  return [
    ...pages,
    ...puzzlePages,
  ]
}
