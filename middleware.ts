// export  { auth as middleware } from "@/auth";

import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"
import { auth } from "./auth"

export async function middleware(req: NextRequest) {
  console.log("Middleware")
  const session = await auth()
  const token = await getToken({ req, secret: process.env.AUTH_SECRET })

  if (!session?.user) {
    console.log("No user session")
    return NextResponse.redirect(new URL("/signin", req.url))
  }
  
  if (token && token.expiresAt && token.expiresAt * 1000 < Date.now()) {
    // Token has expired, refresh it
    try {
      const response = await fetch("https://accounts.spotify.com/api/token", {
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

      // Update the token in the session
      token.accessToken = refreshedTokens.access_token
      token.expiresAt = Math.floor(Date.now() / 1000 + refreshedTokens.expires_in)
      // Optionally update refresh token if provided
      if (refreshedTokens.refresh_token) {
        token.refreshToken = refreshedTokens.refresh_token
      }
    } catch (error) {
      console.error("Error refreshing access token", error)
      // Redirect to login or handle error
      return NextResponse.redirect(new URL("/signin", req.url))
    }
  }

  

  return NextResponse.next()
}

export const config = {
  matcher: ["/api/spotify/:path*", "/", "/top-tracks", "/top-artists"],
}