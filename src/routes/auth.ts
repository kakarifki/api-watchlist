import { Hono } from 'hono'
import { z } from 'zod'
import { prisma } from '../db'
import bcrypt from 'bcrypt'
import { signJwt } from '../utils/jwt'

const router = new Hono()

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

router.post('/login', async (c) => {
  const body = await c.req.json()
  const parsed = loginSchema.safeParse(body)
  if (!parsed.success) return c.json({ message: 'Invalid input' }, 400)
  const { email, password } = parsed.data

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return c.json({ message: 'Invalid credentials' }, 401)

  const ok = await bcrypt.compare(password, user.password)
  if (!ok) return c.json({ message: 'Invalid credentials' }, 401)

  const token = signJwt({ sub: user.id, email: user.email, role: user.role })
  return c.json({ token })
})

router.post('/register', async (c) => {
  if (String(process.env.ALLOW_REGISTER).toLowerCase() !== 'true') {
    return c.json({ message: 'Registration disabled' }, 403)
  }
  const body = await c.req.json()
  const parsed = registerSchema.safeParse(body)
  if (!parsed.success) return c.json({ message: 'Invalid input' }, 400)
  const { email, password } = parsed.data

  const exists = await prisma.user.findUnique({ where: { email } })
  if (exists) return c.json({ message: 'Email in use' }, 409)

  const passwordHash = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({ data: { email, password: passwordHash, role: 'admin' } })
  const token = signJwt({ sub: user.id, email: user.email, role: user.role })
  return c.json({ token })
})

export default router


