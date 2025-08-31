import { Hono } from 'hono'
import { z } from 'zod'
import { prisma } from '../db'
import { createAuthMiddleware } from '../middlewares/auth'
import { EnvConfig } from '../config/env'

const upsertSchema = z.object({
  viewingId: z.string().min(1),
  status: z.enum(['planned', 'watching', 'completed']),
})

export function createWatchlistRouter(config: EnvConfig) {
  const router = new Hono()
  const authMiddleware = createAuthMiddleware(config)

  router.post('/', authMiddleware, async (c) => {
    const user = c.get('user') as { sub: string }
    const body = await c.req.json()
    const parsed = upsertSchema.safeParse(body)
    if (!parsed.success) return c.json({ message: 'Invalid input' }, 400)
    const { viewingId, status } = parsed.data

    const item = await prisma.watchlist.upsert({
      where: { userId_viewingId: { userId: user.sub, viewingId } },
      update: { status },
      create: { userId: user.sub, viewingId, status },
    })
    return c.json(item)
  })

  router.get('/', authMiddleware, async (c) => {
    const user = c.get('user') as { sub: string }
    const status = c.req.query('status') as 'planned' | 'watching' | 'completed' | undefined
    const where = { userId: user.sub, ...(status ? { status } : {}) }
    const items = await prisma.watchlist.findMany({ where, include: { viewing: true } })
    return c.json({ items })
  })

  return router
}


