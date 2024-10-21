export type TimeRange = "short_term" | "medium_term" | "long_term"

export interface SpotifyResponse<T> {
  items: T[]
  limit: number
  next: string | null
  offset: number
  previous: string | null
  total: number
  href: string
  error?: ErrorResponse
}

export interface ErrorResponse {
  status: number
  message: string
}

export interface Track {
  id: string
  name: string
  album: {
    images: Image[]
  }
  artists: Artist[]
  duration_ms: number
  explicit: boolean
  external_urls: {
    spotify: string
  }
  preview_url: string | null
  uri: string
}

export interface Artist {
  id: string
  name: string
  images: Image[]
  genres: string[]
  external_urls: {
    spotify: string
  }
  followers: {
    total: number
  }
}

export interface Playlist {
  id: string
  name: string
  external_urls: {
    spotify: string
  }
  images: Image[]
  tracks: {
    items: {
      track: Track
    }[]
  }
}

export interface Image {
  height: number | null
  width: number | null
  url: string
}