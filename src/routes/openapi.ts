export const openapi = {
  openapi: '3.0.0',
  info: {
    title: 'Watchlist API',
    description: 'A comprehensive API for managing watchlists, reviews, and viewings for movies, series, and anime',
    version: '1.0.0',
    contact: {
      name: 'API Support',
      email: 'support@watchlist.com'
    }
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT token obtained from login endpoint'
      }
    },
    schemas: {
      Error: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            description: 'Error message'
          }
        },
        required: ['message']
      },
      LoginRequest: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            format: 'email',
            description: 'User email address'
          },
          password: {
            type: 'string',
            minLength: 6,
            description: 'User password (minimum 6 characters)'
          }
        },
        required: ['email', 'password']
      },
      LoginResponse: {
        type: 'object',
        properties: {
          token: {
            type: 'string',
            description: 'JWT authentication token'
          }
        },
        required: ['token']
      },
      RegisterRequest: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            format: 'email',
            description: 'User email address'
          },
          password: {
            type: 'string',
            minLength: 6,
            description: 'User password (minimum 6 characters)'
          }
        },
        required: ['email', 'password']
      },
      RegisterResponse: {
        type: 'object',
        properties: {
          token: {
            type: 'string',
            description: 'JWT authentication token'
          }
        },
        required: ['token']
      },
      WatchlistUpsertRequest: {
        type: 'object',
        properties: {
          viewingId: {
            type: 'string',
            description: 'ID of the viewing item'
          },
          status: {
            type: 'string',
            enum: ['planned', 'watching', 'completed'],
            description: 'Watchlist status'
          }
        },
        required: ['viewingId', 'status']
      },
      WatchlistItem: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Unique identifier'
          },
          userId: {
            type: 'string',
            description: 'User ID'
          },
          viewingId: {
            type: 'string',
            description: 'Viewing ID'
          },
          status: {
            type: 'string',
            enum: ['planned', 'watching', 'completed']
          },
          createdAt: {
            type: 'string',
            format: 'date-time'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time'
          }
        }
      },
      WatchlistResponse: {
        type: 'object',
        properties: {
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                userId: { type: 'string' },
                viewingId: { type: 'string' },
                status: { type: 'string' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
                viewing: { $ref: '#/components/schemas/Viewing' }
              }
            }
          }
        }
      },
      Viewing: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Unique identifier'
          },
          title: {
            type: 'string',
            description: 'Title of the movie/series/anime'
          },
          category: {
            type: 'string',
            enum: ['movie', 'series', 'anime'],
            description: 'Content category'
          },
          releaseYear: {
            type: 'number',
            description: 'Release year'
          },
          posterUrl: {
            type: 'string',
            nullable: true,
            description: 'URL to poster image'
          },
          totalEps: {
            type: 'number',
            nullable: true,
            description: 'Total episodes (for series/anime)'
          },
          externalSource: {
            type: 'string',
            description: 'External API source (TMDB, ANILIST, etc.)'
          }
        }
      },
      SearchQuery: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            minLength: 1,
            description: 'Search query string'
          },
          category: {
            type: 'string',
            enum: ['movie', 'series', 'anime'],
            description: 'Filter by category (optional)'
          }
        },
        required: ['query']
      },
      SearchResponse: {
        type: 'object',
        properties: {
          items: {
            type: 'array',
            items: { $ref: '#/components/schemas/Viewing' }
          }
        }
      },
      ReviewCreateRequest: {
        type: 'object',
        properties: {
          viewingId: {
            type: 'string',
            description: 'ID of the viewing item'
          },
          ratingPlot: {
            type: 'number',
            minimum: 1,
            maximum: 10,
            description: 'Plot rating (1-10)'
          },
          ratingCharacter: {
            type: 'number',
            minimum: 1,
            maximum: 10,
            description: 'Character rating (1-10)'
          },
          ratingWorld: {
            type: 'number',
            minimum: 1,
            maximum: 10,
            description: 'World building rating (1-10)'
          },
          textReview: {
            type: 'string',
            minLength: 1,
            description: 'Text review content'
          }
        },
        required: ['viewingId', 'ratingPlot', 'ratingCharacter', 'ratingWorld', 'textReview']
      },
      ReviewCreateResponse: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Review ID'
          },
          slug: {
            type: 'string',
            description: 'URL-friendly slug'
          }
        },
        required: ['id', 'slug']
      },
      Review: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Unique identifier'
          },
          userId: {
            type: 'string',
            description: 'User ID'
          },
          viewingId: {
            type: 'string',
            description: 'Viewing ID'
          },
          ratingPlot: {
            type: 'number',
            minimum: 1,
            maximum: 10
          },
          ratingCharacter: {
            type: 'number',
            minimum: 1,
            maximum: 10
          },
          ratingWorld: {
            type: 'number',
            minimum: 1,
            maximum: 10
          },
          ratingOverall: {
            type: 'number',
            minimum: 1,
            maximum: 10,
            description: 'Calculated average rating'
          },
          textReview: {
            type: 'string',
            description: 'Review text content'
          },
          slug: {
            type: 'string',
            description: 'URL-friendly slug'
          },
          createdAt: {
            type: 'string',
            format: 'date-time'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time'
          }
        }
      },
      ReviewListResponse: {
        type: 'object',
        properties: {
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                userId: { type: 'string' },
                viewingId: { type: 'string' },
                ratingPlot: { type: 'number' },
                ratingCharacter: { type: 'number' },
                ratingWorld: { type: 'number' },
                ratingOverall: { type: 'number' },
                textReview: { type: 'string' },
                slug: { type: 'string' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
                viewing: { $ref: '#/components/schemas/Viewing' },
                user: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    email: { type: 'string' }
                  }
                }
              }
            }
          },
          page: {
            type: 'number',
            description: 'Current page number'
          },
          pageSize: {
            type: 'number',
            description: 'Number of items per page'
          },
          total: {
            type: 'number',
            description: 'Total number of reviews'
          }
        }
      },
      ReviewDetailResponse: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          userId: { type: 'string' },
          viewingId: { type: 'string' },
          ratingPlot: { type: 'number' },
          ratingCharacter: { type: 'number' },
          ratingWorld: { type: 'number' },
          ratingOverall: { type: 'number' },
          textReview: { type: 'string' },
          slug: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          viewing: { $ref: '#/components/schemas/Viewing' },
          user: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              email: { type: 'string' }
            }
          }
        }
      }
    }
  },
  paths: {
    '/auth/login': {
      post: {
        tags: ['Authentication'],
        summary: 'User login',
        description: 'Authenticate user with email and password',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginRequest' }
            }
          }
        },
        responses: {
          '200': {
            description: 'Login successful',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/LoginResponse' }
              }
            }
          },
          '400': {
            description: 'Invalid input',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          },
          '401': {
            description: 'Invalid credentials',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          }
        }
      }
    },
    '/auth/register': {
      post: {
        tags: ['Authentication'],
        summary: 'User registration',
        description: 'Register a new user account (may be disabled by configuration)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RegisterRequest' }
            }
          }
        },
        responses: {
          '200': {
            description: 'Registration successful',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/RegisterResponse' }
              }
            }
          },
          '400': {
            description: 'Invalid input',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          },
          '403': {
            description: 'Registration disabled',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          },
          '409': {
            description: 'Email already in use',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          }
        }
      }
    },
    '/watchlist': {
      post: {
        tags: ['Watchlist'],
        summary: 'Add or update watchlist item',
        description: 'Add a new item to watchlist or update existing item status',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/WatchlistUpsertRequest' }
            }
          }
        },
        responses: {
          '200': {
            description: 'Watchlist item created/updated successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/WatchlistItem' }
              }
            }
          },
          '400': {
            description: 'Invalid input',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          },
          '401': {
            description: 'Unauthorized - Invalid or missing token'
          }
        }
      },
      get: {
        tags: ['Watchlist'],
        summary: 'Get user watchlist',
        description: 'Retrieve all watchlist items for the authenticated user, optionally filtered by status',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'status',
            in: 'query',
            description: 'Filter by watchlist status',
            schema: {
              type: 'string',
              enum: ['planned', 'watching', 'completed']
            }
          }
        ],
        responses: {
          '200': {
            description: 'Watchlist retrieved successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/WatchlistResponse' }
              }
            }
          },
          '401': {
            description: 'Unauthorized - Invalid or missing token'
          }
        }
      }
    },
    '/viewings/{id}': {
      get: {
        tags: ['Viewings'],
        summary: 'Get viewing details',
        description: 'Retrieve detailed information about a specific viewing item',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Viewing ID',
            schema: { type: 'string' }
          }
        ],
        responses: {
          '200': {
            description: 'Viewing details retrieved successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Viewing' }
              }
            }
          },
          '404': {
            description: 'Viewing not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          }
        }
      }
    },
    '/viewings/search': {
      get: {
        tags: ['Viewings'],
        summary: 'Search viewings',
        description: 'Search for movies, series, or anime using external APIs (TMDB, AniList)',
        parameters: [
          {
            name: 'query',
            in: 'query',
            required: true,
            description: 'Search query string',
            schema: { type: 'string', minLength: 1 }
          },
          {
            name: 'category',
            in: 'query',
            description: 'Filter by content category',
            schema: {
              type: 'string',
              enum: ['movie', 'series', 'anime']
            }
          }
        ],
        responses: {
          '200': {
            description: 'Search results retrieved successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SearchResponse' }
              }
            }
          },
          '400': {
            description: 'Invalid query parameters',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          }
        }
      }
    },
    '/reviews': {
      post: {
        tags: ['Reviews'],
        summary: 'Create a new review',
        description: 'Create a new review for a viewing item with ratings and text review',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ReviewCreateRequest' }
            }
          }
        },
        responses: {
          '200': {
            description: 'Review created successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ReviewCreateResponse' }
              }
            }
          },
          '400': {
            description: 'Invalid input',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          },
          '401': {
            description: 'Unauthorized - Invalid or missing token'
          }
        }
      },
      get: {
        tags: ['Reviews'],
        summary: 'List reviews',
        description: 'Retrieve paginated list of reviews, optionally filtered by category',
        parameters: [
          {
            name: 'page',
            in: 'query',
            description: 'Page number (default: 1)',
            schema: { type: 'number', minimum: 1, default: 1 }
          },
          {
            name: 'pageSize',
            in: 'query',
            description: 'Items per page (default: 10, max: 50)',
            schema: { type: 'number', minimum: 1, maximum: 50, default: 10 }
          },
          {
            name: 'category',
            in: 'query',
            description: 'Filter by content category',
            schema: {
              type: 'string',
              enum: ['movie', 'series', 'anime']
            }
          }
        ],
        responses: {
          '200': {
            description: 'Reviews retrieved successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ReviewListResponse' }
              }
            }
          }
        }
      }
    },
    '/reviews/{slug}': {
      get: {
        tags: ['Reviews'],
        summary: 'Get review by slug',
        description: 'Retrieve detailed information about a specific review using its slug',
        parameters: [
          {
            name: 'slug',
            in: 'path',
            required: true,
            description: 'Review slug',
            schema: { type: 'string' }
          }
        ],
        responses: {
          '200': {
            description: 'Review retrieved successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ReviewDetailResponse' }
              }
            }
          },
          '404': {
            description: 'Review not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          }
        }
      }
    }
  },
  tags: [
    {
      name: 'Authentication',
      description: 'User authentication and registration endpoints'
    },
    {
      name: 'Watchlist',
      description: 'Manage user watchlist items and status'
    },
    {
      name: 'Viewings',
      description: 'Browse and search for movies, series, and anime'
    },
    {
      name: 'Reviews',
      description: 'Create and browse user reviews with ratings'
    }
  ]
}


