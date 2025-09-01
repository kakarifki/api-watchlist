import { createFactory } from 'hono/factory'
import { logger } from 'hono/logger'
import { z } from 'zod'

// Example showing Hono's recommended factory pattern
// This is the preferred way when you need controller-like functionality
// instead of Rails-like controllers

const factory = createFactory()

// Define schemas
const userSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
})

// Create middleware with proper type inference
const authMiddleware = factory.createMiddleware(async (c, next) => {
  const token = c.req.header('Authorization')?.replace('Bearer ', '')
  if (!token) {
    return c.json({ message: 'Unauthorized' }, 401)
  }
  // Set user data in context
  c.set('user', { id: 'user-123', token })
  await next()
})

// Create handlers with proper type inference
const createUserHandlers = factory.createHandlers(
  logger(),
  authMiddleware,
  async (c) => {
    const body = await c.req.json()
    const parsed = userSchema.safeParse(body)
    if (!parsed.success) {
      return c.json({ message: 'Invalid input' }, 400)
    }
    
    const user = c.get('user') // TypeScript knows this exists due to middleware
    return c.json({ 
      message: 'User created', 
      data: parsed.data,
      createdBy: user.id 
    }, 201)
  }
)

const getUserHandlers = factory.createHandlers(
  logger(),
  authMiddleware,
  async (c) => {
    const userId = c.req.param('id') // TypeScript can infer this parameter
    const user = c.get('user')
    
    return c.json({ 
      id: userId,
      message: 'User retrieved',
      requestedBy: user.id 
    })
  }
)

// Usage in your main app:
// app.post('/users', ...createUserHandlers)
// app.get('/users/:id', ...getUserHandlers)

export { createUserHandlers, getUserHandlers }
