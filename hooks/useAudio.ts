import { useContext } from "react"
import { TrackAudioContext } from "@/contexts/AudioProvider"

export const useAudio = () => {
  const context = useContext(TrackAudioContext)
  if (!context) throw new Error("useAudio must be used within a TrackAudioContextProvider")


  const {
    currentTrack,
    isPlaying,
    audioProgress,
    volume,
    playTrack,
    pauseTrack,
    resumeTrack,
    setVolume,
    seek,
  } = context

  

  return {
    currentTrack,
    isPlaying,
    audioProgress,
    volume,
    playTrack,
    pauseTrack,
    resumeTrack,
    setVolume,
    seek,
  }
}
