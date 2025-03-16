"use client"
import { useModuleSelection } from "./module-selection-context"
import { Card, CardContent } from "@/components/ui/card"

export function Timetable() {
  const { selectedModules } = useModuleSelection()

  // Define days and time slots
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"]
  const timeSlots = ["8 am", "9 am", "10 am", "11 am", "12 pm", "1 pm", "2 pm", "3 pm", "4 pm", "5 pm", "6 pm"]

  // Parse the dateTime string to get day, start time, and end time
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

  // Calculate the row span based on start and end times
  const calculateRowSpan = (startHour: number, startPeriod: string, endHour: number, endPeriod: string) => {
    const startIndex = timeSlots.findIndex((slot) => slot === `${startHour} ${startPeriod}`)
    const endIndex = timeSlots.findIndex((slot) => slot === `${endHour} ${endPeriod}`)

    if (startIndex === -1 || endIndex === -1) return 1
    return endIndex - startIndex + 1
  }

  // Create a map of modules by day and time slot
  const modulesByDayAndTime = new Map()

  selectedModules.forEach((module) => {
    const dateTime = parseDateTime(module.dateTime)
    if (dateTime) {
      const { day, startHour, startPeriod } = dateTime
      const timeSlot = `${startHour} ${startPeriod}`

      const key = `${day}-${timeSlot}`
      if (!modulesByDayAndTime.has(key)) {
        modulesByDayAndTime.set(key, [])
      }
      modulesByDayAndTime.get(key).push(module)
    }
  })

  // Check if a cell has a module
  const getModuleForCell = (day: string, timeSlot: string) => {
    const key = `${day}-${timeSlot}`
    return modulesByDayAndTime.get(key) || []
  }

  // Check if a cell should be rendered (to handle rowspan)
  const shouldRenderCell = (day: string, timeSlot: string) => {
    const timeIndex = timeSlots.indexOf(timeSlot)
    if (timeIndex === 0) return true // Always render the first row

    // Check if any previous time slots have a module that spans to this slot
    for (let i = 0; i < timeIndex; i++) {
      const prevTimeSlot = timeSlots[i]
      const prevModules = getModuleForCell(day, prevTimeSlot)

      for (const module of prevModules) {
        const dateTime = parseDateTime(module.dateTime)
        if (dateTime) {
          const rowSpan = calculateRowSpan(
            dateTime.startHour,
            dateTime.startPeriod,
            dateTime.endHour,
            dateTime.endPeriod,
          )

          const startIndex = timeSlots.indexOf(`${dateTime.startHour} ${dateTime.startPeriod}`)
          if (startIndex + rowSpan > timeIndex) {
            return false
          }
        }
      }
    }

    return true
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-muted">
            <th className="border p-2 w-20">Time</th>
            {days.map((day) => (
              <th key={day} className="border p-2 w-1/5">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timeSlots.map((timeSlot) => (
            <tr key={timeSlot}>
              <td className="border p-2 font-medium text-center">{timeSlot}</td>
              {days.map((day) => {
                const modules = getModuleForCell(day, timeSlot)

                if (!shouldRenderCell(day, timeSlot)) {
                  return null // Skip rendering this cell due to rowspan
                }

                if (modules.length === 0) {
                  return <td key={`${day}-${timeSlot}`} className="border p-2"></td>
                }

                return (
                  <td
                    key={`${day}-${timeSlot}`}
                    className="border p-1"
                    rowSpan={
                      modules.length > 0
                        ? calculateRowSpan(
                            parseDateTime(modules[0].dateTime)?.startHour || 0,
                            parseDateTime(modules[0].dateTime)?.startPeriod || "am",
                            parseDateTime(modules[0].dateTime)?.endHour || 0,
                            parseDateTime(modules[0].dateTime)?.endPeriod || "am",
                          )
                        : 1
                    }
                  >
                    {modules.map((module, index) => (
                      <Card key={index} className="mb-1 bg-primary/10 border-primary/20">
                        <CardContent className="p-2">
                          <div className="text-xs font-bold" style={{ color: "#E67700" }}>
                            {module.moduleCode}
                          </div>
                          <div className="text-xs truncate">{module.module}</div>
                          <div className="text-xs text-muted-foreground">{module.occurence}</div>
                        </CardContent>
                      </Card>
                    ))}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {selectedModules.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No modules selected. Select modules from the table above to see your timetable.
        </div>
      )}
    </div>
  )
}

