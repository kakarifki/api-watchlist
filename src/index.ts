import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
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

// Global middleware
app.use('*', logger())
app.use('*', cors())

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

// Global error handler
app.onError((err, c) => {
  console.error('Unhandled error:', err)
  return c.json({ message: 'Internal server error' }, 500)
})

// Only log when not in production (Netlify functions)
if (process.env.NODE_ENV !== 'production') {
  console.log(`🚀 Watchlist API starting...`)
  console.log(`📊 External APIs: TMDB ${config.TMDB_API_KEY ? '✅' : '❌'}, Anilist ✅`)
  console.log(`📚 API Documentation available at /docs`)
}

// Server initialization is handled by Netlify in production
// or by netlify dev command in development

export default app
