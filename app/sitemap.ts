import { siteConfig } from '@/config/site'
import { getAllMinuteCryptics } from '@/lib/minute-cryptic-data'
import { getAllConnectionsPuzzles } from '@/lib/connections-data'
import { getAllStrandsPuzzles } from '@/lib/strands-data'
import { getAllWordlePuzzles } from '@/lib/wordle-data'
import { getPosts } from '@/lib/getBlogs'
import { DEFAULT_LOCALE } from '@/i18n/routing'
import { MetadataRoute } from 'next'

const siteUrl = siteConfig.url

type ChangeFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' | undefined

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    '',
    '/daily-cryptic',
    '/cryptic-crossword-for-beginners',
    '/cryptic-clue-types',
    '/cryptic-clue-types/anagram',
    '/cryptic-clue-types/charade',
    '/cryptic-clue-types/container',
    '/cryptic-clue-types/double-definition',
    '/cryptic-indicators',
    '/minute-cryptic-today',
    '/how-to-play-minute-cryptic',
    '/minute-cryptic-faq',
    '/minute-cryptic',
    '/minute-cryptic/easy',
    '/minute-cryptic/medium',
    '/minute-cryptic/hard',
    '/minute-cryptic-unlimited',
    '/anagram-solver',
    '/connections-hint-today',
    '/connections-hint',
    '/connections-game',
    '/wordle-answer-today',
    '/wordle-answer',
    '/strands-hint-today',
    '/strands-hint',
    '/strands-game',
    '/quordle',
    '/blog',
    '/share',
    '/about',
    '/contact',
    '/privacy-policy',
    '/terms-of-service',
  ]

  const pages = staticPages.map(page => ({
    url: `${siteUrl}${page}`,
    lastModified: new Date(),
    changeFrequency: (page === '' || page === '/minute-cryptic-today' || page === '/daily-cryptic' || page === '/connections-hint-today' || page === '/connections-hint' || page === '/strands-hint-today' || page === '/strands-hint' || page === '/wordle-answer-today' || page === '/wordle-answer' || page === '/quordle'
      ? 'daily'
      : page === '/blog'
        ? 'weekly'
        : 'weekly') as ChangeFrequency,
    priority: page === ''
      ? 1.0
      : page === '/daily-cryptic'
        ? 0.95
        : page === '/minute-cryptic-today'
          ? 0.95
          : page === '/connections-hint-today'
            ? 0.95
            : page === '/wordle-answer-today'
              ? 0.95
              : page === '/strands-hint-today'
                ? 0.95
              : page === '/quordle'
                ? 0.9
              : page === '/blog'
                ? 0.85
                : 0.8,
  }))

  // Puzzle pages
  const allPuzzles = await getAllMinuteCryptics()
  const puzzlePages = allPuzzles.map(puzzle => ({
    url: `${siteUrl}/minute-cryptic/${puzzle.printDate}`,
    lastModified: new Date(puzzle.printDate),
    changeFrequency: 'monthly' as ChangeFrequency,
    priority: 0.6,
  }))

  // Connections hint pages
  const allConnections = await getAllConnectionsPuzzles()
  const connectionsPages = allConnections.map(puzzle => ({
    url: `${siteUrl}/connections-hint/${puzzle.printDate}`,
    lastModified: new Date(puzzle.printDate),
    changeFrequency: 'monthly' as ChangeFrequency,
    priority: 0.6,
  }))

  // Strands hint pages
  const allStrands = await getAllStrandsPuzzles()
  const strandsPages = allStrands.map(puzzle => ({
    url: `${siteUrl}/strands-hint/${puzzle.printDate}`,
    lastModified: new Date(puzzle.printDate),
    changeFrequency: 'monthly' as ChangeFrequency,
    priority: 0.6,
  }))

  // Wordle answer pages
  const allWordle = await getAllWordlePuzzles()
  const wordlePages = allWordle.map(puzzle => ({
    url: `${siteUrl}/wordle-answer/${puzzle.printDate}`,
    lastModified: new Date(puzzle.printDate),
    changeFrequency: 'monthly' as ChangeFrequency,
    priority: 0.6,
  }))

  // Blog post pages
  const { posts } = await getPosts(DEFAULT_LOCALE)
  const postPages = posts
    .filter(post => Boolean(post.slug))
    .map(post => {
      const normalizedSlug = post.slug.startsWith('/') ? post.slug : `/${post.slug}`
      const postPath = normalizedSlug.startsWith('/blog/')
        ? normalizedSlug
        : `/blog${normalizedSlug}`

      return {
        url: `${siteUrl}${postPath}`,
        lastModified: post.date ? new Date(post.date) : new Date(),
        changeFrequency: 'monthly' as ChangeFrequency,
        priority: 0.7,
      }
    })

  return [
    ...pages,
    ...puzzlePages,
    ...connectionsPages,
    ...strandsPages,
    ...wordlePages,
    ...postPages,
  ]
}
