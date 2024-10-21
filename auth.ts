import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import { refreshAccessToken, scopes } from "@/lib/spotify";


declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    SpotifyProvider({
      clientId: process.env.AUTH_SPOTIFY_ID,
      clientSecret: process.env.AUTH_SPOTIFY_SECRET,
      authorization: "https://accounts.spotify.com/authorize?scope=" + scopes.join(" "),
    })
  ],
  callbacks: {
    jwt: async ({ token, user, account, session }) => {
      if (account) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          expiresAt: account.expires_at as number * 1000,
        }
      }
      
      if (typeof token.expiresAt === 'number' && Date.now() < token.expiresAt) {
        return token
      }

      const newToken = await refreshAccessToken(token)

      return newToken
    },
    async session({ session, token }) {
      
      session.accessToken = token.accessToken as string
      session.refreshToken = token.refreshToken as string
      session.expiresAt = token.expiresAt as number
      return session
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      return baseUrl + "/top-tracks"
    }
  },
  pages: {
    signIn: "/signin",
  }
});

