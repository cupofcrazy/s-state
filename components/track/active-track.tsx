'use client'

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { Track } from "@/types/spotify"
import { PauseIcon, PlayIcon } from "@heroicons/react/24/solid"
import Image from "next/image"


const MotionPlayIcon = motion(PlayIcon)
const MotionPauseIcon = motion(PauseIcon)

export default function ActiveTrack({ currentTrack }: { currentTrack: Track }) {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)
  const [audioProgress, setAudioProgress] = useState(0)


  useEffect(() => {
    if (audio) {
      audio.addEventListener('ended', () => {
        setAudio(null)
        setAudioProgress(0)
      })
    }
  }, [audio])

  const lerp = (a: number, b: number, t: number) => {
    return a + (b - a) * t
  }

  useEffect(() => {
    if (audio) {
      const interval = setInterval(() => {
        setAudioProgress(audio.currentTime / audio.duration)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [audio])
 
  return (
    <div className="fixed z-[9999] top-0 left-0 w-full h-full flex flex-col items-center justify-center gap-4 pointer-events-none">
      <motion.div layoutId={`track-${currentTrack.id}`} key={currentTrack.id} className={`flex flex-col items-center justify-center gap-4 pointer-events-auto`}>
        <div className={`w-[200px] h-[200px] flex-none rounded-[4px] group overflow-hidden transition-all duration-300`}>
          <motion.div className="flex items-center justify-center relative h-full w-full">
            <motion.button className={`absolute z-[100] flex items-center justify-center w-14 h-14 bg-white/30 rounded-full backdrop-blur-sm group-hover:opacity-100 transition-all duration-300`}>
              <MotionPauseIcon
                  key="pause"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }} 
                  className="w-6 h-6 text-white absolute" /> : <MotionPlayIcon
                  key="play"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-6 h-6 text-white absolute" />
            </motion.button>
            <div className={`relative flex items-center justify-center w-full h-full transition-all duration-300 ${currentTrack} ? '' : 'group-hover:translate-x-[0px]'} ${currentTrack} ? 'animate-spin-slow' : ''}`}>
              <Image src={currentTrack.album.images[0].url} alt={currentTrack.name} className={`absolute z-[2] rounded-full shadow-md`} width={72} height={72} />
              <Image src="/images/vinyl.png" className={`absolute z-[1] w-fit h-fit transition-all duration-300 ${currentTrack} ? '' : ''}`} alt={currentTrack.name} width={200} height={200} />
            </div>
            <Image src={currentTrack.album.images[0].url} alt={currentTrack.name} className={`object-cover rounded-md absolute z-[4] ${currentTrack}? 'translate-x-[-100%]' : 'group-hover:translate-x-[-30%]'} transition-all duration-300`} width={240} height={240} />
          </motion.div>
          
        </div>
          <div className={`w-full flex flex-col items-center gap-1 transition-all duration-300 text-center overflow-hidden ${currentTrack} ? 'opacity-100 translate-y-8' : 'opacity-70 translate-y-0'}`}>
            <p className={`text-md font-medium text-center text-ellipsis`}>{currentTrack.name}</p>
            <p className={`text-sm text-neutral-800 bg-neutral-100 px-2 py-1.5 rounded-full`}>{currentTrack.artists.map(artist => artist.name).join(', ')}</p>
            <a href={currentTrack.external_urls.spotify} className="opacity-10 group-hover:opacity-100 transition-all duration-300 text-sm text-neutral-800">Preview</a>
          </div>
      </motion.div>
    </div>
  )
}