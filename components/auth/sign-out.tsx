import Image from "next/image"
import { auth } from "@/auth"
import { handleSignOut } from "@/actions/spotify/auth"
import { LogOut } from "lucide-react"

export const SignOut = async () => {
  const session = await auth()
  
  return (
    <form action={handleSignOut} className="">
      <button className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full bg-white/70 text-black/50 hover:bg-black/5 hover:text-black border border-black/5 shadow-sm backdrop-blur-md" type="submit">
        <LogOut className="w-4 h-4 text-black/30" />
        {session?.user?.image && <Image className="w-6 h-6 rounded-full" src={session.user.image} alt={session.user.name ?? ""} width={32} height={32} />}
      </button>
    </form>
  )
}