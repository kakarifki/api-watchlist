import { z } from 'zod'

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().min(1),
  
  // JWT
  JWT_SECRET: z.string().min(1),

  // Server
  PORT: z.preprocess(
    (val) => typeof val === 'string' ? Number(val) : val,
    z.number().default(3000)
  ),

  // External APIs
  TMDB_API_KEY: z.string().min(1).optional(),
  ANILIST_API_KEY: z.string().min(1).optional(), // Anilist doesn't require API key but keeping for future

  // Features
  ALLOW_REGISTER: z.preprocess(
    (val) => val === 'true',
    z.boolean().default(false)
  ),

  // Rate limiting
  RATE_LIMIT_WINDOW: z.preprocess(
    (val) => typeof val === 'string' ? Number(val) : val,
    z.number().default(900000) // 15 minutes in ms
  ),
  RATE_LIMIT_MAX_REQUESTS: z.preprocess(
    (val) => typeof val === 'string' ? Number(val) : val,
    z.number().default(100)
  ),
  
  // Seed data (optional)
  SEED_USER_EMAIL: z.string().email().optional(),
  SEED_USER_PASSWORD: z.string().min(6).optional(),
  SEED_USER_NAME: z.string().min(1).optional(),
})

export type EnvConfig = z.infer<typeof envSchema>

export function loadEnvConfig(): EnvConfig {
  try {
    const config = envSchema.parse(process.env)
    return config
  } catch (error) {
    if (error instanceof z.ZodError && Array.isArray(error.issues)) {
      const missingVars = error.issues.map((issue) => issue.path.join('.'))
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
