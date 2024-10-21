export const scopes = [
  "user-read-email",
  "user-read-private",
  "user-read-currently-playing",
  "user-read-recently-played",
  "user-follow-read",
  "user-follow-modify",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-email",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-currently-playing",
  "user-read-recently-played",
  "user-follow-read",
  "user-follow-modify",
  "user-top-read",
  "playlist-read-private",
  "playlist-read-collaborative",
  "playlist-modify-private",
  "playlist-modify-public",
]

export async function refreshAccessToken(token: any) {
  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      cache: "no-cache",
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.AUTH_SPOTIFY_ID as string,
        client_secret: process.env.AUTH_SPOTIFY_SECRET as string,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken as string,
      }),
    })

    const refreshedTokens = await response.json()

    if (!response.ok) {
      throw refreshedTokens
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      expiresAt: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    }
  } catch (error) {
    console.log(error)

    return {
      ...token,
      error: "RefreshAccessTokenError",
    }
  }
}