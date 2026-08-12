import { siteConfig } from '@/config/site'
import { getAllMinuteCryptics } from '@/lib/minute-cryptic-data'
import { getAllConnectionsPuzzles } from '@/lib/connections-data'
import { getAllStrandsPuzzles } from '@/lib/strands-data'
import { getAllSpellingBeePuzzles } from '@/lib/spelling-bee-data'
import { getAllPipsPuzzles } from '@/lib/pips-data'
import { getAllLetterBoxedPuzzles } from '@/lib/letter-boxed-data'
import { getAllWordlePuzzles } from '@/lib/wordle-data'
import { MODES, LETTERS } from '@/lib/word-lists-data'
import { getAllLinkedInDates } from '@/lib/linkedin-data'
import { LINKEDIN_GAMES } from '@/config/linkedin-games'
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
    '/cryptic-misleading-words',
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
    '/wordle-solver',
    '/5-letter-words',
    '/wordle-unlimited',
    '/strands-hint-today',
    '/strands-hint',
    '/strands-game',
    '/spelling-bee-answers-today',
    '/spelling-bee-answers',
    '/pips-answers-today',
    '/pips-answers',
    '/letter-boxed-answers-today',
    '/letter-boxed-answers',
    '/quordle',
    '/linkedin-games-answers',
    ...LINKEDIN_GAMES.map(game => `/${game.slug}`),
    '/blog',
    '/share',
    '/about',
    '/contact',
    '/privacy-policy',
    '/terms-of-service',
  ]

  // LinkedIn cluster pages refresh daily like the other "today" routes.
  const linkedinDailyPages = new Set([
    '/linkedin-games-answers',
    ...LINKEDIN_GAMES.map(game => `/${game.slug}`),
  ])

  const pages = staticPages.map(page => ({
    url: `${siteUrl}${page}`,
    lastModified: new Date(),
    changeFrequency: (linkedinDailyPages.has(page) || page === '' || page === '/minute-cryptic-today' || page === '/daily-cryptic' || page === '/connections-hint-today' || page === '/connections-hint' || page === '/strands-hint-today' || page === '/strands-hint' || page === '/wordle-answer-today' || page === '/wordle-answer' || page === '/spelling-bee-answers-today' || page === '/spelling-bee-answers' || page === '/pips-answers-today' || page === '/pips-answers' || page === '/letter-boxed-answers-today' || page === '/letter-boxed-answers' || page === '/quordle'
      ? 'daily'
      : page === '/blog'
        ? 'weekly'
        : 'weekly') as ChangeFrequency,
    priority: page === ''
      ? 1.0
      : linkedinDailyPages.has(page)
        ? 0.95
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
              : page === '/spelling-bee-answers-today'
                ? 0.95
              : page === '/pips-answers-today'
                ? 0.95
              : page === '/letter-boxed-answers-today'
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

  // Spelling Bee answer pages
  const allSpellingBee = await getAllSpellingBeePuzzles()
  const spellingBeePages = allSpellingBee.map(puzzle => ({
    url: `${siteUrl}/spelling-bee-answers/${puzzle.printDate}`,
    lastModified: new Date(puzzle.printDate),
    changeFrequency: 'monthly' as ChangeFrequency,
    priority: 0.6,
  }))

  // Pips answer pages
  const allPips = await getAllPipsPuzzles()
  const pipsPages = allPips.map(puzzle => ({
    url: `${siteUrl}/pips-answers/${puzzle.printDate}`,
    lastModified: new Date(puzzle.printDate),
    changeFrequency: 'monthly' as ChangeFrequency,
    priority: 0.6,
  }))

  // Letter Boxed answer pages
  const allLetterBoxed = await getAllLetterBoxedPuzzles()
  const letterBoxedPages = allLetterBoxed.map(puzzle => ({
    url: `${siteUrl}/letter-boxed-answers/${puzzle.printDate}`,
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

  // 5-letter word-list spoke pages (4 modes × 26 letters)
  const wordListPages = MODES.flatMap(mode =>
    LETTERS.map(letter => ({
      url: `${siteUrl}/5-letter-words/${mode}/${letter.toLowerCase()}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as ChangeFrequency,
      priority: 0.5,
    }))
  )

  // LinkedIn game archive pages (one per game per covered date)
  const linkedinArchivePages = (
    await Promise.all(
      LINKEDIN_GAMES.map(async game => {
        const dates = await getAllLinkedInDates(game.key)
        return dates.map(date => ({
          url: `${siteUrl}/${game.slug}/${date}`,
          lastModified: new Date(date),
          changeFrequency: 'monthly' as ChangeFrequency,
          priority: 0.6,
        }))
      })
    )
  ).flat()

  return [
    ...pages,
    ...wordListPages,
    ...linkedinArchivePages,
    ...puzzlePages,
    ...connectionsPages,
    ...strandsPages,
    ...spellingBeePages,
    ...pipsPages,
    ...letterBoxedPages,
    ...wordlePages,
    ...postPages,
  ]
}
