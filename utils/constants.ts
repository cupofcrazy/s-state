import { TimeRange } from "@/types/spotify"

export const TIME_RANGES: { value: TimeRange; label: string }[] = [
  {
    value: "short_term",
    label: "4 Wks",
  },
  {
    value: "medium_term",
    label: "6 Mths",
  },
  {
    value: "long_term",
    label: "All Time",
  },
]


export const DEFAULT_TIME_RANGE = TIME_RANGES[0]