import { TMDBAPI } from '../utils/tmdb'
import { AnilistAPI } from '../utils/anilist'
import { EnvConfig } from '../config/env'

export interface SearchResult {
  externalId: string
  externalSource: 'TMDB' | 'ANILIST'
  title: string
  category: 'movie' | 'series' | 'anime'
  releaseYear: number | null
  posterUrl: string | null
  totalEps: number | null
}

export interface SearchResponse {
  items: SearchResult[]
  total: number
  page: number
  hasNextPage: boolean
}

export class SearchService {
  private tmdbAPI: TMDBAPI | null
  private anilistAPI: AnilistAPI

  constructor(config: EnvConfig) {
    this.tmdbAPI = config.TMDB_API_KEY ? new TMDBAPI(config.TMDB_API_KEY) : null
    this.anilistAPI = new AnilistAPI()
  }

  async search(
    query: string,
    category?: 'movie' | 'series' | 'anime',
    page: number = 1
  ): Promise<SearchResponse> {
    try {
      if (category === 'anime') {
        return await this.searchAnime(query, page)
      } else if (category === 'movie') {
        return await this.searchMovies(query, page)
      } else if (category === 'series') {
        return await this.searchSeries(query, page)
      } else {
        // Search all categories
        return await this.searchAll(query, page)
      }
    } catch (error) {
      console.error('Search error:', error)
      throw new Error(`Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  private async searchMovies(query: string, page: number): Promise<SearchResponse> {
    if (!this.tmdbAPI) {
      throw new Error('TMDB API not configured. Please set TMDB_API_KEY in environment variables.')
    }

    const response = await this.tmdbAPI.searchMovies(query, page)
    const items = this.tmdbAPI.formatSearchResults(response.results, 'movie')

    return {
      items,
      total: response.total_results,
      page,
      hasNextPage: page < response.total_pages,
    }
  }

  private async searchSeries(query: string, page: number): Promise<SearchResponse> {
    if (!this.tmdbAPI) {
      throw new Error('TMDB API not configured. Please set TMDB_API_KEY in environment variables.')
    }

    const response = await this.tmdbAPI.searchSeries(query, page)
    const items = this.tmdbAPI.formatSearchResults(response.results, 'series')

    return {
      items,
      total: response.total_results,
      page,
      hasNextPage: page < response.total_pages,
    }
  }

  private async searchAnime(query: string, page: number): Promise<SearchResponse> {
    const response = await this.anilistAPI.searchAnime(query, page)
    const items = this.anilistAPI.formatSearchResults(response.data.Page.media)

    return {
      items,
      total: response.data.Page.pageInfo.total,
      page,
      hasNextPage: response.data.Page.pageInfo.hasNextPage,
    }
  }

  private async searchAll(query: string, page: number): Promise<SearchResponse> {
    const [moviesResponse, seriesResponse, animeResponse] = await Promise.allSettled([
      this.searchMovies(query, page),
      this.searchSeries(query, page),
      this.searchAnime(query, page),
    ])

    const allItems: SearchResult[] = []
    let total = 0
    let hasNextPage = false

    // Combine results from all sources
    if (moviesResponse.status === 'fulfilled') {
      allItems.push(...moviesResponse.value.items)
      total += moviesResponse.value.total
      hasNextPage = hasNextPage || moviesResponse.value.hasNextPage
    }

    if (seriesResponse.status === 'fulfilled') {
      allItems.push(...seriesResponse.value.items)
      total += seriesResponse.value.total
      hasNextPage = hasNextPage || seriesResponse.value.hasNextPage
    }

    if (animeResponse.status === 'fulfilled') {
      allItems.push(...animeResponse.value.items)
      total += animeResponse.value.total
      hasNextPage = hasNextPage || animeResponse.value.hasNextPage
    }

    // Sort by relevance (you could implement more sophisticated ranking)
    allItems.sort((a, b) => {
      // Prioritize exact title matches
      const aExact = a.title.toLowerCase() === query.toLowerCase()
      const bExact = b.title.toLowerCase() === query.toLowerCase()
      if (aExact && !bExact) return -1
      if (!aExact && bExact) return 1
      return 0
    })

    return {
      items: allItems,
      total,
      page,
      hasNextPage,
    }
  }

  async getDetails(externalId: string, externalSource: 'TMDB' | 'ANILIST'): Promise<any> {
    try {
      if (externalSource === 'ANILIST') {
        return await this.anilistAPI.getAnimeDetails(parseInt(externalId))
      } else if (externalSource === 'TMDB') {
        if (!this.tmdbAPI) {
          throw new Error('TMDB API not configured')
        }
        // You'd need to determine if it's a movie or series
        // For now, try both
        try {
          return await this.tmdbAPI.getMovieDetails(parseInt(externalId))
        } catch {
          return await this.tmdbAPI.getSeriesDetails(parseInt(externalId))
        }
      }
    } catch (error) {
      console.error('Get details error:', error)
      throw new Error(`Failed to get details: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}
