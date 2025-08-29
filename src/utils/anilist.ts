interface AnilistAnime {
  id: number
  title: {
    romaji: string
    english: string
    native: string
  }
  coverImage: {
    large: string
    medium: string
  }
  startDate: {
    year: number
    month: number
    day: number
  }
  episodes: number
  format: string
  status: string
  description: string
  averageScore: number
}

interface AnilistSearchResponse {
  data: {
    Page: {
      media: AnilistAnime[]
      pageInfo: {
        total: number
        currentPage: number
        lastPage: number
        hasNextPage: boolean
      }
    }
  }
}

export class AnilistAPI {
  private baseUrl = 'https://graphql.anilist.co'

  async searchAnime(query: string, page: number = 1, perPage: number = 20): Promise<AnilistSearchResponse> {
    const searchQuery = `
      query ($search: String, $page: Int, $perPage: Int) {
        Page(page: $page, perPage: $perPage) {
          pageInfo {
            total
            currentPage
            lastPage
            hasNextPage
          }
          media(search: $search, type: ANIME, sort: [POPULARITY_DESC, SCORE_DESC]) {
            id
            title {
              romaji
              english
              native
            }
            coverImage {
              large
              medium
            }
            startDate {
              year
              month
              day
            }
            episodes
            format
            status
            description
            averageScore
          }
        }
      }
    `

    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: searchQuery,
        variables: {
          search: query,
          page,
          perPage,
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`Anilist API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  async getAnimeDetails(id: number): Promise<{ data: { Media: AnilistAnime } }> {
    const query = `
      query ($id: Int) {
        Media(id: $id, type: ANIME) {
          id
          title {
            romaji
            english
            native
          }
          coverImage {
            large
            medium
          }
          startDate {
            year
            month
            day
          }
          episodes
          format
          status
          description
          averageScore
          duration
          genres
          studios {
            nodes {
              name
            }
          }
        }
      }
    `

    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { id },
      }),
    })

    if (!response.ok) {
      throw new Error(`Anilist API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  formatSearchResults(results: AnilistAnime[]) {
    return results.map(item => ({
      externalId: item.id.toString(),
      externalSource: 'ANILIST' as const,
      title: item.title.english || item.title.romaji || item.title.native,
      category: 'anime' as const,
      releaseYear: item.startDate.year,
      posterUrl: item.coverImage.large || item.coverImage.medium,
      totalEps: item.episodes,
    }))
  }
}
