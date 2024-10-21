"use server"

import { auth, signIn, signOut } from "@/auth"

export const handleSignIn = async () => {
  await signIn("spotify")
}

export const handleSignOut = async () => {
  await signOut()
}

export const refreshToken = async () => {
  const session = await auth()
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${process.env.AUTH_SPOTIFY_ID}:${process.env.AUTH_SPOTIFY_SECRET}`).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: session?.refreshToken as string,
    }).toString(),
  })
}