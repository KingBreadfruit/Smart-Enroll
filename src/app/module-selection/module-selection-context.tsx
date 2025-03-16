"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { Payment } from "./columns"

interface ModuleSelectionContextType {
  selectedModules: Payment[]
  setSelectedModules: (modules: Payment[]) => void
  hasTimeClash: (newModule: Payment) => boolean
}

const ModuleSelectionContext = createContext<ModuleSelectionContextType>({
  selectedModules: [],
  setSelectedModules: () => {},
  hasTimeClash: () => false,
})

// Helper function to parse dateTime string
const parseDateTime = (dateTime: string) => {
  const parts = dateTime.split("-")
  if (parts.length >= 5) {
    return {
      day: parts[0],
      startHour: Number.parseInt(parts[1]),
      startPeriod: parts[2],
      endHour: Number.parseInt(parts[3]),
      endPeriod: parts[4],
    }
  }
  return null
}

// Helper function to check if two time ranges overlap
const doTimesOverlap = (
  day1: string,
  start1: number,
  startPeriod1: string,
  end1: number,
  endPeriod1: string,
  day2: string,
  start2: number,
  startPeriod2: string,
  end2: number,
  endPeriod2: string,
) => {
  if (day1 !== day2) return false

  // Convert to 24-hour format for easier comparison
  const convertTo24Hour = (hour: number, period: string) => {
    if (period.toLowerCase() === "am" && hour === 12) return 0
    if (period.toLowerCase() === "pm" && hour !== 12) return hour + 12
    return hour
  }

  const start1In24 = convertTo24Hour(start1, startPeriod1)
  const end1In24 = convertTo24Hour(end1, endPeriod1)
  const start2In24 = convertTo24Hour(start2, startPeriod2)
  const end2In24 = convertTo24Hour(end2, endPeriod2)

  // Check for overlap
  return (
    (start1In24 < end2In24 && end1In24 > start2In24) ||
    (start2In24 < end1In24 && end2In24 > start1In24) ||
    (start1In24 === start2In24 && end1In24 === end2In24)
  )
}

export function ModuleSelectionProvider({ children }: { children: ReactNode }) {
  const [selectedModules, setSelectedModules] = useState<Payment[]>([])

  // Function to check if a new module would clash with already selected modules
  const hasTimeClash = (newModule: Payment) => {
    const newDateTime = parseDateTime(newModule.dateTime)
    if (!newDateTime) return false

    return selectedModules.some((module) => {
      // Skip checking against itself
      if (module.moduleCode === newModule.moduleCode) return false

      const moduleDateTime = parseDateTime(module.dateTime)
      if (!moduleDateTime) return false

      return doTimesOverlap(
        newDateTime.day,
        newDateTime.startHour,
        newDateTime.startPeriod,
        newDateTime.endHour,
        newDateTime.endPeriod,
        moduleDateTime.day,
        moduleDateTime.startHour,
        moduleDateTime.startPeriod,
        moduleDateTime.endHour,
        moduleDateTime.endPeriod,
      )
    })
  }

  return (
    <ModuleSelectionContext.Provider value={{ selectedModules, setSelectedModules, hasTimeClash }}>
      {children}
    </ModuleSelectionContext.Provider>
  )
}

export function useModuleSelection() {
  return useContext(ModuleSelectionContext)
}

