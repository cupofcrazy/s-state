"use server"
// @ts-ignore next-line
import * as Vibrant from 'node-vibrant'
import { auth } from "@/auth"
import { Artist, Playlist, SpotifyResponse, Track } from "@/types/spotify"


type Params = {
  limit?: number
  time_range?: "short_term" | "medium_term" | "long_term"
  offset?: number
}

export const getTopTracks = async ({ limit = 50, time_range = "short_term", offset = 0 }: Params = {}) => {
  const session = await auth()
  
  const response = await fetch(`https://api.spotify.com/v1/me/top/tracks?limit=${limit}&time_range=${time_range}&offset=${offset}`, {
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
  })

  try {
    const data = await response.json() as SpotifyResponse<Track>

    return {
      ...data,
      error: null
    }
  } catch (error) {
    console.error(error);
    return {
      items: [],
      error
    }
  }
}

export const getTopArtists = async ({ limit = 50, time_range = "short_term", offset = 0 }: Params = {}) => {
  const session = await auth()
  
  const response = await fetch(`https://api.spotify.com/v1/me/top/artists?limit=${limit}&time_range=${time_range}&offset=${offset}`, {
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
  })
  const data = await response.json() as SpotifyResponse<Artist>

  return data
}

export const getArtistInfo = async (id: string) => {
  const session = await auth()

  const response = await fetch(`https://api.spotify.com/v1/artists/${id}`, {
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
  })

  const data = await response.json() as Artist

  return data
}

export const getArtistRecommendations = async (id: string) => {
  const session = await auth()

  const response = await fetch(`https://api.spotify.com/v1/recommendations?seed_artists=${id}`, {
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
  })

  const data = await response.json()

  return data as { tracks: Track[] }
}

export const createPlaylist = async (name: string) => {
  const session = await auth()

  if (!session?.user) {
    throw new Error('Unauthorized')
  }

  const response = await fetch(`https://api.spotify.com/v1/me/playlists`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name
    })
  })

  const data = await response.json()

  return data as Playlist
}

export const addTracksToPlaylist = async (id: string, uris: string[]) => {
  const session = await auth()

  if (!session?.user) {
    throw new Error('Unauthorized')
  }

  const response = await fetch(`https://api.spotify.com/v1/playlists/${id}/tracks`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      uris
    })
  })

  const data = await response.json()

  return data
}

export const getPlaylist = async (id: string) => {
  const session = await auth()

  const response = await fetch(`https://api.spotify.com/v1/playlists/${id}`, {
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
  })

  const data = await response.json()

  return data as Playlist
}