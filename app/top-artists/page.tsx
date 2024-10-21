'use client'

import useSWR from "swr";
import { Spinner } from "@/components/ui/spinner";
import { fetcher } from "@/utils/fetcher";
import { Artist, SpotifyResponse, TimeRange } from "@/types/spotify";
import { Filter } from "@/components/ui/filter";
import { useSearchParams } from "next/navigation";
import { DEFAULT_TIME_RANGE } from "@/utils/constants";
import { ArtistList } from "@/components/artists/artist-list";

export default function TopArtists() {
  const query = useSearchParams();
  const timeRange = query.get("time_range") ?? DEFAULT_TIME_RANGE.value;
  
  const { data, error, isLoading } = useSWR<SpotifyResponse<Artist>>(
    [`/api/spotify/get-top-artists`, timeRange],
    ([url, timeRange]) => fetcher(`${url}?time_range=${timeRange}`)
  );
  
  return (
      <div className="min-h-screen md:w-screen md:flex md:items-center md:justify-center">
        { isLoading ? <Spinner /> : <ArtistList artists={data?.items ?? []} /> }
        <Filter route="/top-artists" />
      </div>
  )
}