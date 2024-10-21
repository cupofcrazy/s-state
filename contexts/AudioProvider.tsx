"use client"

import { type Track } from "@/types/spotify"
import React, { createContext, useState, useRef, useCallback, useEffect, Suspense } from "react"
import { Howl } from "howler"
import { usePathname, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"

type TrackAudioContextType = {
  currentTrack: Track | null
  isPlaying: boolean
  audioProgress: number
  volume: number
  playTrack: (track: Track) => void
  pauseTrack: () => void
  resumeTrack: () => void
  setVolume: (volume: number) => void
  seek: (position: number) => void
}

export const TrackAudioContext = createContext<TrackAudioContextType | null>(null)

export const TrackAudioContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioProgress, setAudioProgress] = useState(0)
  const [volume, setVolume] = useState(1)
  const howlRef = useRef<Howl | null>(null)
  const searchParams = useSearchParams()
  const pathname = usePathname()


  // Pause the audio when the search params or pathname changes
  useEffect(() => {
    if (isPlaying) {
      pauseTrack()
    }
  }, [searchParams, pathname])

  const playTrack = useCallback((track: Track) => {
    if (!track.preview_url) {
      toast.error('Unable to play this track')
      return
    }
    if (howlRef.current) {
      howlRef.current.unload()
    }

    const howl = new Howl({
      src: [track.preview_url],
      html5: true,
      volume: volume,
      onplay: () => setIsPlaying(true),
      onpause: () => setIsPlaying(false),
      onend: () => {
        console.log('onend')
        setIsPlaying(false)
        setAudioProgress(0)
      },
      onseek: () => {
        setAudioProgress(howl.seek() as number)
      },
    })

    howlRef.current = howl
    setCurrentTrack(track)
    howl.play()
    howl.fade(0, 1, 1000)

    // Update progress
    const updateProgress = () => {
      const progress = howl.seek() as number
      setAudioProgress(progress)
      if (isPlaying) {
        requestAnimationFrame(updateProgress)
      }
    }
    updateProgress()
  }, [volume])

  const pauseTrack = useCallback(() => {
    howlRef.current?.pause()
    setIsPlaying(false)
    setCurrentTrack(null)
    
  }, [])

  const resumeTrack = useCallback(() => {
    howlRef.current?.play()
  }, [])

  const seekTrack = useCallback((position: number) => {
    if (howlRef.current) {
      howlRef.current.seek(position)
    }
  }, [])

  const updateVolume = useCallback((newVolume: number) => {
    setVolume(newVolume)
    if (howlRef.current) {
      howlRef.current.volume(newVolume)
    }
  }, [])

  const value = {
    currentTrack,
    isPlaying,
    audioProgress,
    volume,
    playTrack,
    pauseTrack,
    resumeTrack,
    setVolume: updateVolume,
    seek: seekTrack,
  }

  return (
    <Suspense fallback={<Spinner />}>
      <TrackAudioContext.Provider value={value}>
        {children}
      </TrackAudioContext.Provider>
    </Suspense>
  )
}
