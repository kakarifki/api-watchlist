import { Context, Next } from 'hono'
import { verifyJwt } from '../utils/jwt'

export async function authMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header('authorization') || ''
  const [, token] = authHeader.split(' ')
  if (!token) return c.json({ message: 'Unauthorized' }, 401)
  try {
    const payload = verifyJwt(token)
    c.set('user', payload)
    await next()
  } catch {
    return c.json({ message: 'Invalid token' }, 401)
  }
}


