import { auth, signIn } from "@/auth";
import { Landing } from "@/components/layout/landing";
import Image from "next/image";
import Link from "next/link";

export default async function SignInPage() {
  const session = await auth()

  return (
    <div className="p-4 flex items-center justify-center h-screen">
      <div className="flex flex-col gap-4 items-center">
        <div className="animate-rotate">
          <div className="w-[150px] h-[150px] bg-black/10 overflow-hidden rounded-3xl animate-translate-y">
            <Image className="w-full h-full" src="/images/snail-mail.png" alt="logo" width={150} height={150} />
          </div>
        </div>
        <h1 className="text-2xl font-bold">View your Top Tracks and Artists on Spotify</h1>
        <form action={async () => {
          "use server"
          await signIn("spotify")
        }}>
          <button type="submit" className={buttonClass}>
            Sign in with Spotify
          </button>
        </form>
      </div>
    </div>
  )
}

const buttonClass = `border border-neutral-800/10 bg-white/30 text-neutral-600 px-4 py-2 rounded-full hover:bg-neutral-100 transition-all duration-300 shadow-sm`
