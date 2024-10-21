'use client'

import { Howl } from 'howler'
import { useEffect, useRef, useState } from "react"
import { type Track } from "@/types/spotify"
import { motion, animate, useMotionValue, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { PlayIcon, PauseIcon } from "@heroicons/react/24/solid"
import { usePathname, useSearchParams } from "next/navigation"
import { SmoothScroll } from "./slider"
import { useAudio } from "@/hooks/useAudio"
import { useMediaQuery } from "usehooks-ts"
import { TrackCardList } from './track-card-list'
import ScrollContainer from '../ui/scroll'
import cn from 'classnames'


const convertToHex = (r: number, g: number, b: number) => {
  return `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`
}

const MotionPlayIcon = motion(PlayIcon)
const MotionPauseIcon = motion(PauseIcon)

export const TrackList = ({ tracks }: { tracks: Track[] }) => {
  const isMobile = useMediaQuery('(max-width: 768px)')

  const staggerVariants = {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.05
      }
    }
  }

  

  const motionKey = tracks.map(track => track.id).join('-')

  return (
    <div className="min-h-screen py-16 md:py-0">
      {/* <div className="absolute top-[20vh] left-[50%] -translate-x-1/2 w-[200px] h-[2px] ml-8 mb-8 bg-black/10 rounded-full overflow-hidden">
        <div className="h-full bg-black rounded-full" style={{ width: `${(scrollProgress * 100).toFixed(2)}%` }}></div>
      </div> */}
    { isMobile ? (
      <div className="px-4 py-16 md:px-0 md:py-0 grid grid-cols-2 gap-x-4 gap-y-10 overflow-y-auto">
        { tracks.map((track, i) => (
          <TrackVinylCard key={track.id} track={track} index={i} />
        ))}
      </div>
    ) : (
    <ScrollContainer
      className="scroll-container h-[100svh] flex items-center"
      intersectionThreshold={0.1}
      onElementInView={(element, isIntersecting) => {
        if (isIntersecting) {
          element.classList.add('active')
        } else {
          element.classList.remove('active')
        }
      }}
    >
      
        <AnimatePresence key={motionKey}>
        {tracks.map((track, i) => (
          <motion.div key={track.id} variants={staggerVariants} initial="initial" animate="animate" className="track-vinyl-card h-[50%] flex-1 mr-16 first:ml-[25vw] last:mr-[50vw] transition-all duration-300 touch-none select-none">
            <TrackVinylCard index={i} key={track.id} track={track} />
          </motion.div>
        ))}
        </AnimatePresence>
        <AnimatePresence>
      {/* { currentTrack && <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="fixed bottom-0 left-0 py-4 w-full bg-white flex items-center justify-center">
          <div className="flex items-start gap-2 w-1/2 shadow-sm rounded-2xl p-2 border border-neutral-200 bg-neutral-800"
            // style={{
            //   backgroundColor: currentTrack.colors ? convertToHex(currentTrack.colors.DarkVibrant.rgb[0], currentTrack.colors.DarkVibrant.rgb[1], currentTrack.colors.DarkVibrant.rgb[2]) : '#000'
            // }}
          >
            <Image className="rounded-lg w-16 h-16 object-cover border border-white/30" src={currentTrack?.album.images[2].url} alt={currentTrack?.name} width={64} height={64} />
            <div className="flex flex-[2] flex-col items-start justify-between h-max">
              <div>
                <p className="text-md text-white font-medium text-ellipsis">{currentTrack?.name}</p>
                <p className="text-sm text-white/60 text-ellipsis">{currentTrack?.artists.map(artist => artist.name).join(', ')}</p>
              </div>  
              {audioRef.current && <div className="w-full mt-[12px] h-1 bg-white/10 rounded-full">
                <div className="h-1 bg-white/30 rounded-full transition-all duration-100 " style={{ width: `${audioProgress * 100}%` }} />
              </div>}
            </div>
            <motion.button className={`flex items-center justify-center w-8 h-8 bg-black rounded-full backdrop-blur-sm group-hover:opacity-100 transition-all duration-300`} onClick={() => handleTrackClick(currentTrack)}>
              <AnimatePresence mode="popLayout">
                {currentTrack ? <MotionPauseIcon
                  key="pause"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }} 
                  className="w-4 h-4 text-white absolute" /> : <MotionPlayIcon
                  key="play"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-4 h-4 text-white absolute" />}
                </AnimatePresence>
            </motion.button>
          </div>
        </motion.div>
        } */}
        </AnimatePresence>
      </ScrollContainer>
    )}

    </div>
  )
}

export const TrackVinylCard = ({ track, index }: { track: Track, index: number }) => {
  const { playTrack, pauseTrack, isPlaying, currentTrack } = useAudio()
  const ref = useRef<HTMLDivElement>(null)

  const itemVariants = {
    initial: {
      opacity: 0,
      x: 100,
    },
    animate: {
      opacity: 1,
      x: 0,
    },
    exit: {
      opacity: 0,
      x: -100,
    }
  }


  const isActivelyPlayingOrIdle = (track: Track) => {
    return !isCurrentTrack(track)
  }

  const isCurrentTrack = (track: Track) => {
    return currentTrack?.id === track.id && isPlaying
  }

  const handleTrackClick = (track: Track) => {
    if (!track.preview_url) return

    if (currentTrack) {
      pauseTrack()

      if (currentTrack?.preview_url === track.preview_url) {
        pauseTrack()
        return
      }
    }
    playTrack(track)

  }
  return (
    <motion.div ref={ref} className={cn('track-vinyl-card w-full h-full md:w-[200px] md:h-[200px]', {
      'is-playing': isCurrentTrack(track)
    })}>

      { isCurrentTrack(track) && <motion.div className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center absolute top-[-28px] left-[calc(50%-12px)] z-[10]" layoutId={`track-index-${track.id}`}>
        <span className="block text-white text-md text-xl">{index + 1}</span>
      </motion.div>}
      { !isCurrentTrack(track) && <motion.div className="track-index bg-white" layoutId={`track-index-${track.id}`}>
        <span className="text-neutral-800 text-md">{index + 1}</span>
      </motion.div>}

      <div className="track-vinyl-card-inner">
        <Image draggable={false} src="/images/vinyl.png" alt="vinyl" className={cn("w-full h-full transition-all duration-300 z-[1]", {
          'animate-spin-slow': isCurrentTrack(track)
        })} width={200} height={200} />
        <div className="relative z-[5] overflow-hidden rounded-lg">
          <Image draggable={false} src={track.album.images[0].url} alt={track.name} className={cn('border object-cover w-full h-full md:w-[200px] md:h-[200px] transition-all duration-300', {
            'translate-x-[-100%]': isCurrentTrack(track)
          })} width={240} height={240} />
        </div>
        <Image draggable={false} src={track.album.images[0].url} alt={track.name} className={cn('border object-cover w-[40%] h-[40%] transition-all duration-300 mx-auto z-[1] rounded-full', {
          'animate-spin-slow': isCurrentTrack(track)
        })} width={240} height={240} />
        <motion.button className="track-vinyl-card-play-button bg-black/30 backdrop-blur-sm z-10 w-16 h-16" onClick={() => handleTrackClick(track)}>
          <AnimatePresence mode="popLayout">
            {isCurrentTrack(track) ? <MotionPauseIcon className="w-8 h-8 text-white" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} /> : <MotionPlayIcon className="w-8 h-8 text-white" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />}
          </AnimatePresence>
        </motion.button>
      </div>

      <div className="track-vinyl-card-info mt-2">
        <p className="text-sm text-neutral-800 w-[100%] mx-auto text-ellipsis text-center whitespace-nowrap overflow-hidden" title={track.name}>{track.name}</p>
        <p className="text-sm text-neutral-500 text-ellipsis text-center">{track.artists[0].name}</p>
      </div>

    </motion.div>
  )
}