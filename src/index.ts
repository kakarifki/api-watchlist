import { Hono } from 'hono'
import authRoutes from './routes/auth'
import reviewsRoutes from './routes/reviews'
import watchlistRoutes from './routes/watchlist'
import viewingsRoutes from './routes/viewings'
import { swaggerUI } from '@hono/swagger-ui'
import { openapi } from './routes/openapi'
import { loadEnvConfig, validateApiKeys } from './config/env'

// Load and validate environment configuration
const config = loadEnvConfig()
validateApiKeys(config)

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
  openapi: '/openapi.json',
  externalApis: {
    tmdb: !!config.TMDB_API_KEY,
    anilist: true // Anilist doesn't require API key
  }
}))

console.log(`🚀 Watchlist API starting...`)
console.log(`📊 External APIs: TMDB ${config.TMDB_API_KEY ? '✅' : '❌'}, Anilist ✅`)

// Use Bun's native serve
Bun.serve({
  port: config.PORT,
  fetch: app.fetch,
})

console.log(`🌐 Server listening on http://localhost:${config.PORT}`)
console.log(`📚 API Documentation: http://localhost:${config.PORT}/docs`)

export default app
