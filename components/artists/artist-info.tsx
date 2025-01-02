'use client'

import { useEffect, useState } from "react"
import useSWR from "swr"
import cn from 'classnames'
import * as Dialog from '@radix-ui/react-dialog'
import { toast } from "sonner"
import { AnimatePresence, motion } from "framer-motion"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { addTracksToPlaylist, createPlaylist, getArtistRecommendations } from "@/actions/spotify"
import { useAudio } from "@/hooks/useAudio"
import { Artist } from "@/types/spotify"
import { TrackCardList } from "../track/track-card-list"
import { XMarkIcon } from "@heroicons/react/24/solid"


type ArtistInfoProps = {
  artist: Artist
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}


export const ArtistInfo = ({ artist, isOpen, onOpenChange }: ArtistInfoProps) => {
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false)
  const { isPlaying, pauseTrack } = useAudio()
  const { data: recs, isLoading: recsLoading } = useSWR(`/api/spotify/get-artist-recs?id=${artist.id}`, () => getArtistRecommendations(artist.id), {
    revalidateOnFocus: false,
  })

  const router = useRouter()


  useEffect(() => {
    if (isOpen || isPlaying) {
      pauseTrack()
    }
  }, [isOpen, isPlaying, pauseTrack])

  const handleCreatePlaylist = async () => {
    if (!recs?.tracks) {
      toast.error('No recommendations found. Try again later.')
      return
    }

    const playlistName = `${artist.name} Recommendations`
    setIsCreatingPlaylist(true)

    try {
      const playlist = await createPlaylist(playlistName)
      const recUris = recs?.tracks.map(track => track.uri)
      const res = await addTracksToPlaylist(playlist.id, recUris)

      toast.success(`Playlist ${playlist.name} created!`)

      router.push(`/playlist/${playlist.id}`)
    } catch (error) {
      toast.error('Error creating playlist. Try again later.')
    } finally {
      setIsCreatingPlaylist(false)
      onOpenChange(false)
    }
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <AnimatePresence mode="wait">
        {isOpen && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
            </Dialog.Overlay>
            <Dialog.Content>
              <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ ease: 'easeInOut', duration: .5 }} className="fixed top-0 bottom-0 right-0 w-full bg-white z-[9999] p-4 border-l overflow-y-auto md:w-2/3 lg:w-1/2">
                <div className="flex md:items-start flex-col items-center md:flex-row gap-2">
                  <img className="max-w-[120px] max-h-[120px] rounded-full" src={artist.images[0]?.url ?? "/images/placeholder.png"} alt={artist.name} width={120} height={120} />
                  <div className="flex flex-col gap-0.5">
                    <Dialog.Title className="text-xl font-semibold text-center md:text-left">{artist.name}</Dialog.Title>
                    <Dialog.Description className="text-sm text-neutral-500 text-center md:text-left">
                      {artist.genres.join(', ')}
                      
                    </Dialog.Description>
                    <div className="flex items-center gap-2">
                        <p className="text-neutral-500 px-2 py-1 bg-neutral-100 rounded-full border border-neutral-200 w-max mt-2">{artist.followers.total.toLocaleString("en-US", {
                          style: 'decimal',
                          maximumFractionDigits: 0,
                        })} followers</p>
                        <a href={artist.external_urls.spotify} target="_blank" rel="noreferrer" className="text-neutral-100 px-4 py-1 bg-neutral-800 rounded-full w-max mt-2">See artist on Spotify</a>
                      </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-8 mb-4">
                  <p className="text-lg text-neutral-700 text-center w-full">Tracks based on {artist.name}</p>
                </div>

                {recsLoading ? <p>Loading...</p> : <TrackCardList tracks={recs?.tracks ?? []} />}
                <Dialog.Close asChild>
                  <button className="fixed top-4 right-4 text-neutral-100 w-8 h-8 flex items-center justify-center bg-neutral-800 rounded-full" aria-label="Close side panel">
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </Dialog.Close>
                { <button className={cn('sticky bottom-2 left-[50%] translate-x-[-50%] bg-neutral-800 text-white px-4 py-2 rounded-full z-[9999]', {
                  'animate-pulse cursor-not-allowed': recsLoading,
                  'opacity-50 cursor-not-allowed': isCreatingPlaylist,
                })} disabled={isCreatingPlaylist || recsLoading} onClick={handleCreatePlaylist}>
                  {isCreatingPlaylist ? 'Creating...' : recsLoading ? 'Loading...' : 'Create Playlist'}
                </button> }
              </motion.div>

            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}