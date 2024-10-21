'use client'

import { type TimeRange } from "@/types/spotify"
import { motion } from "framer-motion"
import useMeasure from "react-use-measure"
import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { DEFAULT_TIME_RANGE } from "@/utils/constants"
import { Spinner } from "./spinner"

type Filter = {
  label: string
  value: TimeRange
}

type FilterProps = {
  route: string
}

const variants = {
  initial: {
    opacity: 0,
    x: 16,
  },
  animate: {
    opacity: 1,
    x: 0,
  },
  exit: {
    opacity: 0,
    x: -16,
  },
}


export const Filter = ({ route }: FilterProps) => {
  const [ref, bounds] = useMeasure()
  const router = useRouter()
  const searchParams = useSearchParams()
  const timeRangeParam = searchParams.get("time_range")
  
  const [filters] = useState<Filter[]>([
    {
      label: "4 Weeks",
      value: "short_term",
    },
    {
      label: "6 Months",
      value: "medium_term",
    },
    {
      label: "Past Year",
      value: "long_term",
    },
  ])

  const [currentFilter, setCurrentFilter] = useState<Filter | null>(filters.find(filter => filter.value === timeRangeParam) || DEFAULT_TIME_RANGE as Filter)

  useEffect(() => {
    setCurrentFilter(filters.find(filter => filter.value === timeRangeParam) || DEFAULT_TIME_RANGE as Filter)
  }, [timeRangeParam, filters])

  return (
    <Suspense fallback={<Spinner />}>
    <motion.div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50">
      <motion.div className="font-sm bg-white rounded-full p-2 border border-black/5 shadow-sm flex items-center gap-0 mb-4" ref={ref}>
        {filters.map((filter) => (
          <motion.button key={filter.value} className="relative w-[84px] h-[36px] rounded-full" onClick={() => {
            setCurrentFilter(filter)
            router.push(`${route}?time_range=${filter.value}`)
          }}>
            { currentFilter?.value === filter.value && <motion.span transition={{ duration: 0.3, type: "spring" }} layoutId={`filter-bg`} className="bg-black w-full h-full absolute rounded-full z-[0] top-0 left-0 right-0 bottom-0" /> }
            <motion.span className={`relative z-10  ${currentFilter?.value === filter.value ? "text-white text-md" : "text-black/50 text-sm"}`}>{filter.label}</motion.span>
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
    </Suspense>
  )
}