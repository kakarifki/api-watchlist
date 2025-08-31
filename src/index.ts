import { Hono } from 'hono'
import { createAuthRouter } from './routes/auth'
import { createReviewsRouter } from './routes/reviews'
import { createWatchlistRouter } from './routes/watchlist'
import { createViewingsRouter } from './routes/viewings'
import { swaggerUI } from '@hono/swagger-ui'
import { openapi } from './routes/openapi'
import { loadEnvConfig, validateApiKeys } from './config/env'

// Load and validate environment configuration
const config = loadEnvConfig()
validateApiKeys(config)

const app = new Hono()

// API routes with config
app.route('/auth', createAuthRouter(config))
app.route('/reviews', createReviewsRouter(config))
app.route('/watchlist', createWatchlistRouter(config))
app.route('/viewings', createViewingsRouter(config))

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
