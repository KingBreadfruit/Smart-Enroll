"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useModuleSelection } from "./module-selection-context"

export type Payment = {
  moduleCode: string
  module: string
  occurence: string
  dateTime: string
  status: string
}

// Helper function to check if a module is full
const isModuleFull = (status: string) => {
  const [current, total] = status.split("/").map(Number)
  return current >= total
}

export const columns: ColumnDef<Payment>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => {
      const status = row.original.status
      const isFull = isModuleFull(status)

      // Use the context to check for time clashes
      const { hasTimeClash, selectedModules } = useModuleSelection()
      const module = row.original
      const wouldClash = hasTimeClash(module)

      // Determine if this module is already selected
      const isSelected = selectedModules.some((m) => m.moduleCode === module.moduleCode)

      // Only show clash warning if not already selected
      const showClashWarning = wouldClash && !isSelected

      const isDisabled = isFull || showClashWarning

      return (
        <div className="flex items-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            disabled={isDisabled}
            className={isDisabled ? "cursor-not-allowed opacity-50" : ""}
          />

          {showClashWarning && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <AlertCircle className="h-4 w-4 ml-2 text-amber-500" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Time clash with another selected module</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "moduleCode",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Module Code
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "module",
    header: "Module Name",
  },
  {
    accessorKey: "dateTime",
    header: "Schedule",
  },
  {
    accessorKey: "status",
    header: "Availability",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      const [current, total] = status.split("/").map(Number)
      const percentage = (current / total) * 100

      let statusColor = "text-green-600"
      let statusText = status

      if (percentage >= 100) {
        statusColor = "text-red-600 font-medium"
        statusText = "FULL"
      } else if (percentage >= 80) {
        statusColor = "text-red-600"
      } else if (percentage >= 60) {
        statusColor = "text-amber-600"
      } else if (percentage >= 40) {
        statusColor = "text-orange-500"
      }

      return <div className={statusColor}>{statusText}</div>
    },
  },
  {
    accessorKey: "occurence",
    header: "Occurrence",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const module = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(module.moduleCode)}>
              Copy module code
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem>View prerequisites</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

