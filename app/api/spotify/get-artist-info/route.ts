import { getArtistInfo } from "@/actions/spotify";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const data = await getArtistInfo(req.nextUrl.searchParams.get("id") as string)

  return NextResponse.json({ ...data })
}