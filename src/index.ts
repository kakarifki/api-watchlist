import { Hono } from 'hono'
import authRoutes from './routes/auth'
import reviewsRoutes from './routes/reviews'
import watchlistRoutes from './routes/watchlist'
import viewingsRoutes from './routes/viewings'
import { swaggerUI } from '@hono/swagger-ui'
import { openapi } from './routes/openapi'

const app = new Hono()

// API routes
app.route('/auth', authRoutes)
app.route('/reviews', reviewsRoutes)
app.route('/watchlist', watchlistRoutes)
app.route('/viewings', viewingsRoutes)

// OpenAPI JSON endpoint
app.get('/openapi.json', (c) => c.json(openapi))

// Swagger UI - must come before catch-all route
app.get('/docs', swaggerUI({ 
  spec: openapi, 
  urls: [{ name: 'Watchlist API', url: '/openapi.json' }],
  title: 'Watchlist API Documentation'
}))

// Health check - catch-all route
app.get('/', (c) => c.json({ 
  ok: true, 
  message: 'Watchlist API is running',
  documentation: '/docs',
  openapi: '/openapi.json'
}))

const port = Number(process.env.PORT || 3000)
console.log(`Listening on http://localhost:${port}`)

// Use Bun's native serve
Bun.serve({
  port,
  fetch: app.fetch,
})

export default app
