import { handleSignIn } from "@/actions/spotify/auth"


export const SignIn = () => {
  return (
    <form action={handleSignIn}>
      <button className="bg-neutral-900 text-white px-2.5 py-1 rounded-full text-sm" type="submit">Sign in</button>
    </form>
  )
}