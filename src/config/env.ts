import { z } from 'zod'

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().min(1),
  
  // JWT
  JWT_SECRET: z.string().min(1),
  
  // Server
  PORT: z.string().transform(Number).default('3000'),
  
  // External APIs
  TMDB_API_KEY: z.string().min(1).optional(),
  ANILIST_API_KEY: z.string().min(1).optional(), // Anilist doesn't require API key but keeping for future
  
  // Features
  ALLOW_REGISTER: z.string().transform(val => val === 'true').default('false'),
  
  // Rate limiting
  RATE_LIMIT_WINDOW: z.string().transform(Number).default('900000'), // 15 minutes in ms
  RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).default('100'),
})

export type EnvConfig = z.infer<typeof envSchema>

export function loadEnvConfig(): EnvConfig {
  try {
    const config = envSchema.parse(process.env)
    return config
  } catch (error) {
    if (error instanceof z.ZodError && error.errors) {
      const missingVars = error.errors.map(err => err.path.join('.'))
      console.error('❌ Missing or invalid environment variables:')
      missingVars.forEach(varName => console.error(`   - ${varName}`))
      console.error('\nPlease check your .env file and ensure all required variables are set.')
    } else {
      console.error('❌ Environment configuration error:', error)
    }
    process.exit(1)
  }
}

export function validateApiKeys(config: EnvConfig): void {
  const missingKeys: string[] = []
  
  if (!config.TMDB_API_KEY) {
    missingKeys.push('TMDB_API_KEY')
  }
  
  if (missingKeys.length > 0) {
    console.warn('⚠️  Warning: Some API keys are missing:')
    missingKeys.forEach(key => console.warn(`   - ${key}`))
    console.warn('   External API features may not work properly.')
  }
}
