import { createFactory } from 'hono/factory'

const factory = createFactory()

export const errorHandler = factory.createMiddleware(async (c, next) => {
  try {
    await next()
  } catch (error) {
    console.error('Unhandled error:', error)
    return c.json({ message: 'Internal server error' }, 500)
  }
})

export const validateJson = factory.createMiddleware(async (c, next) => {
  try {
    await c.req.json()
    await next()
  } catch (error) {
    return c.json({ message: 'Invalid JSON' }, 400)
  }
})
