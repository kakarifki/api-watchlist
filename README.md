# Watchlist API

A comprehensive API for managing watchlists, reviews, and viewings for movies, series, and anime.

## Features

- **User Authentication**: JWT-based login and registration system
- **Watchlist Management**: Add, update, and track viewing status (planned, watching, completed)
- **Review System**: Create detailed reviews with ratings for plot, characters, and world-building
- **Content Discovery**: Search for movies, series, and anime (integrated with TMDB and AniList)
- **Comprehensive API Documentation**: Full SwaggerUI integration

## API Documentation

### SwaggerUI Interface

Access the interactive API documentation at `/docs` when the server is running.

- **URL**: `http://localhost:3000/docs`
- **Features**: 
  - Interactive endpoint testing
  - Request/response schema validation
  - Authentication token management
  - Example requests and responses

### OpenAPI Specification

The complete OpenAPI 3.0 specification is available at `/openapi.json`.

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/login` | User login | No |
| POST | `/auth/register` | User registration | No |

### Watchlist

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/watchlist` | Get user watchlist | Yes |
| POST | `/watchlist` | Add/update watchlist item | Yes |

### Viewings

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/viewings/{id}` | Get viewing details | No |
| GET | `/viewings/search` | Search for content | No |

### Reviews

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/reviews` | List reviews (paginated) | No |
| POST | `/reviews` | Create new review | Yes |
| GET | `/reviews/{slug}` | Get review by slug | No |

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) runtime
- Node.js (for Prisma)
- PostgreSQL database

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd api-watchlist
```

2. Install dependencies:
```bash
bun install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database configuration
```

4. Set up the database:
```bash
bun run generate
bun run migrate:dev
bun run seed
```

5. Start the development server:
```bash
bun run dev
```

The API will be available at `http://localhost:3000`

### Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `ALLOW_REGISTER`: Set to "true" to enable user registration
- `PORT`: Server port (default: 3000)

## API Usage Examples

### Authentication

```bash
# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'

# Register (if enabled)
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "newuser@example.com", "password": "password123"}'
```

### Watchlist Management

```bash
# Add to watchlist (requires auth token)
curl -X POST http://localhost:3000/watchlist \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"viewingId": "movie123", "status": "planned"}'

# Get user watchlist
curl -X GET http://localhost:3000/watchlist \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Content Search

```bash
# Search for movies
curl "http://localhost:3000/viewings/search?query=inception&category=movie"

# Search for anime
curl "http://localhost:3000/viewings/search?query=naruto&category=anime"
```

### Reviews

```bash
# Create a review (requires auth token)
curl -X POST http://localhost:3000/reviews \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "viewingId": "movie123",
    "ratingPlot": 9,
    "ratingCharacter": 8,
    "ratingWorld": 9,
    "textReview": "Excellent movie with great plot and characters!"
  }'

# Get reviews
curl "http://localhost:3000/reviews?page=1&pageSize=10&category=movie"
```

## Database Schema

The API uses Prisma with the following main entities:

- **User**: Authentication and user management
- **Viewing**: Movies, series, and anime content
- **Watchlist**: User's watchlist items with status
- **Review**: User reviews with ratings and text

## Development

### Available Scripts

- `bun run dev`: Start development server with hot reload
- `bun run generate`: Generate Prisma client
- `bun run migrate:dev`: Run database migrations
- `bun run seed`: Seed database with sample data
- `bun run start`: Start production server

### API Testing

Use the SwaggerUI at `/docs` to:
- Test all endpoints interactively
- View request/response schemas
- Authenticate with JWT tokens
- Validate API behavior

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
