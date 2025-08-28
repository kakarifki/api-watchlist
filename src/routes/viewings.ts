import { Hono } from 'hono'
import { prisma } from '../db'
import { z } from 'zod'

const router = new Hono()

router.get('/:id', async (c) => {
  const id = c.req.param('id')
  const v = await prisma.viewings.findUnique({ where: { id } })
  if (!v) return c.json({ message: 'Not found' }, 404)
  return c.json(v)
})

const searchQuery = z.object({
  query: z.string().min(1),
  category: z.enum(['movie', 'series', 'anime']).optional(),
})

router.get('/search', async (c) => {
  const q = Object.fromEntries(new URLSearchParams(c.req.url.split('?')[1] || ''))
  const parsed = searchQuery.safeParse(q)
  if (!parsed.success) return c.json({ message: 'Invalid query' }, 400)
  const { query, category } = parsed.data

  // TODO: integrate real TMDB/AniList. Keeping stub for now.
  const items = [{
    id: 'sample-ext',
    externalSource: (category === 'anime' ? 'ANILIST' : 'TMDB'),
    title: `${query} Sample`,
    category: category || 'movie',
    releaseYear: 2024,
    posterUrl: null,
    totalEps: category === 'anime' ? 12 : null,
  }]
  return c.json({ items })
})

export default router


