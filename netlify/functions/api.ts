import { Handler } from '@netlify/functions'
import app from '../../src/index'
import { disconnectPrisma } from '../../src/db'

// Create a Netlify serverless function handler
export const handler: Handler = async (event, context) => {
  // Convert Netlify event to Request object for Hono
  const req = new Request(event.rawUrl, {
    method: event.httpMethod,
    headers: new Headers(event.headers as Record<string, string>),
    body: event.body ? event.body : undefined
  })

  try {
    // Process the request with Hono app
    const res = await app.fetch(req)
    
    // Convert Hono response to Netlify response format
    const body = await res.text()
    const headers = Object.fromEntries(res.headers.entries())
    
    return {
      statusCode: res.status,
      headers,
      body
    }
  } catch (error) {
    console.error('Error processing request:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' })
    }
  } finally {
    // Ensure database connections are properly closed
    await disconnectPrisma()
  }
}