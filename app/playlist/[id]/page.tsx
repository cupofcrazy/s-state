import { getPlaylist } from "@/actions/spotify"
import { TrackCardList } from "@/components/track/track-card-list"
import Image from "next/image"

type Params = {
  id: string
}

export default async function PlaylistPage({ params }: { params: Params }) {
  const playlist = await getPlaylist(params.id)

  console.log(playlist)

  return (
    <div className="px-4 py-24">
      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-5 sm:col-span-2 flex flex-col gap-4">
          <div className="sm:sticky sm:top-16">
            <Image className="w-full rounded-lg" src={playlist.images[0].url} alt={playlist.name} width={300} height={300} />
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-bold text-center">{playlist.name} <br /> ({playlist.tracks.items.length} songs)</h1>
              <a href={playlist.external_urls.spotify} target="_blank" rel="noreferrer" className="text-smw-full text-center bg-neutral-800 rounded-full text-white p-2">Open in Spotify</a>
            </div>
          </div>
        </div>
        <div className="col-span-5 sm:col-span-3">
          <TrackCardList tracks={playlist.tracks.items.map((item) => item.track)} />
        </div>
      </div>
    </div>
  )
}