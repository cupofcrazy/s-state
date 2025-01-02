'use client'

  import Image from "next/image"
import { Artist } from "@/types/spotify"
import { useState } from "react"
import { ArtistInfo } from "./artist-info"
import ScrollContainer from "../ui/scroll"
import { useMediaQuery } from "usehooks-ts"

export const ArtistList = ({ artists }: { artists: Artist[] }) => {
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const isMobile = useMediaQuery('(max-width: 768px)')


  return (
    <div className="px-4 md:px-0 py-24 md:py-0">
    { isMobile ? (
      <div className="min-h-screen w-full grid grid-cols-2 gap-4">
        {artists.map((artist) => (
          <button key={artist.id} className="w-full flex-1 transition-all duration-300"
            onClick={() => {
              setSelectedArtist(artist)
              setIsDialogOpen(true)
            }}
          >
          <div className="overflow-hidden">
            <img className="w-full rounded-full object-cover" src={artist.images[0]?.url ?? ""} alt={artist.name ?? ""} width={150} height={150} />
          </div>

          <p className="text-sm mt-2">{artist.name}</p>
        </button>
        ))}
      </div>
    ) : (
      <div className="h-screen w-screen flex items-center justify-center">
        <ScrollContainer 
          className="scroll-container h-[100vh] flex items-center" 
          intersectionThreshold={0.1} 
          speed={0.5}
          onElementInView={(element, isIntersecting) => {
            if (isIntersecting) {
              element.classList.add('active')
            } else {
              element.classList.remove('active')
            }
          }}
          >
          {artists.map((artist) => (
            <button key={artist.id} className="card w-[150px] flex-1 mr-16 first:ml-[25vw] last:mr-[25vw] transition-all duration-300 scale-[0.9] touch-none select-none"
            style={{
              // @ts-ignore
              WebkitUserDrag: 'none',
            }}
            onClick={() => {
              setSelectedArtist(artist)
              setIsDialogOpen(true)
            }}
          >
            <div className="overflow-hidden">
              <img draggable={false} className="w-full rounded-full object-cover" src={artist?.images[0]?.url ?? "/images/placeholder.png"} alt={artist?.name ?? ""} width={150} height={150} />
            </div>

            <p className="text-sm mt-2">{artist.name}</p>
          </button>
          ))}
        </ScrollContainer>
      </div>
        )}
      {selectedArtist && <ArtistInfo artist={selectedArtist} isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} />}
    </div>
  )
}