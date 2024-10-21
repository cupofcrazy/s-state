'use client'

import useSWR from "swr";
import { Landing } from "@/components/layout/landing";
import { TrackList } from "@/components/track/track-list";
import { fetcher } from "@/utils/fetcher";
import { useSession } from "next-auth/react";
import { Spinner } from "@/components/ui/spinner";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Filter } from "@/components/ui/filter"
import { DEFAULT_TIME_RANGE, TIME_RANGES } from "@/utils/constants";
import { TimeRange } from "@/types/spotify";
import NotFound from "../not-found";

export default function Home() {
  const query = useSearchParams();
  const { data, error, isLoading } = useSWR(`/api/spotify/get-top-tracks?time_range=${query.get("time_range") || DEFAULT_TIME_RANGE.value}`, fetcher);

  if (error || (query.get("time_range") && !TIME_RANGES.find((range) => range.value === query.get("time_range")))) {
    return <NotFound />
  }

  return (
    <main className="min-h-screen md:mx-0">
      { isLoading ? <div className="flex items-center justify-center h-screen">
      <div className="flex items-center justify-center">
        <Spinner />
      </div>
      </div> : <TrackList tracks={data?.items} />}
      <Filter route="/top-tracks"  />
    </main>
  );
}
