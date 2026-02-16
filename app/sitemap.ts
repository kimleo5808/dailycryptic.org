import { siteConfig } from '@/config/site'
import { getAllMinuteCryptics } from '@/lib/minute-cryptic-data'
import { getPosts } from '@/lib/getBlogs'
import { GUIDE_SLUGS } from '@/data/guides'
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

  // Guides pages
  const guidesIndex = {
    url: `${siteUrl}/guides`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as ChangeFrequency,
    priority: 0.7,
  }

  const guidePages = GUIDE_SLUGS.map(slug => ({
    url: `${siteUrl}/guides/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as ChangeFrequency,
    priority: 0.6,
  }))

  // Puzzle pages
  const allPuzzles = await getAllMinuteCryptics()
  const puzzlePages = allPuzzles.map(puzzle => ({
    url: `${siteUrl}/minute-cryptic/${puzzle.printDate}`,
    lastModified: new Date(puzzle.printDate),
    changeFrequency: 'monthly' as ChangeFrequency,
    priority: 0.6,
  }))

  // Blog pages
  const { posts } = await getPosts('en')

  const blogIndex = {
    url: `${siteUrl}/blog`,
    lastModified: new Date(),
    changeFrequency: 'daily' as ChangeFrequency,
    priority: 0.7,
  }

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
        changeFrequency: 'weekly' as ChangeFrequency,
        priority: 0.6,
      }
    })

  return [
    ...pages,
    guidesIndex,
    ...guidePages,
    ...puzzlePages,
    blogIndex,
    ...postPages,
  ]
}
