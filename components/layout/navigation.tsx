"use client"

import { useRef, useState } from "react"
import { AnimatePresence, MotionConfig, motion } from "framer-motion"
import useMeasure from "react-use-measure"
import { AudioLines, ChevronDown } from "lucide-react"
import { useOnClickOutside } from "usehooks-ts"
import { Filter } from "../ui/filter"
import { usePathname, useRouter } from "next/navigation"


export const Navigation = () => {
  const links = [
    {
      label: "Your Top 50 Artists",
      href: "/top-artists",
      color: "text-red-500/70",
    },
    {
      label: "Your Top 50 Tracks",
      href: "/top-tracks",
      color: "text-blue-500/70",
    },
  ]

  const navigationRef = useRef<HTMLUListElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const [activeLink, setActiveLink] = useState(links.find((link) => link.href === pathname) || links[0])
  useOnClickOutside(navigationRef, () => closeNavigation())

  const openNavigation = () => {
    setIsOpen(true)
  }

  const closeNavigation = () => {
    setIsOpen(false)
  }

  const variants = {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
    },
    exit: {
      opacity: 0,
    },
  }

  if (pathname === "/") return null

  return (
    <MotionConfig transition={{ type: "spring", duration: 0.3 }}>
      <motion.div  className="flex items-start gap-2">
        <motion.nav layout className="flex flex-col items-center gap-2">
          <AnimatePresence key={isOpen.toString()} initial={false}>
            { !isOpen && <motion.button variants={variants} initial="initial" whileHover={{ scale: 1.02 }} animate="animate" exit="exit" className={`flex items-center gap-1 bg-white text-black/70 border border-black/5 shadow-sm px-2 py-2.5 rounded-full`} onClick={() => openNavigation()}>
              <AudioLines className={`w-4 h-4 ${activeLink.color}`} />
              <motion.span layoutId={`${activeLink.label}-label`} className="text-sm">{activeLink.label}</motion.span>
              <ChevronDown strokeWidth={2} className="w-4 h-4 text-black/30" />
            </motion.button>
            }
            {isOpen && (
            <motion.ul ref={navigationRef} variants={variants} initial="initial" animate="animate" exit="exit" className="flex items-center flex-col bg-white p-1 rounded-2xl border border-black/5 shadow-md">
              {links.map((link) => (
              <li className="w-full" key={link.label}>
                <button className="relative text-black/70  p-2 rounded-xl w-48" onClick={() => {
                  setActiveLink(link)
                  closeNavigation()
                  router.push(link.href)
                }}>
                  { (activeLink.label === link.label) && <motion.div layoutId={`button-bg`} className={`bg-neutral-200 w-full h-full absolute top-0 left-0 right-0 bottom-0 rounded-xl z-[-1]`}></motion.div> }
                  <motion.span layoutId={`${link.label}-label`} className="text-sm">{link.label}</motion.span>
                </button>
              </li>
            ))}
            </motion.ul>
            )}
          </AnimatePresence>
        </motion.nav>
        {/* <Filter /> */}
      </motion.div>
    </MotionConfig>
  )
}