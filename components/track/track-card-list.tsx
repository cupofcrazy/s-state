'use client'

import { useAudio } from "@/hooks/useAudio"
// import * as Popover from '@radix-ui/react-popover'
import { Track } from "@/types/spotify"
import { EllipsisHorizontalIcon, PauseIcon, PlayIcon, MusicalNoteIcon } from "@heroicons/react/24/solid"
import Image from "next/image"
import cn from 'classnames'


export const TrackCardList = ({ tracks }: { tracks: Track[] }) => {
  // const { playTrack, pauseTrack, resumeTrack, seek, setVolume, volume, audioProgress, isPlaying, currentTrack } = useAudio()
  return (
    <div className="flex flex-col gap-2">
      {tracks.map((track, index) => <TrackCard key={track.id} track={track} index={index} />)}
    </div>
  )
}

type TrackCardProps = {
  track: Track
  index: number
  // isActive: boolean
}

export const TrackCard = ({ track, index }: TrackCardProps) => {
  const { playTrack, pauseTrack, resumeTrack, seek, setVolume, volume, audioProgress, isPlaying, currentTrack } = useAudio()
  const isActive = currentTrack?.id === track.id && isPlaying

  return (
    <div className={cn("relative w-full rounded-2xl p-2 bg-neutral-100 transition-transform duration-300", isActive && "bg-neutral-800 scale-[1.01]")} >
      <div className="flex items-start gap-2">
        <div className={cn("absolute top-1 left-1 z-10 w-6 h-6 text-xs px-1 rounded-full flex items-center justify-center", {
          "bg-neutral-300 text-neutral-800": isActive,
          "bg-neutral-800 text-white": !isActive
        })}>{index + 1}</div>
        <div className="relative w-[72px] h-[72px] rounded-xl overflow-hidden border border-black/10">
          <img className="w-full h-full object-cover" src={track.album.images[0].url} alt={track.name} width={72} height={72} />
        </div>
        <div className="flex flex-col gap-0.5 w-[65%]">
          <p className={cn("text-sm", isActive && "text-white")}>{track.name}</p>
          <p className={cn("text-xs text-neutral-500", isActive && "text-neutral-300")}>{track.artists.map((artist) => artist.name).join(', ')}</p>
        </div>
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          <button
            onClick={() => {
              if (isActive) {
                pauseTrack()
              } else {
                playTrack(track)
              }
            }}
            className="p-2 rounded-full bg-neutral-200 text-neutral-800">
            {isActive ? <PauseIcon className="w-4 h-4" /> : <PlayIcon className="w-4 h-4" />}
          </button>
          <a aria-label="Open in Spotify" href={track.external_urls.spotify} target="_blank" className={cn("p-2 rounded-full bg-neutral-200",{
            "bg-neutral-700 text-white": isActive
          })}>
            <MusicalNoteIcon className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  )
}