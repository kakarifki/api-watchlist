interface TMDBMovie {
  id: number
  title: string
  release_date: string
  poster_path: string | null
  media_type: 'movie' | 'tv'
}

interface TMDBSearchResponse {
  results: TMDBMovie[]
  total_results: number
  total_pages: number
}

interface TMDBMovieDetails {
  id: number
  title: string
  release_date: string
  poster_path: string | null
  overview: string
  vote_average: number
  runtime?: number
  number_of_seasons?: number
  number_of_episodes?: number
}

export class TMDBAPI {
  private apiKey: string
  private baseUrl = 'https://api.themoviedb.org/3'

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async searchMovies(query: string, page: number = 1): Promise<TMDBSearchResponse> {
    const url = `${this.baseUrl}/search/movie?api_key=${this.apiKey}&query=${encodeURIComponent(query)}&page=${page}&language=en-US`
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status} ${response.statusText}`)
    }
    
    return response.json()
  }

  async searchSeries(query: string, page: number = 1): Promise<TMDBSearchResponse> {
    const url = `${this.baseUrl}/search/tv?api_key=${this.apiKey}&query=${encodeURIComponent(query)}&page=${page}&language=en-US`
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status} ${response.statusText}`)
    }
    
    return response.json()
  }

  async getMovieDetails(id: number): Promise<TMDBMovieDetails> {
    const url = `${this.baseUrl}/movie/${id}?api_key=${this.apiKey}&language=en-US`
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status} ${response.statusText}`)
    }
    
    return response.json()
  }

  async getSeriesDetails(id: number): Promise<TMDBMovieDetails> {
    const url = `${this.baseUrl}/tv/${id}?api_key=${this.apiKey}&language=en-US`
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status} ${response.statusText}`)
    }
    
    return response.json()
  }

  getPosterUrl(posterPath: string | null): string | null {
    if (!posterPath) return null
    return `https://image.tmdb.org/t/p/w500${posterPath}`
  }

  formatSearchResults(results: TMDBMovie[], category: 'movie' | 'series') {
    return results.map(item => ({
      externalId: item.id.toString(),
      externalSource: 'TMDB' as const,
      title: item.title,
      category,
      releaseYear: item.release_date ? new Date(item.release_date).getFullYear() : null,
      posterUrl: this.getPosterUrl(item.poster_path),
      totalEps: category === 'series' ? null : null, // Will be populated from details if needed
    }))
  }
}
