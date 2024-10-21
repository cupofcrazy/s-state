import { getTopArtists } from "@/actions/spotify";
import { TimeRange } from "@/types/spotify";
import { DEFAULT_TIME_RANGE } from "@/utils/constants";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const timeRange = searchParams.get("time_range") as TimeRange;

  const { items, error } = await getTopArtists({
    time_range: timeRange ?? "short_term"

  });
  return NextResponse.json({ items, error });
}