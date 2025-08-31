import { Hono } from 'hono'
import { z } from 'zod'
import { prisma } from '../db'
import { createAuthMiddleware } from '../middlewares/auth'
import { generateSlug } from '../utils/slug'
import { EnvConfig } from '../config/env'

const createSchema = z.object({
  viewingId: z.string().min(1),
  ratingPlot: z.number().int().min(1).max(10),
  ratingCharacter: z.number().int().min(1).max(10),
  ratingWorld: z.number().int().min(1).max(10),
  textReview: z.string().min(1),
})

export function createReviewsRouter(config: EnvConfig) {
  const router = new Hono()
  const authMiddleware = createAuthMiddleware(config)

  router.post('/', authMiddleware, async (c) => {
    const user = c.get('user') as { sub: string }
    const body = await c.req.json()
    const parsed = createSchema.safeParse(body)
    if (!parsed.success) return c.json({ message: 'Invalid input' }, 400)

    const { viewingId, ratingPlot, ratingCharacter, ratingWorld, textReview } = parsed.data
    const ratingOverall = Math.round((ratingPlot + ratingCharacter + ratingWorld) / 3)
    const slug = generateSlug(textReview.slice(0, 24) || 'review')

    const created = await prisma.review.create({
      data: {
        userId: user.sub,
        viewingId,
        ratingPlot,
        ratingCharacter,
        ratingWorld,
        ratingOverall,
        textReview,
        slug,
      },
    })
    return c.json({ id: created.id, slug: created.slug })
  })

  router.get('/', async (c) => {
    const page = Number(c.req.query('page') || '1')
    const pageSize = Math.min(Number(c.req.query('pageSize') || '10'), 50)
    const category = c.req.query('category') as 'movie' | 'series' | 'anime' | undefined
    const where = category ? { viewing: { category } } : {}
    const [items, total] = await Promise.all([
      prisma.review.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { viewing: true, user: { select: { id: true, email: true } } },
      }),
      prisma.review.count({ where }),
    ])
    return c.json({ items, page, pageSize, total })
  })

  router.get('/:slug', async (c) => {
    const slug = c.req.param('slug')
    const review = await prisma.review.findUnique({ where: { slug }, include: { viewing: true, user: { select: { id: true, email: true } } } })
    if (!review) return c.json({ message: 'Not found' }, 404)
    return c.json(review)
  })

  return router
}


