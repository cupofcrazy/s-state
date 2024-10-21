import { useEffect, useRef, useState, useCallback } from "react"
import { Howl } from "howler"
import { Track } from "@/types/spotify"


export const useAudio = (tracks: Track[]) => {
  const audioRef = useRef<Howl | null>(null)
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [audioProgress, setAudioProgress] = useState(0)

  useEffect(() => {
    return () => {
      killAudio()
    }
  }, [])

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.stop()
      setAudioProgress(0)
    }
  }

  const killAudio = () => {
    if (audioRef.current) {
      audioRef.current.stop()
      audioRef.current?.unload()
      audioRef.current = null
    }
  }

  // const updateAudioProgress = useCallback(() => {
  //   if (audioRef.current) {
  //     setAudioProgress(audioRef.current.seek() / audioRef.current.duration())
  //   }
  // }, [])

  const playAudio = (url: string) => {
    if (!url) return
    if (audioRef.current) killAudio()
    
    audioRef.current = new Howl({
      src: [url],
      volume: 0.5,
      autoplay: true,
      html5: true,
      onend: () => {
        killAudio()
      },
      onloaderror: (id, error) => console.error('Audio loading error:', error),
      onplayerror: (id, error) => console.error('Audio playback error:', error),
    })
    audioRef.current.play()
    audioRef.current.fade(0, 1, 1000)
  }

  // useEffect(() => {
  //   const audio = audioRef.current
  //   if (audio) {
  //     const progressInterval = setInterval(updateAudioProgress, 1000)
      
  //     return () => {
  //       clearInterval(progressInterval)
  //       audio.unload()
  //     }
  //   }
  // }, [audioRef.current, updateAudioProgress])

  return { audioRef, audioProgress, playAudio, stopAudio, killAudio }
}