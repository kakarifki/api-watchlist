// Import PrismaClient from the correct location based on environment
let PrismaClient;
try {
  // In production, the path might be different due to how Netlify bundles functions
  const generatedPath = process.env.PRISMA_GENERATED_PATH || './generated/prisma';
  PrismaClient = require(generatedPath).PrismaClient;
} catch (error) {
  // Fallback to the default path
  console.warn('Failed to import PrismaClient from custom path, using default path');
  PrismaClient = require('./generated/prisma').PrismaClient;
}

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Handle serverless function cleanup
export const disconnectPrisma = async () => {
  try {
    await prisma.$disconnect()
  } catch (error) {
    console.error('Error disconnecting from database:', error)
  }
}


