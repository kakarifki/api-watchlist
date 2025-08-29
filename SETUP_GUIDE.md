# External API Integration Setup Guide

## Overview

This project now includes full integration with external APIs for content discovery:

- **TMDB (The Movie Database)**: Movies and TV series
- **Anilist**: Anime content

## What's Been Implemented

### ✅ API Utility Classes
- `src/utils/tmdb.ts` - TMDB API integration
- `src/utils/anilist.ts` - Anilist GraphQL API integration
- `src/services/search.ts` - Unified search service
- `src/config/env.ts` - Environment configuration with validation

### ✅ Updated Routes
- `/viewings/search` - Now uses real APIs instead of stubs
- `/viewings/:id/details` - New endpoint to get detailed information

### ✅ Error Handling
- Proper API error handling and user-friendly messages
- Graceful fallbacks when APIs are unavailable
- Rate limiting considerations

## Setup Instructions

### 1. Environment Variables

Create a `.env` file in your project root:

```bash
# Required
DATABASE_URL="postgresql://username:password@localhost:5432/watchlist_db"
JWT_SECRET="your-super-secret-jwt-key-here"

# External APIs
TMDB_API_KEY="your-tmdb-api-key-here"
# Anilist doesn't require an API key

# Optional
PORT=3000
ALLOW_REGISTER=true
```

### 2. Get TMDB API Key

1. Go to [TMDB](https://www.themoviedb.org/)
2. Create an account and log in
3. Go to **Settings** → **API**
4. Request an API key (choose "Developer" option)
5. Copy the API key to your `.env` file

**Note**: TMDB API key is **REQUIRED** for movies and series search to work.

### 3. Anilist Setup

**No setup required!** Anilist provides a free GraphQL API that doesn't require authentication for basic usage.

## API Endpoints

### Search Content
```bash
# Search movies (requires TMDB_API_KEY)
GET /viewings/search?query=inception&category=movie

# Search series (requires TMDB_API_KEY)
GET /viewings/search?query=breaking+bad&category=series

# Search anime (no API key required)
GET /viewings/search?query=naruto&category=anime

# Search all categories
GET /viewings/search?query=action&page=1
```

### Get Details
```bash
# Get detailed information about a viewing
GET /viewings/{viewing_id}/details
```

## Response Format

### Search Response
```json
{
  "items": [
    {
      "externalId": "123",
      "externalSource": "TMDB",
      "title": "Inception",
      "category": "movie",
      "releaseYear": 2010,
      "posterUrl": "https://image.tmdb.org/t/p/w500/poster.jpg",
      "totalEps": null
    }
  ],
  "total": 1,
  "page": 1,
  "hasNextPage": false
}
```

## Testing

### 1. Start the Server
```bash
bun run dev
```

### 2. Check API Status
Visit `http://localhost:3000/` to see:
- Server status
- External API availability
- Documentation links

### 3. Test Search
```bash
# Test anime search (should work without API key)
curl "http://localhost:3000/viewings/search?query=naruto&category=anime"

# Test movie search (requires TMDB_API_KEY)
curl "http://localhost:3000/viewings/search?query=inception&category=movie"
```

## Troubleshooting

### Common Issues

#### "TMDB API not configured"
- **Cause**: Missing `TMDB_API_KEY` in `.env` file
- **Solution**: Add your TMDB API key to the `.env` file

#### "TMDB API error: 401"
- **Cause**: Invalid or expired API key
- **Solution**: Check your TMDB API key and regenerate if needed

#### "TMDB API error: 429"
- **Cause**: Rate limit exceeded
- **Solution**: Wait before making more requests (TMDB has rate limits)

#### "Anilist API error: 429"
- **Cause**: Anilist rate limit exceeded
- **Solution**: Anilist has strict rate limiting, wait before retrying

### Environment Variable Validation

The server will automatically validate your environment variables on startup and show clear error messages for any missing or invalid variables.

## Rate Limiting

- **TMDB**: 1000 requests per day for free tier
- **Anilist**: Strict rate limiting (recommended: max 1 request per second)

## Future Enhancements

- Caching layer for API responses
- Background job for syncing popular content
- User preferences for content sources
- Advanced filtering and sorting options

## Support

If you encounter issues:
1. Check the console output for error messages
2. Verify your environment variables
3. Check the API documentation for rate limits
4. Ensure your database is running and accessible
