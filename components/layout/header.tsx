

import { SignIn } from "../auth/sign-in";
import { SignOut } from "../auth/sign-out";
import { auth } from "@/auth";
import { Navigation } from "./navigation";
import { usePathname, useRouter } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";

export const Header = async () => {
  const session = await auth()
  const headersList = headers()

  // console.log(pathname)
  
  return <header className="p-4 h-[48px] fixed top-0 left-0 right-0 z-[9999] bg-gradient-to-b from-white/80 to-transparent transition-all duration-300">
    <div className="flex items-start justify-between text-sm">
      <h1 className="text-md text-black/60 bg-white p-1.5 rounded-full border border-black/10 shadow-sm rotate-[-5deg]">
        <Link href="/">SS</Link>
      </h1>
        { session?.user && <Navigation /> }
        <div className="flex items-center gap-2">
          {session?.user ? <SignOut /> : <SignIn />}  
        </div>
    </div>
  </header>
}