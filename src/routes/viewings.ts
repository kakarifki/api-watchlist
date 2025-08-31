import { Hono } from 'hono'
import { prisma } from '../db'
import { z } from 'zod'
import { SearchService } from '../services/search'
import { EnvConfig } from '../config/env'

const searchQuery = z.object({
  query: z.string().min(1),
  category: z.enum(['movie', 'series', 'anime']).optional(),
  page: z.string().transform(Number).default('1'),
})

export function createViewingsRouter(config: EnvConfig) {
  const router = new Hono()
  const searchService = new SearchService(config)

  router.get('/:id', async (c) => {
    const id = c.req.param('id')
    const v = await prisma.viewings.findUnique({ where: { id } })
    if (!v) return c.json({ message: 'Not found' }, 404)
    return c.json(v)
  })

  router.get('/search', async (c) => {
    try {
      const q = Object.fromEntries(new URLSearchParams(c.req.url.split('?')[1] || ''))
      const parsed = searchQuery.safeParse(q)
      if (!parsed.success) return c.json({ message: 'Invalid query' }, 400)
      
      const { query, category, page } = parsed.data
      
      const searchResponse = await searchService.search(query, category, page)
      
      return c.json({
        items: searchResponse.items,
        total: searchResponse.total,
        page: searchResponse.page,
        hasNextPage: searchResponse.hasNextPage,
      })
    } catch (error) {
      console.error('Search error:', error)
      const message = error instanceof Error ? error.message : 'Search failed'
      return c.json({ message, error: 'SEARCH_ERROR' }, 500)
    }
  })

  // Get details from external API
  router.get('/:id/details', async (c) => {
    try {
      const id = c.req.param('id')
      const viewing = await prisma.viewings.findUnique({ where: { id } })
      
      if (!viewing) {
        return c.json({ message: 'Viewing not found' }, 404)
      }
      
      const details = await searchService.getDetails(
        viewing.externalId,
        viewing.externalSource
      )
      
      return c.json({
        viewing,
        details
      })
    } catch (error) {
      console.error('Get details error:', error)
      const message = error instanceof Error ? error.message : 'Failed to get details'
      return c.json({ message, error: 'DETAILS_ERROR' }, 500)
    }
  })

  return router
}


